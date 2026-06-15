const { request } = require('./request');
const { API_BASE_URL } = require('../config/env');

const login = async () => {
  const { code } = await wx.login();
  return request({
    url: `${API_BASE_URL}/api/v1/auth/wx-login`,
    method: 'POST',
    data: { code },
  });
};

module.exports = { login };
