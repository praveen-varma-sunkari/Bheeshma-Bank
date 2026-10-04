import React from 'react';
import { X, CheckCircle, IndianRupee } from 'lucide-react';

export const DepositApprovedModal = ({ isOpen, amount, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        color: '#111827',
        animation: 'slideUp 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{ padding: '24px', background: '#111827', color: '#fff', position: 'relative', textAlign: 'center' }}>
          <button 
            onClick={onClose}
            style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <CheckCircle size={36} />
            </div>
          </div>
          
          <div style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>
            Deposit Approved!
          </div>
          <div style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>
            Your request was processed successfully.
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '15px', color: '#4b5563', marginBottom: '16px' }}>
            Money got added to your account:
          </div>
          <div style={{ 
            fontSize: '40px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', color: '#10b981',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
          }}>
            <IndianRupee size={32} strokeWidth={3} />
            {new Intl.NumberFormat('en-IN').format(amount)}
          </div>
          
          <button 
            onClick={onClose}
            style={{ 
              width: '100%', marginTop: '32px', padding: '16px', background: '#111827', 
              border: 'none', borderRadius: '12px', color: '#ffffff', 
              fontSize: '16px', fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            Awesome, Thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
