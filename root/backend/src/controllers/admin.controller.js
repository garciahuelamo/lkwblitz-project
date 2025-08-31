const pool = require('../database/mysql');

const adminController = (req, res) => {
  res.json({ message: 'Admin data: Welcome, Admin!', user: req.user });
};

// Cambiar rol de usuario
const changeUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    // Validar datos
    if (!userId || !newRole) {
      return res.status(400).json({ message: 'User ID and new role are required' });
    }

    // Validar rol permitido
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Actualizar rol en base de datos
    const [result] = await pool.query(
      'UPDATE users SET role = ? WHERE id = ?',
      [newRole, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const [result] = await pool.query(
      'DELETE FROM users WHERE id = ?',
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, role FROM users');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  adminController,
  changeUserRole,
  deleteUser,
  getUsers,
};