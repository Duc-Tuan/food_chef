const { sign, verify } = require('jsonwebtoken');

const createTokens = (data: any) => {
  const accessToken = sign(data, 'jwtsecretplschange', {
    expiresIn: '30d',
  });
  return accessToken;
};

const validateToken = (token: string) => {
  try {
    const validToken = verify(token, 'jwtsecretplschange');
    return {
      validToken,
    };
  } catch (err) {
    return {
      status: false,
      mess: 'Tài khoản của bạn đã hết phiên đăng nhập. Vui lòng đăng nhập lại.',
    };
  }
};

module.exports = { createTokens, validateToken };
