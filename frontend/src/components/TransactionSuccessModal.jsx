import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Share2, ShieldCheck, Download } from 'lucide-react';
import { playPaymentSuccessChime } from '../utils/audioUtils';

export const TransactionSuccessModal = ({ isOpen, onClose, transaction }) => {
  const handleDownloadReceipt = () => {
    if (!transaction) return;
    const receiptText = `
BHEESHMA BANKING - TRANSACTION RECEIPT
-----------------------------------
Status: SUCCESS
Amount: ₹${parseFloat(transaction.amount).toFixed(2)}
Paid To: ${transaction.recipient?.name || transaction.title}
UPI ID: ${transaction.recipient?.upiId || transaction.upiId}
Date: ${new Date(transaction.timestamp).toLocaleString()}
Transaction Ref: ${transaction.refId || transaction.id}
-----------------------------------
Thank you for using Bheeshma Bank.
    `.trim();

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${transaction.refId || transaction.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (isOpen && transaction) {
      // Audio chime
      playPaymentSuccessChime();
      
      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00b875', '#8b3ff0', '#00d2ff', '#000000']
      });
    }
  }, [isOpen, transaction]);

  if (!isOpen || !transaction) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(7, 4, 18, 0.88)',
      backdropFilter: 'blur(12px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: 'linear-gradient(180deg, #1d1633 0%, #120d22 100%)',
        borderRadius: '26px',
        border: '1px solid rgba(0, 184, 117, 0.35)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.85), 0 0 40px rgba(0, 184, 117, 0.25)',
        overflow: 'hidden',
        color: '#111827',
        textAlign: 'center',
        padding: '30px 24px 24px'
      }}>
        {/* Animated Checkmark Circle */}
        <div style={{
          width: '74px',
          height: '74px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00b875 0%, #008753 100%)',
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 30px rgba(0, 184, 117, 0.6)',
          animation: 'bounceIn 0.5s ease-out'
        }}>
          <CheckCircle2 size={46} color="#ffffff" strokeWidth={2.5} />
        </div>

        <div style={{ fontSize: '13px', fontWeight: '700', color: '#00b875', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
          Payment Successful
        </div>

        <div style={{ fontSize: '38px', fontWeight: '800', color: '#111827', fontFamily: 'Outfit, sans-serif', marginBottom: '6px' }}>
          ${parseFloat(transaction.amount).toFixed(2)}
        </div>

        <div style={{ fontSize: '14px', color: '#4b5563', marginBottom: '20px' }}>
          Paid to <span style={{ fontWeight: '600', color: '#111827' }}>{transaction.recipient?.name || transaction.title}</span>
        </div>

        {/* Receipt Box */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '16px',
          textAlign: 'left',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: '#6b7280' }}>UPI ID</span>
            <span style={{ color: '#1f2937', fontWeight: '500' }}>{transaction.recipient?.upiId || transaction.upiId}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: '#6b7280' }}>Debited From</span>
            <span style={{ color: '#1f2937', fontWeight: '500' }}>HDFC Bank •••• 4892</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: '#6b7280' }}>Transaction Ref</span>
            <span style={{ color: '#a78bfa', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>
              {transaction.refId || "UPI/74839201/HDFC"}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: '#6b7280' }}>Date & Time</span>
            <span style={{ color: '#4b5563' }}>
              {transaction.timestamp ? new Date(transaction.timestamp).toLocaleString() : "Just now"}
            </span>
          </div>

          <div style={{ borderTop: '1px dashed rgba(0, 0, 0, 0.1)', paddingTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#00b875" />
            <span style={{ fontSize: '11px', color: '#00b875' }}>100% Protected by BheeshmaPay SafeGuard & Banking Shield</span>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={onClose}
            style={{
              flex: 1,
              padding: '13px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #00b875 0%, #00935d 100%)',
              color: '#111827',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0, 184, 117, 0.4)'
            }}
          >
            Done
          </button>
          <button 
            onClick={handleDownloadReceipt}
            style={{
              padding: '13px 18px',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(0, 0, 0, 0.04)',
              color: '#111827',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Download size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
