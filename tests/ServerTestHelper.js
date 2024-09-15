/* istanbul ignore file */

const Jwt = require('@hapi/jwt');
const UsersTableTestHelper = require('./UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('./AuthenticationsTableTestHelper');

const ServerTestHelper = {
  async getAccessToken({
    id = 'user-123',
    username = 'dicoding',
    password = 'somerandompassword',
    fullname = 'Dicoding Indonesia',
  }) {
    const payloadUser = {
      id, username, password, fullname,
    };

    await UsersTableTestHelper.addUser(payloadUser);

    const accessToken = Jwt.token.generate(
      payloadUser,
      process.env.ACCESS_TOKEN_KEY,
    );
    const refreshToken = Jwt.token.generate(
      payloadUser,
      process.env.REFRESH_TOKEN_KEY,
    );

    await AuthenticationsTableTestHelper.addToken(refreshToken);

    return accessToken;
  },
};

module.exports = ServerTestHelper;