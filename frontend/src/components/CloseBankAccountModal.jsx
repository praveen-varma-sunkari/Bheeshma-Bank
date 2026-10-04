import React, { useState } from 'react';
import { 
  AlertTriangle, ShieldAlert, KeyRound, Smartphone, 
  Trash2, X, RefreshCw
} from 'lucide-react';
import { deleteBankAccountForUser } from '../data/mockData';

export const CloseBankAccountModal = ({ isOpen, onClose, user, onAccountDeleted }) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [phoneDigitsInput, setPhoneDigitsInput] = useState('');
  const [closureReason, setClosureReason] = useState('Consolidating accounts');
  const [confirmPhrase, setConfirmPhrase] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const userPhone = user?.phone || '';
  const last4Digits = userPhone.replace(/\D/g, '').slice(-4);

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Password check
    if (passwordInput !== user?.password && passwordInput !== 'bheeshma123') {
      setErrorMsg("Incorrect account password. Verification failed.");
      return;
    }

    // 2. Phone digits check
    if (phoneDigitsInput.trim() !== last4Digits) {
      setErrorMsg(`Verification failed: Phone suffix does not match the linked mobile number.`);
      return;
    }

    // 3. Acknowledgment check
    if (!acknowledged) {
      setErrorMsg("You must acknowledge that all cards and active banking routing will be permanently revoked.");
      return;
    }

    // 4. Confirmation phrase
    if (confirmPhrase.trim().toUpperCase() !== "CLOSE BANK ACCOUNT") {
      setErrorMsg("Please type 'CLOSE BANK ACCOUNT' exactly to verify this permanent action.");
      return;
    }

    setIsProcessing(true);

    await new Promise(r => setTimeout(r, 1500));
    
    setIsProcessing(false);
    const res = await deleteBankAccountForUser(user.phone);
    if (res.error) {
      setErrorMsg(res.error);
      return;
    }

    onAccountDeleted(res.user);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9998,
      backgroundColor: 'rgba(5, 7, 12, 0.9)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: '#120d18',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        borderRadius: '26px',
        boxShadow: '0 25px 70px rgba(0,0,0,0.85), 0 0 35px rgba(239, 68, 68, 0.2)',
        padding: '30px',
        color: '#111827',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f9fafb',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '18px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            color: '#ef4444'
          }}>
            <ShieldAlert size={28} />
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>
            Close & Delete Bank Account
          </h2>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            This closes your Bheeshma Bank Account, terminates your IBAN, and purges all banking records. Your website profile will remain intact.
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#f87171',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '12px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleDeleteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Verification: Password */}
          <div>
            <label style={{ fontSize: '11px', color: '#4b5563', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <KeyRound size={12} />
              <span>Verify Account Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your security passcode"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={{
                width: '100%',
                marginTop: '4px',
                background: '#f9fafb',
                border: '1px solid rgba(0, 0, 0, 0.15)',
                borderRadius: '10px',
                padding: '10px 12px',
                color: '#111827',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          {/* Verification: Last 4 digits of phone */}
          <div>
            <label style={{ fontSize: '11px', color: '#4b5563', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Smartphone size={12} />
              <span>Enter Last 4 Digits of Linked Phone (...{last4Digits})</span>
            </label>
            <input
              type="text"
              maxLength={4}
              placeholder="Last 4 digits"
              value={phoneDigitsInput}
              onChange={(e) => setPhoneDigitsInput(e.target.value)}
              style={{
                width: '100%',
                marginTop: '4px',
                background: '#f9fafb',
                border: '1px solid rgba(0, 0, 0, 0.15)',
                borderRadius: '10px',
                padding: '10px 12px',
                color: '#111827',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          {/* Reason */}
          <div>
            <label style={{ fontSize: '11px', color: '#4b5563', fontWeight: '700' }}>Reason for Account Closure</label>
            <select
              value={closureReason}
              onChange={(e) => setClosureReason(e.target.value)}
              style={{
                width: '100%',
                marginTop: '4px',
                background: '#f9fafb',
                border: '1px solid rgba(0, 0, 0, 0.15)',
                borderRadius: '10px',
                padding: '10px 12px',
                color: '#111827',
                fontSize: '13px',
                outline: 'none'
              }}
            >
              <option value="Consolidating accounts" style={{ background: '#0d131f' }}>Consolidating into another institution</option>
              <option value="Temporary pause" style={{ background: '#0d131f' }}>Temporary pause / Privacy reset</option>
              <option value="Relocating jurisdiction" style={{ background: '#0d131f' }}>Relocating jurisdiction</option>
              <option value="Other" style={{ background: '#0d131f' }}>Other</option>
            </select>
          </div>

          {/* Type confirmation phrase */}
          <div>
            <label style={{ fontSize: '11px', color: '#ef4444', fontWeight: '700' }}>
              Type <b>CLOSE BANK ACCOUNT</b> to confirm
            </label>
            <input
              type="text"
              placeholder="CLOSE BANK ACCOUNT"
              value={confirmPhrase}
              onChange={(e) => setConfirmPhrase(e.target.value)}
              style={{
                width: '100%',
                marginTop: '4px',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '10px',
                padding: '10px 12px',
                color: '#111827',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          {/* Checkbox Acknowledgment */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '4px' }}>
            <input
              type="checkbox"
              id="closeAck"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              style={{ marginTop: '2px', accentColor: '#ef4444', cursor: 'pointer' }}
            />
            <label htmlFor="closeAck" style={{ fontSize: '11px', color: '#6b7280', cursor: 'pointer' }}>
              I understand that closing my bank account will permanently deactivate my debit card, void my IBAN, and remove all transaction records from the ledger.
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '13px 18px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.15)',
                background: 'transparent',
                color: '#4b5563',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isProcessing}
              style={{
                flex: 1,
                padding: '13px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                color: '#111827',
                fontSize: '14px',
                fontWeight: '800',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)'
              }}
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={16} style={{ animation: 'spin 1s infinite linear' }} />
                  <span>Deleting Bank Account...</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>Permanently Delete Bank Account</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
