import React, { useState } from 'react';
import { X, AtSign, Smartphone, ArrowRight } from 'lucide-react';

export const QuickTransferModal = ({ isOpen, onClose, onInitiateTransfer, contacts, mode = "contact", prefilledRecipient }) => {
  const [recipientInput, setRecipientInput] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (isOpen && prefilledRecipient) {
      setSelectedContact(prefilledRecipient);
      setRecipientInput(prefilledRecipient.name);
    } else if (isOpen && !prefilledRecipient) {
      setRecipientInput("");
      setSelectedContact(null);
    }
  }, [isOpen, prefilledRecipient]);

  if (!isOpen) return null;

  const quickAmounts = [10, 50, 100, 200, 500];

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setRecipientInput(contact.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount.toString().replace(/,/g, ''));
    if (!parsedAmount || parsedAmount <= 0) {
      setError("Please enter a valid transfer amount.");
      return;
    }
    setError("");

    const recipient = selectedContact || {
      name: recipientInput || "UPI Recipient",
      upiId: recipientInput.includes("@") ? recipientInput : `${recipientInput.toLowerCase().replace(/[^a-z0-9]/g, '')}@okaxis`,
      initials: (recipientInput || "UR").substring(0, 2).toUpperCase()
    };

    onInitiateTransfer({
      recipient,
      amount: parsedAmount,
      note: note || "Transfer via BheeshmaPay AI"
    });

    // Reset fields
    setAmount("");
    setNote("");
    setError("");
    setSelectedContact(null);
    setRecipientInput("");
    onClose();
  };

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
        background: '#18122b',
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
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {mode === "mobile" ? <Smartphone size={18} /> : <AtSign size={18} />}
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '700' }}>
                {mode === "mobile" ? "Send to Mobile Number" : "Send to Bank / UPI ID"}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>Zero Transaction Fee • Instant Settlement</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {/* Recipient Input */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>
              {mode === "mobile" ? "Enter Mobile Number or Name" : "Enter UPI ID or Account Number"}
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f9fafb',
              border: '1px solid rgba(139, 63, 240, 0.3)',
              borderRadius: '12px',
              padding: '0 14px'
            }}>
              <input 
                type="text"
                placeholder={mode === "mobile" ? "e.g. 9811122334 or Alex" : "e.g. name@bheeshma or user@upi"}
                value={recipientInput}
                onChange={(e) => {
                  setRecipientInput(e.target.value);
                  setSelectedContact(null);
                }}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  padding: '12px 0',
                  color: '#111827',
                  fontSize: '14px'
                }}
                required
              />
            </div>
          </div>

          {/* Quick Frequent Contacts */}
          {contacts && contacts.length > 0 && !selectedContact && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Quick Contacts
              </div>
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                {contacts.slice(0, 4).map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectContact(c)}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      padding: '8px 12px',
                      color: '#111827',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: c.avatarBg,
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700'
                    }}>
                      {c.initials}
                    </div>
                    <span style={{ fontSize: '12px' }}>{c.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>
              Transfer Amount (₹)
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f9fafb',
              border: '1px solid rgba(139, 63, 240, 0.3)',
              borderRadius: '12px',
              padding: '0 14px'
            }}>
              <span style={{ fontSize: '20px', color: '#8b3ff0', fontWeight: '700', marginRight: '6px' }}>₹</span>
              <input 
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, '');
                  if (rawValue === '' || !isNaN(rawValue)) {
                    setAmount(rawValue ? Number(rawValue).toLocaleString('en-IN') : '');
                  }
                }}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  padding: '12px 0',
                  color: '#111827',
                  fontSize: '22px',
                  fontWeight: '700',
                  fontFamily: 'Outfit, sans-serif'
                }}
                required
              />
            </div>
            {error && <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: '500', marginTop: '6px' }}>{error}</div>}

            {/* Quick Pill Amounts */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
              {quickAmounts.map(q => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(q.toString())}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(139, 63, 240, 0.3)',
                    background: amount === q.toString() ? '#6739b6' : 'rgba(255,255,255,0.04)',
                    color: '#111827',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  +${q}
                </button>
              ))}
            </div>
          </div>

          {/* Note Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>
              Add a note (optional)
            </label>
            <input 
              type="text"
              placeholder="e.g. Rent, Dinner, Coffee split"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{
                width: '100%',
                background: '#f9fafb',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                padding: '10px 14px',
                color: '#111827',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #6739b6 0%, #8b3ff0 100%)',
              color: '#111827',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(103, 57, 182, 0.5)'
            }}
          >
            <span>Proceed to Secure Pay</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
