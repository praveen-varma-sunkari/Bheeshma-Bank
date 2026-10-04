import React from 'react';
import { X, Receipt, CheckCircle, Download, FileText } from 'lucide-react';

export const TransactionReceiptModal = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  const isDebit = transaction.type === 'debit';
  const amountStr = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(transaction.amount);

  const txDate = transaction.timestamp 
    ? new Date(transaction.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : transaction.date || 'N/A';

  const downloadReceipt = () => {
    // Generate simple text receipt to download
    const receiptText = `
=================================
       BHEESHMA BANKING RECEIPT      
=================================
Transaction ID: ${transaction.id}
Reference ID: ${transaction.refId || 'N/A'}
Date & Time: ${txDate}

Amount: ${amountStr}
Type: ${isDebit ? 'DEBIT (Sent)' : 'CREDIT (Received)'}
Status: ${transaction.status || 'Settled'}
Category: ${transaction.category || 'N/A'}

----- SENDER DETAILS -----
Name: ${transaction.senderName || 'Bheeshma User'}
Phone: ${transaction.senderPhone || 'N/A'}

----- RECEIVER DETAILS -----
Name: ${transaction.recipientName || transaction.recipient?.name || 'Bheeshma User'}
Phone: ${transaction.recipientPhone || transaction.recipient?.phone || 'N/A'}
UPI ID: ${transaction.upiId || 'N/A'}

Note: ${transaction.subtitle || 'N/A'}

Thank you for banking with Bheeshma.
=================================
    `;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bheeshma_Receipt_${transaction.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
        <div style={{ padding: '24px', background: '#111827', color: '#fff', position: 'relative' }}>
          <button 
            onClick={onClose}
            style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <CheckCircle size={32} />
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
              Payment {transaction.status || 'Successful'}
            </div>
            <div style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', marginTop: '4px', color: isDebit ? '#fff' : '#10b981' }}>
              {isDebit ? '-' : '+'}{amountStr}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
              {txDate}
            </div>
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: '24px', background: '#f9fafb' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e5e7eb', paddingBottom: '12px' }}>
              <span style={{ color: '#6b7280', fontSize: '13px' }}>From (Sender)</span>
              <span style={{ fontWeight: '600', fontSize: '13px', textAlign: 'right' }}>
                {transaction.senderName || 'Bheeshma User'}
                <br/>
                <span style={{ color: '#6b7280', fontWeight: 'normal', fontSize: '12px' }}>{transaction.senderPhone || 'N/A'}</span>
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e5e7eb', paddingBottom: '12px' }}>
              <span style={{ color: '#6b7280', fontSize: '13px' }}>To (Receiver)</span>
              <span style={{ fontWeight: '600', fontSize: '13px', textAlign: 'right' }}>
                {transaction.recipientName || transaction.recipient?.name || 'Bheeshma User'}
                <br/>
                <span style={{ color: '#6b7280', fontWeight: 'normal', fontSize: '12px' }}>{transaction.recipientPhone || transaction.recipient?.phone || transaction.upiId || 'N/A'}</span>
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280', fontSize: '13px' }}>Transaction ID</span>
              <span style={{ fontWeight: '600', fontSize: '13px', fontFamily: 'monospace' }}>{transaction.id}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280', fontSize: '13px' }}>Reference No.</span>
              <span style={{ fontWeight: '600', fontSize: '13px', fontFamily: 'monospace' }}>{transaction.refId || 'N/A'}</span>
            </div>
            
          </div>

          <button 
            onClick={downloadReceipt}
            style={{ 
              width: '100%', marginTop: '20px', padding: '14px', background: '#ffffff', 
              border: '1px solid #d1d5db', borderRadius: '12px', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', gap: '8px', 
              color: '#111827', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <Download size={18} /> Download e-Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
