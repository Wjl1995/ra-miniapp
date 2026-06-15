const { request } = require('./request');

const getLoginCode = () => new Promise((resolve, reject) => {
  wx.login({
    success(res) {
      resolve(res.code);
    },
    fail(err) {
      reject(err);
    },
  });
});

const login = async () => {
  const code = await getLoginCode();
  const data = await request({
    url: '/api/v1/auth/wx-login',
    method: 'POST',
    data: { code },
  });
  const app = getApp();
  app.globalData.token = data.token;
  app.globalData.user = data.user;
  wx.setStorageSync('token', data.token);
  wx.setStorageSync('user', data.user);
  return data;
};

module.exports = { login };
