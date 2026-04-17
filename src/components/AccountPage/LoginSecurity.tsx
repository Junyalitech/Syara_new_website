import { useEffect, useState } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';
import './LoginSecurity.css';
import './shared.css';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, fetchProfile, updateProfile } from '../../features/auth/profileSlice';

const LoginSecurity = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState("");
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
  });

  const isValidIndianPhone = (phone) => {
    return /^[6-9]\d{9}$/.test(phone);
  };

  const { profile, loading, success, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        oldPassword: "",
        newPassword: "",
      });
    }
  }, [profile]);

  const handleSaveProfile = () => {

    if (!isValidIndianPhone(formData.phone)) {
      setPhoneError("Invalid mobile number");
      return;
    } else {
      setPhoneError("");
    }

    dispatch(
      updateProfile({
        id: profile.id,
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
      })
    )

    setEditingField(null);
  };

  const handleChangePassword = () => {
    dispatch(
      changePassword({
        id: profile.id,
        data: {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        },
      })
    );

    setEditingField(null);
  };

  if (loading) {
    return (
      <div className="security-list">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="security-row section-card skeleton-row">
            <div className="skeleton-label"></div>
            <div className="skeleton-value"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h2>Profile</h2>
      </div>

      <div className="security-list">
        {/* Name */}
        <div className="security-row section-card">
          <div className="security-row-info">
            <label className="security-label">Full Name</label>
            {editingField === 'name' ? (
              <input
                className="security-input"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            ) : (
              <p className="security-value">{profile?.name || "Loading..."}</p>
            )}
          </div>
          {/* <div className="security-row-actions">
            {saved === 'name' && <span className="saved-badge"><Check size={13} /> Saved</span>}
            {editingField === 'name' ? (
              <>
                <button className="btn-primary" onClick={() => handleSaveProfile()}>Save</button>
                <button className="btn-outline" onClick={() => setEditingField(null)}>Cancel</button>
              </>
            ) : (
              <button className="btn-outline" onClick={() => setEditingField('name')}>Edit</button>
            )}
          </div> */}
        </div>

        {/* Email */}
        <div className="security-row section-card">
          <div className="security-row-info">
            <label className="security-label">Email Address</label>
            {editingField === 'email' ? (

              <input
                className="security-input"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

            ) : (
              <p className="security-value">{profile?.email || "Loading..."}</p>
            )}
          </div>
          {/* <div className="security-row-actions">
            {saved === 'email' && <span className="saved-badge"><Check size={13} /> Saved</span>}
            {editingField === 'email' ? (
              <>
                <button className="btn-primary" onClick={() => handleSaveProfile()}>Save</button>
                <button className="btn-outline" onClick={() => setEditingField(null)}>Cancel</button>
              </>
            ) : (
              <button className="btn-outline" onClick={() => setEditingField('email')}>Edit</button>
            )}
          </div> */}
        </div>

        {/* Phone */}
        <div className="security-row section-card">
          <div className="security-row-info">
            <label className="security-label">Phone Number</label>
            {editingField === 'phone' ? (
              <input
                className="security-input"
                value={formData.phone}
                maxLength={10}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setFormData({ ...formData, phone: e.target.value })
                  }

                }
                }
              />
            ) : (
              <p className="security-value">{profile?.phone || "Loading..."}</p>
            )}

            {editingField === 'phone' && phoneError && (
              <p className="error-text">{phoneError}</p>
            )}
          </div>
          {/* <div className="security-row-actions">
            {saved === 'phone' && <span className="saved-badge"><Check size={13} /> Saved</span>}
            {editingField === 'phone' ? (
              <>
                <button className="btn-primary" onClick={() => handleSaveProfile()}>Save</button>
                <button className="btn-outline" onClick={() => setEditingField(null)}>Cancel</button>
              </>
            ) : (
              <button className="btn-outline" onClick={() => setEditingField('phone')}>Edit</button>
            )}
          </div> */}
        </div>

        {/* Password */}
        <div className="security-row section-card">
          <div className="security-row-info">
            <label className="security-label">Password</label>
            {editingField === 'password' ? (
              <div className="password-fields">
                <input
                  type="password"
                  className="security-input"
                  placeholder="Current password"
                  value={formData.oldPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, oldPassword: e.target.value })
                  }
                />
                <div className="password-input-wrap">
                  <input className="security-input" type={showPassword ? 'text' : 'password'} placeholder="New password" value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    } />
                  <button className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            ) : (
              <p className="security-value">••••••••••</p>
            )}
          </div>
          <div className="security-row-actions">
            {saved === 'password' && <span className="saved-badge"><Check size={13} /> Saved</span>}
            {editingField === 'password' ? (
              <>
                <button className="btn-primary" onClick={handleChangePassword}>Update</button>
                <button className="btn-outline" onClick={() => setEditingField(null)}>Cancel</button>
              </>
            ) : (
              <button className="btn-outline" onClick={() => setEditingField('password')}>Change</button>
            )}
          </div>
        </div>

        {/* Two-factor */}
        {/* <div className="security-row section-card">
          <div className="security-row-info">
            <label className="security-label">Two-Factor Authentication</label>
            <p className="security-value security-status-off">Not enabled</p>
          </div>
          <div className="security-row-actions">
            <button className="btn-primary">Enable</button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default LoginSecurity;
