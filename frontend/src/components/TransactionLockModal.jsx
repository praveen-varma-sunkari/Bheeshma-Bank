import React, { useState } from 'react';
import { X, ShieldAlert, ShieldCheck, Lock, Unlock } from 'lucide-react';
import { toggleTransactionLock } from '../data/mockData';

export const TransactionLockModal = ({ isOpen, onClose, user, onStatusChanged }) => {
  const [step, setStep] = useState(1); // 1: Warning, 2: MPIN Input
  const [mpin, setMpin] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !user) return null;

  const isCurrentlyLocked = user.isTransactionLocked;
  const targetState = !isCurrentlyLocked;

  const handleConfirmWarning = () => {
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mpin.length < 4) {
      setError("Enter valid MPIN.");
      return;
    }

    const result = toggleTransactionLock(user.phone, mpin, targetState);
    if (result.error) {
      setError(result.error);
    } else {
      onStatusChanged(result.user);
      onClose();
      // Reset state for next open
      setTimeout(() => { setStep(1); setMpin(""); setError(""); }, 500);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: '#ffffff', borderRadius: '24px', width: '90%', maxWidth: '380px',
        padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '20px', right: '20px', background: '#f3f4f6', border: 'none',
          borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <X size={16} color="#4b5563" />
        </button>

        {step === 1 ? (
          <div style={{ textAlign: 'center', padding: '20px 0 10px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 16px',
              background: targetState ? '#fef2f2' : '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {targetState ? <ShieldAlert size={32} color="#ef4444" /> : <ShieldCheck size={32} color="#10b981" />}
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#ffffff' }}>
              {targetState ? 'Lock Transactions?' : 'Unlock Transactions?'}
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.5' }}>
              {targetState 
                ? "Are you sure about this? Locking transactions will block all outgoing transfers from your account. You will need your MPIN to unlock it later."
                : "You are about to unlock transactions. Your account will be able to send money again. Please confirm to proceed."}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button onClick={onClose} style={{
                background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px',
                color: '#4b5563', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
              }}>
                Cancel
              </button>
              <button onClick={handleConfirmWarning} style={{
                background: targetState ? '#ef4444' : '#10b981', border: 'none', borderRadius: '12px', padding: '12px',
                color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
              }}>
                Yes, I'm sure
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto 16px',
                background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {targetState ? <Lock size={24} color="#111827" /> : <Unlock size={24} color="#111827" />}
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px', color: '#ffffff' }}>
                Enter MPIN
              </h2>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>
                Authenticate to {targetState ? 'lock' : 'unlock'} your account.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="••••••"
                  value={mpin}
                  onChange={(e) => { setMpin(e.target.value); setError(""); }}
                  style={{
                    width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e5e7eb',
                    background: '#f9fafb', fontSize: '24px', letterSpacing: '8px', textAlign: 'center',
                    outline: 'none', color: '#ffffff', boxSizing: 'border-box'
                  }}
                  autoFocus
                />
                {error && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px', textAlign: 'center' }}>{error}</div>}
              </div>

              <button type="submit" style={{
                width: '100%', background: '#ffffff', color: '#fff', border: 'none', borderRadius: '12px',
                padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer'
              }}>
                Confirm
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
