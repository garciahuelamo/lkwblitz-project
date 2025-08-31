const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../database/mysql');
const crypto = require('crypto')
const transporter = require('../config/mailer.js')

require('dotenv').config();

    //LOGIN:

exports.login = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const [rows] = await pool.query(
            'SELECT id, email, password, name, role FROM users WHERE email = ?', 
            [email]
        );

        const user = rows[0];
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ message: "Invalid credentials" });

        const expiresIn = rememberMe ? '30d' : (process.env.JWT_EXPIRES_IN || '1d');

        const token = jwt.sign(
            { sub: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn }
        );

        return res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal error" });
    }
};

    //REGISTER:

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        // Validación para crear admin sólo si eres admin
        if (role === 'admin') {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(403).json({ message: "Not authorized to create admin" });
            }

            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if (decoded.role !== 'admin') {
                    return res.status(403).json({ message: "Only admins can create another admin" });
                }
            } catch {
                return res.status(403).json({ message: "Invalid token" });
            }
        }

        const [exists] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (exists.length > 0) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const finalRole = role === 'admin' ? 'admin' : 'user';

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, finalRole]
        );

        const mailOptions = {
            from: `"LKW Blitz" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Welcome to LKW Blitz! 🚚",
            html: `
                <h3>Hello ${name} 👋</h3>
                <p>Thanks for your registration with <b>LKW Blitz</b>.</p>
                <p>We are delighted to have you here.</p>
                <p>Please, check the app to complete your profile.</p>
                <p>Greetings from the team - 🚀</p>
            `
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Welcome email sent to ${email}`);
        } catch (err) {
          console.error("Error sending email:", err);
        }

        const token = jwt.sign(
            { sub: result.insertId, email, role: finalRole },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        return res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: result.insertId, name, email, role: finalRole }
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal error" });
    }
};

    //RESET THE PASSWORD

exports.forgotPassword = async (req, res) => {
    
    const { email } = req.body;

    if(!email) return res.status(400).json({ message: "Email address required" });

    try {
        const [rows] = await pool.query('SELECT id, name FROM users WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(400).json({ message: "Email address not registered"});

        const user = rows[0];

        //To generate a token

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000); //3600000 = 1 hour

        //To save token in the db

        await pool.query(
            'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)',
            [user.id, token, expiresAt]
        );

        //Create the link to reset the password

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        //Send email

        const mailOptions = {
            from: `"LKW Blitz" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Reset password email',
            html: `
                <p>Hello ${user.name},</p>
                <p>We have received a request to reset your password.</p>
                <p>Click on the following link to create a new password:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>This link is valid for 1 hour. </p>
                <p>If you did not request this change, please ignore this email.</p> 
                <p>Your LKW Blitz Team 🚚</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "Reset email sent" })
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "intern error" });
    }
};

    //RESET PASSWORD

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) return res.status(400).json({ message: "incomplete data" });

  try {
    const [rows] = await pool.query(
      'SELECT user_id, expires_at FROM password_resets WHERE token = ?',
      [token]
    );

    if (rows.length === 0) return res.status(400).json({ message: "Invalid token" });

    const reset = rows[0];

    if (new Date() > reset.expires_at) {
      return res.status(400).json({ message: "Expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, reset.user_id]
    );

    await pool.query('DELETE FROM password_resets WHERE token = ?', [token]);

    res.json({ message: "Password successfully updated" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Intern error" });
  }
};

    //UPDATE USER:

exports.updateUser = async (req, res) => {
  const userId = req.params.userId;
  const { name, email } = req.body;

  if (!name && !email) {
    return res.status(400).json({ message: "No data to update" });
  }

  try {
    // Verificar si el usuario existe
    const [existingUsers] = await pool.query('SELECT id FROM users WHERE id = ?', [userId]);
    if (existingUsers.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Construir query dinámica para actualizar sólo los campos enviados
    let updateFields = [];
    let updateValues = [];

    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }

    updateValues.push(userId);

    const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    await pool.query(sql, updateValues);

    // Devolver usuario actualizado
    const [updatedUsers] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [userId]);

    res.json({ message: "User updated", user: updatedUsers[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error" });
  }
};
