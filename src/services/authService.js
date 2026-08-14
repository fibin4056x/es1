import api from "./api";

/**
 * 1. Login user (principal or teacher)
 */
export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", {
    email: (email || "").trim(),
    password,
  });
  return response.data;
};

/**
 * 2. Logout user (clears HTTP-only cookies on server)
 */
export const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (err) {
    return null;
  }
};

/**
 * 3. Request OTP for first-time teacher verification
 */
export const requestTeacherOtp = async (email) => {
  const response = await api.post("/auth/teacher/request-verification-otp", {
    email: (email || "").trim(),
  });
  return response.data;
};

/**
 * 4. Verify OTP for first-time teacher
 */
export const verifyTeacherOtp = async (email, otp) => {
  const response = await api.post("/auth/teacher/verify-otp", {
    email: (email || "").trim(),
    otp,
  });
  return response.data;
};

/**
 * 5. Complete first login (Set permanent password)
 */
export const completeFirstLogin = async (setupToken, newPassword, confirmPassword) => {
  const response = await api.post(
    "/auth/teacher/complete-first-login",
    { newPassword, confirmPassword },
    {
      headers: {
        Authorization: `Bearer ${setupToken}`,
      },
    }
  );
  return response.data;
};

/**
 * 6. Forgot Password - Request OTP
 */
export const requestForgotPasswordOtp = async (email) => {
  const response = await api.post("/auth/forgot-password/request-otp", {
    email: (email || "").trim(),
  });
  return response.data;
};

/**
 * 7. Forgot Password - Verify OTP
 */
export const verifyForgotPasswordOtp = async (email, otp) => {
  const response = await api.post("/auth/forgot-password/verify-otp", {
    email: (email || "").trim(),
    otp,
  });
  return response.data;
};

/**
 * 8. Forgot Password - Reset Password
 */
export const resetPassword = async (resetToken, newPassword, confirmPassword) => {
  const response = await api.post(
    "/auth/forgot-password/reset",
    { newPassword, confirmPassword },
    {
      headers: {
        Authorization: `Bearer ${resetToken}`,
      },
    }
  );
  return response.data;
};

/**
 * 9. Change Password (Authenticated user)
 */
export const changePassword = async (currentPassword, newPassword, confirmPassword) => {
  const response = await api.patch("/auth/change-password", {
    currentPassword,
    newPassword,
    confirmPassword,
  });
  return response.data;
};

/**
 * 10. Update Profile
 */
export const updateProfile = async (profileData) => {
  const response = await api.put("/auth/profile", profileData);
  return response.data;
};

/**
 * 11. Get Current Authenticated User Info
 */
export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};