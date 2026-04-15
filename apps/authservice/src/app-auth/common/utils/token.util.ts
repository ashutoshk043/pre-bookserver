import { JwtService } from '@nestjs/jwt';

export const generateTokens = async (
  jwtService: JwtService,
  payload: { user_id: string; mobile: string, roleId:string },
) => {
  const accessSecret = process.env.JWT_SECRET;
  const refreshSecret = process.env.JWT_SECRET;

  // 🔥 HARD FAIL (best practice)
  if (!accessSecret || !refreshSecret) {
    throw new Error('JWT secrets are missing in environment variables');
  }

  const accessToken = await jwtService.signAsync(payload, {
    secret: accessSecret,
    expiresIn: '1d',
  });

  const refreshToken = await jwtService.signAsync(payload, {
    secret: refreshSecret,
    expiresIn: '30d',
  });

  return { accessToken, refreshToken };
};