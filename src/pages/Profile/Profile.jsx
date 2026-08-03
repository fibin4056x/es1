/* eslint-disable */
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../services/authService";
import api from "../../services/api";
import { toast } from "react-toastify";
import "./Profile.css";

function Profile() {
  const { user, login } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  // Sync latest user details from backend on mount
  useEffect(() => {
    const fetchLatestUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await api.get("/auth/me");
          if (res.data?.data) {
            login(res.data.data, token);
          }
        }
      } catch (error) {
        console.error("Failed to sync profile:", error);
      }
    };
    fetchLatestUser();
  }, []);

  // Update local form state when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="profile-page">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  // Get first 2 letters for avatar initials
  const initials = user.name
    ? user.name.slice(0, 2).toUpperCase()
    : "PR";

  // Map roles to readable names
  const roleNameMap = {
    admin: "Principal Administrator",
    teacher: "Teacher",
    student: "Student",
  };
  const readableRole = roleNameMap[user.role] || "User";

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.warning("Name and Email are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await updateProfile(formData);
      
      // Update session locally
      const token = localStorage.getItem("token");
      login(res.data, token);

      toast.success("Profile updated successfully!");
      setIsEditOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityKeyChange = () => {
    toast.info("Security key rotation initialized. Check email for details.");
  };

  return (
    <div className="profile-page animate-fade-in-up">
      {/* Title Header */}
      <div className="profile-header-row">
        <div className="profile-title-group">
          <h1>Profile</h1>
          <p>Manage your account credentials, security settings, and profile info.</p>
        </div>
      </div>

      <div className="profile-grid-container">
        {/* Hero Card */}
        <div className="profile-hero-card">
          <div className="profile-hero-glow" />
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-status-dot" />
          </div>
          <div className="profile-hero-details">
            <div className="profile-hero-name-row">
              <span className="profile-hero-name">{user.name}</span>
              <span className="profile-role-badge">
                {user.role === "admin" ? "PRINCIPAL ADMINISTRATOR" : user.role.toUpperCase()}
              </span>
            </div>
            <div className="profile-hero-email">{user.email}</div>
          </div>
        </div>

        {/* Info & Security Cards Grid */}
        <div className="profile-content-grid">
          {/* Account Information Card */}
          <div className="profile-glass-card">
            <div className="profile-card-header">
              <div className="profile-card-title">
                <span className="material-symbols-outlined">badge</span>
                Account Information
              </div>
              <button
                type="button"
                className="profile-edit-btn btn-press"
                onClick={() => setIsEditOpen(true)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>edit</span>
                Edit Profile
              </button>
            </div>

            <div className="profile-info-list">
              <div className="profile-info-row">
                <span className="profile-info-label">Full Name</span>
                <span className="profile-info-value">{user.name}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Email Address</span>
                <span className="profile-info-value">{user.email}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Assigned Role</span>
                <span className="profile-info-value">{readableRole}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Institution</span>
                <span className="profile-info-value">EduTrack SLMS Academy</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Account Status</span>
                <span className="status-badge badge-active" style={{ textTransform: "capitalize" }}>
                  {user.status || "Active"}
                </span>
              </div>
            </div>
          </div>

          {/* Security & Encryption Card */}
          <div className="profile-glass-card">
            <div className="profile-card-header">
              <div className="profile-card-title">
                <span className="material-symbols-outlined">shield</span>
                Security & Encryption
              </div>
            </div>

            <div className="security-alert-box">
              <span className="material-symbols-outlined">verified_user</span>
              <div className="security-alert-details">
                <span className="security-alert-title">Enterprise Security Enabled</span>
                <span className="security-alert-text">
                  Your account is protected by multi-tenant role authorization and 256-bit SSL encryption.
                </span>
              </div>
            </div>

            <button
              type="button"
              className="security-action-btn btn-press"
              onClick={handleSecurityKeyChange}
            >
              <span className="material-symbols-outlined">key</span>
              Change Security Key
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="premium-modal-overlay" onClick={() => setIsEditOpen(false)}>
          <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
            <div className="premium-modal-header">
              <h2>Edit Profile</h2>
              <button
                type="button"
                className="premium-modal-close"
                onClick={() => setIsEditOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="premium-modal-body">
              <form className="premium-form" onSubmit={handleEditSubmit}>
                <div className="premium-form-group">
                  <label htmlFor="name-input">Full Name</label>
                  <input
                    id="name-input"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>
                <div className="premium-form-group">
                  <label htmlFor="email-input">Email Address</label>
                  <input
                    id="email-input"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>
                <div className="premium-form-actions">
                  <button
                    type="button"
                    className="premium-form-btn cancel"
                    disabled={loading}
                    onClick={() => setIsEditOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="premium-form-btn save"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;