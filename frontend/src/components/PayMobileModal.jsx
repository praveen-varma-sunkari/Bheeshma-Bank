import React, { useState, useEffect } from 'react';
import { Search, Copy, Check, UserPlus, X, Send, ArrowLeft } from 'lucide-react';
import { searchUsersByPhone } from '../data/mockData';

export const PayMobileModal = ({ isOpen, onClose, onSimulateLinkClick, onSelectContact, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [copied, setCopied] = useState(false);
  const [savingContact, setSavingContact] = useState(null); // The phone number being saved
  const [contactName, setContactName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (searchTerm.length >= 3) {
      const allResults = searchUsersByPhone(searchTerm);
      const filteredResults = currentUser ? allResults.filter(r => r.phone !== currentUser.phone) : allResults;
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  }, [searchTerm, currentUser]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://bheeshmabanking.app/invite?ref=mobile_${searchTerm}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    if (!contactName.trim()) return;
    
    // Simulate saving contact
    setSuccessMessage(`Successfully saved the contact ${contactName}`);
    setSavingContact(null);
    setContactName("");
    
    setTimeout(() => {
      setSuccessMessage("");
    }, 20000); // 20 seconds
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: '#ffffff', borderRadius: '24px', width: '90%', maxWidth: '600px',
        padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '20px', right: '20px', background: '#f3f4f6', border: 'none',
          borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <X size={16} color="#4b5563" />
        </button>

        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#111827' }}>Pay to Mobile</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>Enter a mobile number to transfer funds.</p>

        {successMessage && (
          <div style={{ background: '#d1fae5', color: '#065f46', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={16} /> {successMessage}
          </div>
        )}

        {savingContact ? (
          <div>
            <button onClick={() => setSavingContact(null)} style={{ background: 'none', border: 'none', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginBottom: '16px', padding: 0 }}>
              <ArrowLeft size={14} /> Back
            </button>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Save Contact: {savingContact}</h3>
            <form onSubmit={handleSaveContact} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="Enter contact name..."
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }}
                autoFocus
              />
              <button type="submit" style={{ background: '#111827', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                Save Contact
              </button>
            </form>
          </div>
        ) : (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', background: '#f9fafb', border: '1px solid #e5e7eb',
              borderRadius: '12px', padding: '10px 14px', marginBottom: '20px'
            }}>
              <Search size={18} color="#9ca3af" />
              <input
                type="text"
                placeholder="Search by name or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1, border: 'none', background: 'transparent', outline: 'none',
                  marginLeft: '10px', fontSize: '15px', color: '#111827'
                }}
                autoFocus
              />
            </div>

            {searchTerm.length >= 3 ? (
              <div>
                {results.length > 0 ? (
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '10px' }}>MATCHING USERS</div>
                    {results.map((r, i) => (
                      <div key={i} onClick={() => onSelectContact(r)} style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                        borderRadius: '12px', cursor: 'pointer', transition: 'background 0.2s',
                        background: '#f9fafb', marginBottom: '8px', border: '1px solid #e5e7eb'
                      }}>
                        <img src={r.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=Bheeshma"} alt={r.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{r.name}</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>{r.phone}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={(e) => {
                            e.stopPropagation();
                            setSavingContact(r.phone);
                          }} style={{
                            background: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db', borderRadius: '8px',
                            padding: '6px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
                          }}>
                            Save
                          </button>
                          <button style={{
                            background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px',
                            padding: '6px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
                          }}>
                            Pay
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{
                      width: '60px', height: '60px', borderRadius: '50%', background: '#f3f4f6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
                    }}>
                      <UserPlus size={24} color="#6b7280" />
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Unknown Number</h3>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
                      No matching user found. Do you want to save this contact?
                    </p>
                    <button onClick={() => setSavingContact(searchTerm)} style={{
                      background: '#111827', color: '#fff', border: 'none',
                      borderRadius: '8px', padding: '10px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', width: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px'
                    }}>
                      <UserPlus size={16} /> Save New Contact
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#9ca3af', fontSize: '13px' }}>
                Type at least 3 characters to search.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
