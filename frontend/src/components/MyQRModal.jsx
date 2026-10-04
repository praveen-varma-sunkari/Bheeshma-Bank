import React, { useState } from 'react';
import { X, QrCode, Download, Share2 } from 'lucide-react';

export const MyQRModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: '#ffffff', borderRadius: '24px', width: '90%', maxWidth: '360px',
        padding: '30px 24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', position: 'relative',
        textAlign: 'center'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '20px', right: '20px', background: '#f3f4f6', border: 'none',
          borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <X size={16} color="#4b5563" />
        </button>

        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#ffffff' }}>My QR Code</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>Scan to pay {user.name.split(' ')[0]}</p>

        <div style={{
          background: '#f9fafb', padding: '30px', borderRadius: '24px', display: 'inline-block',
          border: '1px solid #e5e7eb', marginBottom: '24px', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)'
        }}>
          {/* Simulated QR Code using a generic placeholder or icon */}
          <div style={{ width: '200px', height: '200px', background: '#fff', padding: '10px', borderRadius: '16px', border: '2px solid #111827', position: 'relative' }}>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(user.phone)}`} alt="QR Code" style={{ width: '100%', height: '100%' }} />
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              background: '#fff', padding: '4px', borderRadius: '8px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #00f0ff, #3b82f6)', width: '32px', height: '32px',
                borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111827', fontWeight: '900'
              }}>A</div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>{user.name}</div>
        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>{user.phone}</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button style={{
            background: '#f3f4f6', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '12px',
            fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
            <Download size={16} /> Save
          </button>
          <button style={{
            background: '#ffffff', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px',
            fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>
    </div>
  );
};
