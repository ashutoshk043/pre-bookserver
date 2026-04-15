export const normalizeMobile = (mobile: string): string => {
  if (!mobile) return mobile;

  let normalized = mobile.trim();
  normalized = normalized.replace(/[^0-9]/g, '');

  if (normalized.length === 10) {
    return `+91${normalized}`;
  }

  if (normalized.length === 11 && normalized.startsWith('0')) {
    return `+91${normalized.slice(1)}`;
  }

  if (normalized.length === 12 && normalized.startsWith('91')) {
    return `+${normalized}`;
  }

  if (normalized.length === 13 && normalized.startsWith('091')) {
    return `+${normalized.slice(1)}`;
  }

  return normalized;
};
