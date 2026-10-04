import React from 'react';
import { X, Train, Plane, Zap, Flame, Droplet, CreditCard } from 'lucide-react';

export const CommercialBookingsModal = ({ isOpen, onClose, onSelectBooking }) => {
  if (!isOpen) return null;

  const bookingOptions = [
    { id: 'train', title: 'Train Tickets', icon: <Train size={24} color="#3b82f6" />, bg: '#eff6ff' },
    { id: 'flight', title: 'Flight Tickets', icon: <Plane size={24} color="#8b5cf6" />, bg: '#f5f3ff' },
    { id: 'electricity', title: 'Electricity Bill', icon: <Zap size={24} color="#eab308" />, bg: '#fefce8' },
    { id: 'gas', title: 'Gas Bill', icon: <Flame size={24} color="#ef4444" />, bg: '#fef2f2' },
    { id: 'water', title: 'Water Bill', icon: <Droplet size={24} color="#06b6d4" />, bg: '#ecfeff' },
    { id: 'credit', title: 'Credit Card Bill', icon: <CreditCard size={24} color="#10b981" />, bg: '#ecfdf5' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: '#ffffff', borderRadius: '24px', width: '90%', maxWidth: '420px',
        padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '20px', right: '20px', background: '#f3f4f6', border: 'none',
          borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <X size={16} color="#4b5563" />
        </button>

        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#ffffff' }}>Commercial Bookings</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>Book travel or pay utilities instantly.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {bookingOptions.map(opt => (
            <button key={opt.id} onClick={() => onSelectBooking(opt)} style={{
              background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '16px 8px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px', background: opt.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {opt.icon}
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#4b5563', textAlign: 'center', lineHeight: '1.2' }}>
                {opt.title}
              </span>
            </button>
          ))}
        </div>

        <div style={{ marginTop: '24px', background: '#f9fafb', borderRadius: '16px', padding: '16px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ background: '#dbeafe', borderRadius: '50%', padding: '8px', marginTop: '2px' }}>
             <Zap size={16} color="#3b82f6" />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>AI Voice Enabled</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              You can also book these using the Bheeshma Voice Assistant. Just say "Hey Bheeshma, pay my electricity bill."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
