const { sign, verify } = require('jsonwebtoken');

const tokenkey: string = 'jwtsecretplschange';

const createTokens = (data: any) => {
  const accessToken = sign(data, tokenkey, {
    expiresIn: '30s',
  });
  return accessToken;
};

const validateToken = (token: string) => {
  try {
    const validToken = verify(token, tokenkey);
    return {
      status: true,
      id: validToken?.id,
    };
  } catch (err) {
    return {
      status: false,
      mess: 'Tài khoản của bạn đã hết phiên đăng nhập. Vui lòng đăng nhập lại.',
    };
  }
};

export { createTokens, validateToken };
