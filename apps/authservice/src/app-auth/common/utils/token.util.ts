import { JwtService } from '@nestjs/jwt';

export const generateTokens = async (
  jwtService: JwtService,
  payload: { user_id: string; mobile: string; roleId: string },
) => {
  const accessSecret = process.env.JWT_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!accessSecret || !refreshSecret) {
    throw new Error('JWT secrets are missing in environment variables');
  }

  // 🔐 Access Token (short-lived)
  const accessToken = await jwtService.signAsync(
    {
      ...payload,
      type: 'access', // 👈 important
    },
    {
      secret: accessSecret,
      expiresIn: '15m',
    }
  );

  // 🔁 Refresh Token (long-lived)
  const refreshToken = await jwtService.signAsync(
    {
      ...payload,
      type: 'refresh', // 👈 important
    },
    {
      secret: refreshSecret,
      expiresIn: '7d',
    }
  );

  return { accessToken, refreshToken };
};