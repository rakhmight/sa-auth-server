import 'dotenv/config'

export const jwtParams = {
  secret: {
    private: process.env.JWT_PRIVATE,
    public: process.env.JWT_PUBLIC
  },
  cookie: {
    cookieName: 'refreshToken',
  },
  sign: {
    expiresIn: '1d',
    algorithm: 'RS256'
  }
}