import React, { useState } from 'react';
import { ShieldCheck, Lock, Delete, X } from 'lucide-react';

export const UpiPinModal = ({ isOpen, onClose, onSuccess, transferData, user }) => {
  const [pin, setPin] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleKeyPress = (num) => {
    if (pin.length < 6) {
      if (error) setError("");
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 6) {
        submitPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    if (error) setError("");
    setPin(prev => prev.slice(0, -1));
  };

  const submitPin = async (_finalPin) => {
    setIsVerifying(true);
    
    if (user?.mpin && _finalPin !== user.mpin) {
      setTimeout(() => {
        setIsVerifying(false);
        setError("Incorrect MPIN. Authorization failed.");
        setPin("");
      }, 900);
      return;
    }

    setError("");
    try {
      await onSuccess(transferData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsVerifying(false);
      setPin("");
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 3, 15, 0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        maxWidth: '380px',
        width: '100%',
        background: '#19122c',
        borderRadius: '24px',
        border: '1px solid rgba(139, 63, 240, 0.4)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(103, 57, 182, 0.3)',
        overflow: 'hidden',
        color: '#111827',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #441477 0%, #2a0b4d 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: '#00b875',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px' }}>NPCI / UPI 2.0</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>256-Bit SSL Encrypted</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Amount & Recipient Details */}
        <div style={{ padding: '20px 24px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
            Paying to <span style={{ color: '#111827', fontWeight: '600' }}>{transferData?.recipient?.name || "Recipient"}</span>
          </div>
          <div style={{ fontSize: '11px', color: '#7b32c9', marginBottom: '12px' }}>
            UPI ID: {transferData?.recipient?.upiId || "upi@bank"}
          </div>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#111827', fontFamily: 'Outfit, sans-serif' }}>
            ${parseFloat(transferData?.amount || 0).toFixed(2)}
          </div>
          {transferData?.note && (
            <div style={{ fontSize: '12px', color: '#a78bfa', marginTop: '6px' }}>
              "{transferData.note}"
            </div>
          )}
        </div>

        {/* PIN Dots */}
        <div style={{ padding: '24px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Lock size={15} color="#8b3ff0" /> Enter 6-Digit UPI PIN
          </div>
          {error && <div style={{ textAlign: 'center', fontSize: '13px', color: '#ef4444', fontWeight: '600', marginBottom: '8px', marginTop: '-8px' }}>{error}</div>}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const isFilled = pin.length > idx;
              return (
                <div 
                  key={idx}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: '2px solid #8b3ff0',
                    background: isFilled ? '#8b3ff0' : 'transparent',
                    boxShadow: isFilled ? '0 0 10px #8b3ff0' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                />
              );
            })}
          </div>

          {isVerifying ? (
            <div style={{ fontSize: '12px', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', border: '2px solid #a855f7', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Verifying with Bank Switch...
            </div>
          ) : (
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              Enter any 6 numbers to simulate UPI authorization
            </div>
          )}
        </div>

        {/* Numeric Keypad */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          padding: '16px 24px 24px',
          background: 'rgba(15, 10, 26, 0.7)'
        }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              disabled={isVerifying}
              style={{
                height: '52px',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: '#f9fafb',
                color: '#111827',
                fontSize: '20px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.1s'
              }}
              onMouseDown={(e) => e.currentTarget.style.background = 'rgba(139, 63, 240, 0.3)'}
              onMouseUp={(e) => e.currentTarget.style.background = '#f9fafb'}
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleKeyPress("0")}
            disabled={isVerifying}
            style={{
              height: '52px',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: '#f9fafb',
              color: '#111827',
              fontSize: '20px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            0
          </button>
          <button
            onClick={handleDelete}
            disabled={isVerifying}
            style={{
              height: '52px',
              borderRadius: '14px',
              border: 'none',
              background: 'transparent',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Delete size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};
