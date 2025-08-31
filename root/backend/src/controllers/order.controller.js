const shippo = require('../services/authShippo');
const { saveOrder, getOrders, getOrderById } = require('../repositories/order.repository');

/**
 * Crear una nueva orden
 */
async function createOrder(req, res) {
  try {
    const orderData = req.body;
    const savedOrderId = await saveOrder(orderData);
    res.status(201).json({ id: savedOrderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating order' });
  }
}

/**
 * Obtener tarifas de envío desde Shippo
 */
async function getRates(req, res) {
  const { address_from, address_to, parcels } = req.body;

  if (!address_from || !address_to || !parcels || parcels.length === 0) {
    return res.status(400).json({ message: 'Missing required shipping data' });
  }

  // Validar campos
  const requiredAddressFields = ['name', 'street1', 'city', 'state', 'zip', 'country'];
  for (const field of requiredAddressFields) {
    if (!address_from[field] || !address_to[field]) {
      return res.status(400).json({ message: `Missing field ${field} in address_from or address_to` });
    }
  }

  parcels.forEach((parcel, idx) => {
    const requiredParcelFields = ['length', 'width', 'height', 'distance_unit', 'weight', 'mass_unit'];
    for (const field of requiredParcelFields) {
      if (!parcel[field]) {
        return res.status(400).json({ message: `Missing field ${field} in parcel index ${idx}` });
      }
    }
  });

  try {
    const { data } = await shippo.post('/shipments/', {
      address_from,
      address_to,
      parcels,
      async: false
    });

    const formattedRates = data.rates.map(rate => ({
      object_id: rate.object_id,
      provider: rate.provider,
      servicelevel: rate.servicelevel.name,
      amount: rate.amount,
      currency: rate.currency,
      estimated_days: rate.estimated_days
    }));

    res.status(200).json({
      shipment_id: data.object_id,
      rates: formattedRates
    });
  } catch (err) {
    console.error('Error Shippo:', err.response?.data || err.message || err);
    res.status(err.response?.status || 500).json(err.response?.data || { message: err.message || 'Internal server error' });
  }
}

/**
 * Comprar etiqueta usando el rate elegido por el usuario
 */
async function buyLabel(req, res) {
  try {
    const { order_object_id, rateObjectId } = req.body;

    if (!order_object_id || !rateObjectId) {
      return res.status(400).json({ message: 'Missing order_object_id or rateObjectId' });
    }

    const { data } = await shippo.post('/transactions/', {
      rate: rateObjectId,
      label_file_type: 'PDF',
    });

    if (data.object_status === 'SUCCESS') {
      // Actualizar la orden existente con shipment info
      await saveOrder({
        object_id: order_object_id,
        shipment_id: data.shipment,
        tracking_number: data.tracking_number,
        label_url: data.label_url,
        order_status: 'SHIPPED' // opcional: actualizar status
      });

      return res.status(201).json({
        tracking_number: data.tracking_number,
        label_url: data.label_url,
      });
    } else {
      return res.status(400).json({ error: data.messages });
    }
  } catch (err) {
    console.error(err?.response?.data || err);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { message: err.message });
  }
}

/**
 * Listar órdenes con paginación
 */
async function listOrders(req, res) {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const orders = await getOrders({ limit, offset });
    res.json({ count: orders.length, data: orders });
  } catch (err) {
    console.error('Error listOrders:', err);
    res.status(500).json({ message: 'Error getting orders' });
  }
}

/**
 * Obtener orden por object_id
 */
async function getOrder(req, res) {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Error getOrder:', err);
    res.status(500).json({ message: 'Error getting order' });
  }
}

module.exports = {
  createOrder,
  getRates,
  buyLabel,
  listOrders,
  getOrder,
};
