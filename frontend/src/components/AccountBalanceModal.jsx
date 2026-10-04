import React from 'react';
import { X, Landmark } from 'lucide-react';

export const AccountBalanceModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  const totalBankBalance = user.accounts.reduce((acc, a) => acc + a.balance, 0);
  const totalInvestments = user.investments.fixedDeposits + user.investments.mutualFunds + user.investments.digitalGold;
  const netWorth = totalBankBalance + totalInvestments;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(6, 4, 16, 0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 9998,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        background: '#19132c',
        borderRadius: '24px',
        border: '1px solid rgba(139, 63, 240, 0.3)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
        overflow: 'hidden',
        color: '#111827',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 20px',
          background: 'linear-gradient(135deg, #5f259f 0%, #3b1464 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Landmark size={20} color="#00d2ff" />
            <div>
              <div style={{ fontSize: '15px', fontWeight: '700' }}>Bank Accounts & Balances</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>Live NPCI Open Banking Sync</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          {/* Net Worth Summary */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '18px'
          }}>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Estimated Net Worth</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#00d2ff', fontFamily: 'Outfit, sans-serif', marginTop: '2px' }}>
              ${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '11px', color: '#00b875', marginTop: '4px' }}>
              • Liquid Accounts: ${totalBankBalance.toFixed(2)} | Fixed/Wealth: ${totalInvestments.toFixed(2)}
            </div>
          </div>

          {/* Accounts List */}
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '10px' }}>
            Linked Bank Accounts
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
            {user.accounts.map((acc) => (
              <div 
                key={acc.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${acc.isPrimary ? 'rgba(139, 63, 240, 0.5)' : '#f9fafb'}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: acc.logoColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '12px'
                  }}>
                    {acc.bankName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{acc.bankName}</span>
                      {acc.isPrimary && (
                        <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px', background: '#00b875', color: '#111827', fontWeight: '800' }}>
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>{acc.accountNumber} • {acc.type}</div>
                  </div>
                </div>

                <div style={{ fontSize: '16px', fontWeight: '800', color: '#111827', fontFamily: 'Outfit, sans-serif' }}>
                  ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>

          {/* Investments / Wealth Section */}
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#4b5563', marginBottom: '10px' }}>
            Wealth & Term Deposits
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#6b7280' }}>Fixed Deposit</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827', marginTop: '2px' }}>
                ${user.investments.fixedDeposits.toLocaleString()}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#6b7280' }}>Mutual Funds</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827', marginTop: '2px' }}>
                ${user.investments.mutualFunds.toLocaleString()}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#6b7280' }}>24K Digital Gold</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827', marginTop: '2px' }}>
                ${user.investments.digitalGold.toLocaleString()}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #6739b6 0%, #8b3ff0 100%)',
              color: '#111827',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
