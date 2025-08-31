const pool = require('../database/mysql');

/**
 * Guarda/actualiza la orden en 'orders'.
 * Si viene shipment_id, tracking_number o label_url, también los guarda.
 */
async function saveOrder(order) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const insertSql = `
      INSERT INTO orders (
        object_id, order_number, order_status, placed_at,
        currency, subtotal_price, total_price, total_tax,
        shipping_cost, shipping_cost_currency, shipping_method,
        weight, weight_unit,
        to_name, to_email, to_phone, to_city, to_state, to_zip,
        to_country, to_street1, to_street2,
        shipment_id, tracking_number, label_url
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        order_number = VALUES(order_number),
        order_status = VALUES(order_status),
        placed_at = VALUES(placed_at),
        currency = VALUES(currency),
        subtotal_price = VALUES(subtotal_price),
        total_price = VALUES(total_price),
        total_tax = VALUES(total_tax),
        shipping_cost = VALUES(shipping_cost),
        shipping_cost_currency = VALUES(shipping_cost_currency),
        shipping_method = VALUES(shipping_method),
        weight = VALUES(weight),
        weight_unit = VALUES(weight_unit),
        to_name = VALUES(to_name),
        to_email = VALUES(to_email),
        to_phone = VALUES(to_phone),
        to_city = VALUES(to_city),
        to_state = VALUES(to_state),
        to_zip = VALUES(to_zip),
        to_country = VALUES(to_country),
        to_street1 = VALUES(to_street1),
        to_street2 = VALUES(to_street2),
        shipment_id = VALUES(shipment_id),
        tracking_number = VALUES(tracking_number),
        label_url = VALUES(label_url)
    `;

    const to = order.to_address || {};

    const params = [
      order.object_id,
      order.order_number || '',
      order.order_status || 'CREATED',
      order.placed_at || null,
      order.currency || 'USD',
      num(order.subtotal_price),
      num(order.total_price),
      num(order.total_tax),
      num(order.shipping_cost),
      order.shipping_cost_currency || order.currency || 'USD',
      order.shipping_method || '',
      num(order.weight),
      order.weight_unit || 'lb',
      to.name || '',
      to.email || '',
      to.phone || null,
      to.city || '',
      to.state || '',
      to.zip || '',
      to.country || 'US',
      to.street1 || '',
      to.street2 || null,
      order.shipment_id || null,
      order.tracking_number || null,
      order.label_url || null
    ];

    await conn.execute(insertSql, params);

    // Obtener el id de la orden
    const [[{ id: orderId }]] = await conn.query(
      'SELECT id FROM orders WHERE object_id = ? LIMIT 1',
      [order.object_id]
    );

    await conn.commit();
    return orderId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function getOrders({ limit = 50, offset = 0 } = {}) {
  const [rows] = await pool.query(
    'SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [Number(limit), Number(offset)]
  );
  return rows;
}

async function getOrderById(objectId) {
  const [rows] = await pool.execute(
    'SELECT * FROM orders WHERE object_id = ? LIMIT 1',
    [String(objectId)]
  );
  return rows[0] || null;
}

function num(v) {
  if (v == null) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

module.exports = {
  saveOrder,
  getOrders,
  getOrderById
};
