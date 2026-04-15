import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashData = async (data: string): Promise<string> => {
  const hashed = await bcrypt.hash(data, SALT_ROUNDS);
  return hashed;
};

export const compareHash = async (data: string, hashed: string): Promise<boolean> => {
  const isValid = await bcrypt.compare(data, hashed);
  return isValid;
};
