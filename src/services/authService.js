import api from "./api";

/**
 * 1. Login user
 */
export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", {
    email: (email || "").trim(),
    password,
  });

  return response.data;
};

/**
 * 2. Logout user
 */
export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

/**
 * 3. Request OTP for first-time teacher verification
 */
export const requestTeacherOtp = async (email) => {
  const response = await api.post(
    "/auth/teacher/request-verification-otp",
    {
      email: (email || "").trim(),
    }
  );

  return response.data;
};

/**
 * 4. Verify OTP
 */
export const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post("/auth/verify-otp", {
      email: (email || "").trim(),
      otp: String(otp).trim(),
    });

    return response.data;
  } catch (err) {
    if (err?.response?.status === 404) {
      const fallbackRes = await api.post(
        "/auth/teacher/verify-otp",
        {
          email: (email || "").trim(),
          otp: String(otp).trim(),
        }
      );

      return fallbackRes.data;
    }

    throw err;
  }
};

export const verifyTeacherOtp = async (email, otp) => {
  return verifyOtp(email, otp);
};

/**
 * 5. Resend OTP
 */
export const resendOtp = async (email) => {
  try {
    const response = await api.post("/auth/resend-otp", {
      email: (email || "").trim(),
    });

    return response.data;
  } catch (err) {
    if (err?.response?.status === 404) {
      const fallbackRes = await api.post(
        "/auth/teacher/request-verification-otp",
        {
          email: (email || "").trim(),
        }
      );

      return fallbackRes.data;
    }

    throw err;
  }
};

/**
 * 6. Complete first teacher login
 */
export const completeFirstLogin = async (
  setupToken,
  newPassword,
  confirmPassword
) => {
  const response = await api.post(
    "/auth/teacher/complete-first-login",
    {
      newPassword,
      confirmPassword,
    },
    {
      headers: {
        Authorization: `Bearer ${setupToken}`,
      },
    }
  );

  return response.data;
};

/**
 * 7. Forgot Password - Request OTP
 */
export const requestForgotPasswordOtp = async (email) => {
  const response = await api.post(
    "/auth/forgot-password/request-otp",
    {
      email: (email || "").trim(),
    }
  );

  return response.data;
};

/**
 * 8. Forgot Password - Verify OTP
 *
 * Backend stores the reset token in an HttpOnly cookie.
 * The token is NOT returned to the frontend.
 */
export const verifyForgotPasswordOtp = async (email, otp) => {
  const response = await api.post(
    "/auth/forgot-password/verify-otp",
    {
      email: (email || "").trim(),
      otp: String(otp).trim(),
    }
  );

  return response.data;
};

/**
 * 9. Forgot Password - Reset Password
 *
 * Backend reads the reset token from the HttpOnly cookie.
 * Therefore the frontend does NOT send a resetToken.
 */
export const resetPassword = async (
  newPassword,
  confirmPassword
) => {
  const response = await api.post(
    "/auth/forgot-password/reset",
    {
      newPassword,
      confirmPassword,
    }
  );

  return response.data;
};

/**
 * 10. Change Password
 */
export const changePassword = async (
  currentPassword,
  newPassword,
  confirmPassword
) => {
  const response = await api.patch(
    "/auth/change-password",
    {
      currentPassword,
      newPassword,
      confirmPassword,
    }
  );

  return response.data;
};

/**
 * 11. Update Profile
 */
export const updateProfile = async (profileData) => {
  const response = await api.patch(
    "/auth/profile",
    profileData
  );

  return response.data;
};

/**
 * 12. Get Current Authenticated User
 *
 * Authentication is handled by the HttpOnly cookie.
 */
export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};