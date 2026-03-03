import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    nationality: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getProfile(user.id);
      
      const userData = response.data.user || user;
      const profileData = response.data.profile || {};
      
      setProfile(profileData);
      setFormData({
        firstName: userData.firstName || user.firstName || '',
        lastName: userData.lastName || user.lastName || '',
        email: userData.email || user.email || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
        dateOfBirth: profileData.date_of_birth || '',
        gender: profileData.gender || '',
        nationality: profileData.nationality || ''
      });
      setLoading(false);
      setMessage({ type: '', text: '' });
    } catch (error) {
      console.error('Profile fetch error:', error);
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: '',
        address: '',
        dateOfBirth: '',
        gender: '',
        nationality: ''
      });
      setLoading(false);
      setMessage({ type: 'info', text: 'Complete your profile information below' });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('Updating profile with:', formData);
      const response = await profileService.updateProfile(user.id, formData);
      console.log('Update response:', response);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      
      // Don't refetch - just update state with saved data
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
      
    } catch (error) {
      console.error('Profile update error:', error);
      console.error('Error details:', error.response?.data);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || error.response?.data?.message || 'Failed to update profile. Please try again.' 
      });
    }
    setSaving(false);
  };

  if (loading) return <div style={{padding: '2rem'}}>Loading profile...</div>;

  return (
    <div style={{padding: '2rem', maxWidth: '800px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem'}}>
        <h2>My Profile</h2>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} style={{padding: '0.5rem 1rem', cursor: 'pointer'}}>
            Edit Profile
          </button>
        )}
      </div>

      {message.text && (
        <div style={{
          padding: '1rem', 
          marginBottom: '1rem', 
          background: message.type === 'success' ? '#d1fae5' : message.type === 'error' ? '#fee2e2' : '#e0f2fe', 
          borderRadius: '8px',
          borderLeft: `4px solid ${message.type === 'success' ? '#10b981' : message.type === 'error' ? '#ef4444' : '#3b82f6'}`
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{display: 'grid', gap: '1rem'}}>
          <div>
            <label>First Name</label>
            <input 
              type="text" 
              name="firstName" 
              value={formData.firstName} 
              onChange={handleChange} 
              disabled={!isEditing} 
              required 
              style={{width: '100%', padding: '0.5rem'}} 
            />
          </div>

          <div>
            <label>Last Name</label>
            <input 
              type="text" 
              name="lastName" 
              value={formData.lastName} 
              onChange={handleChange} 
              disabled={!isEditing} 
              required 
              style={{width: '100%', padding: '0.5rem'}} 
            />
          </div>

          <div>
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              disabled={!isEditing} 
              required 
              style={{width: '100%', padding: '0.5rem'}} 
            />
          </div>

          <div>
            <label>Phone</label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              disabled={!isEditing} 
              placeholder="+63 912 345 6789"
              style={{width: '100%', padding: '0.5rem'}} 
            />
          </div>

          <div>
            <label>Date of Birth</label>
            <input 
              type="date" 
              name="dateOfBirth" 
              value={formData.dateOfBirth} 
              onChange={handleChange} 
              disabled={!isEditing} 
              style={{width: '100%', padding: '0.5rem'}} 
            />
          </div>

          <div>
            <label>Gender</label>
            <select 
              name="gender" 
              value={formData.gender} 
              onChange={handleChange} 
              disabled={!isEditing} 
              style={{width: '100%', padding: '0.5rem'}}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label>Nationality</label>
            <input 
              type="text" 
              name="nationality" 
              value={formData.nationality} 
              onChange={handleChange} 
              disabled={!isEditing} 
              placeholder="Filipino"
              style={{width: '100%', padding: '0.5rem'}} 
            />
          </div>

          <div>
            <label>Address</label>
            <textarea 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              disabled={!isEditing} 
              rows="3"
              placeholder="123 Main St, City, Philippines"
              style={{width: '100%', padding: '0.5rem'}} 
            />
          </div>
        </div>

        {isEditing && (
          <div style={{marginTop: '1rem', display: 'flex', gap: '1rem'}}>
            <button type="submit" disabled={saving} style={{padding: '0.5rem 1rem', cursor: 'pointer'}}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              onClick={() => { 
                setIsEditing(false); 
                setMessage({ type: '', text: '' });
              }} 
              style={{padding: '0.5rem 1rem', cursor: 'pointer', background: '#6b7280', color: 'white'}}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
