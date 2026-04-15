// 🔢 OTP attempt tracking key (YOUR REQUIREMENT ✅)
export const otpAttemptKey = (mobile: string): string => {
  return `otp_attempt:${mobile}`;
};