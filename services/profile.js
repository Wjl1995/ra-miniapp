const { request } = require('../utils/request');

const updateProfile = ({ nickname = '', avatar = '' }) => request({
  url: '/api/v1/me/profile',
  method: 'PUT',
  data: { nickname, avatar },
});

module.exports = {
  updateProfile,
};
