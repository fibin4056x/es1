export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone) => {
  return /^\d{10}$/.test(phone);
};

export const isValidAadhaar = (aadhaar) => {
  return /^\d{12}$/.test(aadhaar);
};
