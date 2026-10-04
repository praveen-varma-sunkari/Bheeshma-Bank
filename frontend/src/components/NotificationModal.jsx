import React from 'react';
import { Bell, CheckCircle, X } from 'lucide-react';
import { updateUserInStore } from '../data/mockData';

export const NotificationModal = ({ user, onUserUpdated }) => {
  if (!user || !user.notifications) return null;

  const unreadNotifs = user.notifications.filter(n => !n.read);

  if (unreadNotifs.length === 0) return null;

  const handleMarkAsRead = (notifId) => {
    const updatedUser = { ...user };
    const notif = updatedUser.notifications.find(n => n.id === notifId);
    if (notif) notif.read = true;
    updateUserInStore(updatedUser);
    if (onUserUpdated) onUserUpdated(updatedUser);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000,
      backgroundColor: 'rgba(5, 7, 12, 0.7)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        padding: '24px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {unreadNotifs.map(notif => (
          <div key={notif.id} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {notif.type === 'SUCCESS' ? <CheckCircle size={24} color="#10b981" /> : <Bell size={24} color="#3b82f6" />}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#111827', fontFamily: 'Outfit, sans-serif' }}>
                {notif.title}
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#4b5563', lineHeight: '1.5' }}>
                {notif.message}
              </p>
              <button
                onClick={() => handleMarkAsRead(notif.id)}
                style={{
                  marginTop: '16px',
                  padding: '8px 16px',
                  background: '#111827',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Got it
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
