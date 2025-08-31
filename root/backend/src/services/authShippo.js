const axios = require('axios');

const shippo = axios.create({
  baseURL: 'https://api.goshippo.com',
  headers: { 'Content-Type': 'application/json' },
});

shippo.interceptors.request.use((config) => {
  config.headers.Authorization = `ShippoToken ${process.env.SHIPPO_API_TOKEN}`;
  return config;
});

module.exports = shippo;
