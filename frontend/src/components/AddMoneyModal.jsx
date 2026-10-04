import React, { useState } from 'react';
import { PlusCircle, Send, CheckCircle2, AlertCircle, X, PiggyBank } from 'lucide-react';
import { addAdminRequest } from '../data/mockData';

export const AddMoneyModal = ({ isOpen, onClose, user }) => {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('External Bank Transfer');
  const [status, setStatus] = useState('IDLE'); // IDLE, SUBMITTING, SUCCESS, ERROR
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg('Please enter a valid amount greater than 0.');
      setStatus('ERROR');
      return;
    }

    if (!user || !user.phone) {
      setErrorMsg('User verification failed.');
      setStatus('ERROR');
      return;
    }

    setStatus('SUBMITTING');

    // Simulate network delay
    setTimeout(() => {
      try {
        // Send request to Admin
        addAdminRequest({
          id: `req_add_${Date.now()}`,
          type: 'ADD_MONEY_DEPOSIT',
          userPhone: user.phone || user.normalizedPhone,
          userName: user.name,
          data: {
            amount: amt,
            source: source,
            currency: user.currency || 'INR',
            requestDate: new Date().toISOString()
          },
          timestamp: new Date().toISOString(),
          status: 'PENDING'
        });
        
        setStatus('SUCCESS');
      } catch (err) {
        setErrorMsg('Failed to submit request.');
        setStatus('ERROR');
      }
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 7, 12, 0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        background: '#0d131f',
        borderRadius: '24px',
        border: '1px solid rgba(0, 240, 255, 0.2)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        color: '#111827',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1) 0%, rgba(2, 132, 199, 0.2) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#00f0ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000'
            }}>
              <PiggyBank size={20} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>
              Add Funds to Bheeshma
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {status === 'SUCCESS' ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>Request Submitted!</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.5' }}>
                Your request to deposit {user?.currencySymbol || '₹'}{amount} has been securely routed to the Treasury Admin. 
                The funds will be credited to your Sovereign account as soon as the admin verifies and approves the inbound transfer.
              </p>
              <button
                onClick={onClose}
                style={{
                  marginTop: '24px',
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', marginBottom: '16px' }}>
                  To comply with anti-money laundering (AML) protocols, all inbound funding requests must be cleared by a Treasury Administrator before liquidity is made available in your account.
                </p>

                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px' }}>
                  Deposit Amount
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '4px 16px'
                }}>
                  <span style={{ fontSize: '20px', color: '#94a3b8', fontWeight: '800', marginRight: '8px' }}>{user?.currencySymbol || '₹'}</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setStatus('IDLE');
                    }}
                    placeholder="0.00"
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      padding: '12px 0',
                      color: '#fff',
                      fontSize: '24px',
                      fontWeight: '800',
                      fontFamily: 'Outfit, sans-serif'
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '700', marginBottom: '8px' }}>
                  Funding Source
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    outline: 'none',
                    appearance: 'none'
                  }}
                >
                  <option value="External Bank Transfer">External Bank Wire Transfer</option>
                  <option value="Debit/Credit Card">Debit/Credit Card</option>
                  <option value="Crypto Wallet (USDC)">Crypto Wallet (USDC/USDT)</option>
                  <option value="Employer Direct Deposit">Employer Direct Deposit</option>
                </select>
              </div>

              {status === 'ERROR' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '20px'
                }}>
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'SUBMITTING'}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)',
                  color: '#000',
                  fontSize: '15px',
                  fontWeight: '800',
                  fontFamily: 'Outfit, sans-serif',
                  cursor: status === 'SUBMITTING' ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 25px rgba(0, 240, 255, 0.25)',
                  opacity: status === 'SUBMITTING' ? 0.7 : 1
                }}
              >
                {status === 'SUBMITTING' ? (
                  <span>Submitting to Admin...</span>
                ) : (
                  <>
                    <span>Request Deposit Clearance</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
