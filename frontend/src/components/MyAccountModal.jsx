import React, { useState } from 'react';
import { X, User, Image as ImageIcon, Key, Lock, CheckCircle2 } from 'lucide-react';
import { addAdminRequest, getAdminRequests, updateUserInStore } from '../data/mockData';

export const MyAccountModal = ({ isOpen, onClose, user, onUserUpdated }) => {
  if (!isOpen || !user) return null;

  const [name, setName] = useState(user.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [resetType, setResetType] = useState(null);
  const [resetPin, setResetPin] = useState('');
  const [newValue, setNewValue] = useState('');
  const [resetError, setResetError] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onUserUpdated({ ...user, name, avatarUrl });
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const handleRequestChange = async (type) => {
    const reqs = await getAdminRequests();
    const existingReq = reqs.find(r => r.type === 'FORGOT_CREDENTIALS' && r.data.type === type && r.userPhone === user.phone && (r.status === 'PENDING' || (r.status === 'PIN_GENERATED' && r.expiresAt > Date.now())));
    
    if (existingReq) {
      setResetType(type);
      setSuccessMsg(`Found active ${type} reset request! Enter the PIN from Admin.`);
      setTimeout(() => setSuccessMsg(""), 3000);
      return;
    }

    await addAdminRequest({
      type: 'FORGOT_CREDENTIALS',
      userPhone: user.phone,
      userName: user.name,
      data: { type },
      status: 'PENDING'
    });
    setSuccessMsg(`${type} change request sent to Admin.`);
    setTimeout(() => setSuccessMsg(""), 4000);
    setResetType(type);
  };

  const handleSubmitReset = async (e) => {
    e.preventDefault();
    setResetError('');
    const reqs = await getAdminRequests();
    const req = reqs.find(r => r.type === 'FORGOT_CREDENTIALS' && r.data.type === resetType && r.userPhone === user.phone && r.status === 'PIN_GENERATED');
    
    if (!req) return setResetError("Admin has not generated the PIN yet. Please wait.");
    if (Date.now() > req.expiresAt) return setResetError("PIN has expired (10 minutes limit).");
    if (req.generatedPin !== resetPin) return setResetError("Invalid PIN.");
    if (newValue.length < 6) return setResetError(`New ${resetType} must be at least 6 characters.`);

    if (resetType === 'MPIN') {
        await updateUserInStore({ ...user, mpin: newValue });
    } else {
        await updateUserInStore({ ...user, password: newValue });
    }
    
    setSuccessMsg(`${resetType} reset successfully!`);
    setResetType(null);
    setResetPin('');
    setNewValue('');
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        maxHeight: '90vh',
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
        overflowY: 'auto',
        color: '#111827',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          background: '#f9fafb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#111827' }}>
            <User size={24} color="#8b3ff0" /> My Account
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {successMsg && (
            <div style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#047857', padding: '12px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
              <CheckCircle2 size={18} />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4b5563', marginBottom: '6px' }}>Profile Name</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '12px', padding: '0 12px' }}>
                <User size={18} color="#9ca3af" />
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#111827', padding: '12px', fontSize: '15px' }}
                  required
                />
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4b5563', marginBottom: '6px' }}>Profile Picture</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '12px', padding: '0 12px', position: 'relative', overflow: 'hidden' }}>
                <ImageIcon size={18} color="#9ca3af" />
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setAvatarUrl(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }} 
                  style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#4b5563', padding: '10px 12px', fontSize: '13px', cursor: 'pointer' }}
                />
              </div>
              {avatarUrl && avatarUrl.startsWith('data:image') && <div style={{marginTop: '8px', fontSize: '12px', color: '#10b981', fontWeight: '600'}}>Image selected and ready to save.</div>}
            </div>

            <button type="submit" style={{ background: '#8b3ff0', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', marginTop: '8px', boxShadow: '0 4px 12px rgba(139, 63, 240, 0.3)' }}>
              Save Profile Changes
            </button>
          </form>

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#111827', marginBottom: '16px' }}>Security Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => handleRequestChange('MPIN')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', border: '1px solid #d1d5db', padding: '16px', borderRadius: '12px', color: '#111827', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(139, 63, 240, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Key size={16} color="#8b3ff0" />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '700' }}>Request MPIN Reset</span>
                </div>
              </button>
              <button onClick={() => handleRequestChange('PASSWORD')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', border: '1px solid #d1d5db', padding: '16px', borderRadius: '12px', color: '#111827', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(139, 63, 240, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lock size={16} color="#8b3ff0" />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '700' }}>Request Password Reset</span>
                </div>
              </button>

              {resetType && (
                <div style={{ marginTop: '16px', background: '#f9fafb', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#111827' }}>Complete {resetType} Reset</h4>
                  {resetError && <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '8px' }}>{resetError}</div>}
                  <form onSubmit={handleSubmitReset} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input 
                      type="text" 
                      placeholder="6-Digit Admin PIN" 
                      value={resetPin} 
                      onChange={e => setResetPin(e.target.value)} 
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                      required
                    />
                    <input 
                      type="password" 
                      placeholder={`New ${resetType}`} 
                      value={newValue} 
                      onChange={e => setNewValue(e.target.value)} 
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                      required
                    />
                    <button type="submit" style={{ background: '#111827', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                      Verify & Reset
                    </button>
                    <button type="button" onClick={() => setResetType(null)} style={{ background: 'transparent', color: '#6b7280', border: 'none', padding: '8px', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' }}>
                      Cancel
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
