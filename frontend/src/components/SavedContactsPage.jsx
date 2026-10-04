import React, { useState, useEffect } from 'react';
import { Search, Copy, Check, UserPlus, X, Send, ArrowLeft } from 'lucide-react';
import { searchUsersByPhone } from '../data/mockData';

export const SavedContactsPage = ({ contacts = [], onAddContact, onSimulateLinkClick, onSelectContact, onBack, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [copied, setCopied] = useState(false);
  const [savingContact, setSavingContact] = useState(null); // The phone number being saved
  const [contactName, setContactName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const doSearch = async () => {
      if (searchTerm.length >= 3) {
        const allResults = await searchUsersByPhone(searchTerm);
        const filteredResults = currentUser ? allResults.filter(r => r.phone !== currentUser.phone) : allResults;
        setResults(filteredResults);
      } else {
        setResults([]);
      }
    };
    doSearch();
  }, [searchTerm, currentUser]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://bheeshmabanking.app/invite?ref=mobile_${searchTerm}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    if (!contactName.trim()) return;
    
    const newContact = {
      name: contactName.trim(),
      phone: savingContact,
      upiId: `${contactName.trim().toLowerCase().replace(/\s+/g, '')}@bheeshma`,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(contactName.trim())}`,
      recentAmount: 0
    };
    
    if (onAddContact) onAddContact(newContact);
    
    setSuccessMessage(`Successfully saved the contact ${contactName}`);
    setSavingContact(null);
    setContactName("");
    
    setTimeout(() => {
      setSuccessMessage("");
    }, 20000); // 20 seconds
  };

  return (
    <div style={{
      background: '#f9fafb', minHeight: '100%', display: 'flex', flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '24px', background: '#111827', color: '#fff', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 10
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>Saved Contacts</h2>
          <div style={{ fontSize: '13px', color: '#9ca3af' }}>Search and manage your payees</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: '#ffffff', borderRadius: '24px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          {successMessage && (
            <div style={{ background: '#d1fae5', color: '#065f46', padding: '16px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
              <Check size={18} /> {successMessage}
            </div>
          )}

          {savingContact ? (
            <div>
              <button onClick={() => setSavingContact(null)} style={{ background: 'none', border: 'none', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '20px', padding: 0, fontSize: '14px', fontWeight: '500' }}>
                <ArrowLeft size={16} /> Back to Search
              </button>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>Save Contact: {savingContact}</h3>
              <form onSubmit={handleSaveContact} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                  type="text"
                  placeholder="Enter contact name..."
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  style={{ padding: '14px', borderRadius: '12px', border: '1px solid #d1d5db', outline: 'none', fontSize: '15px' }}
                  autoFocus
                />
                <button type="submit" style={{ background: '#111827', color: '#fff', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                  Save Contact
                </button>
              </form>
            </div>
          ) : (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', background: '#f9fafb', border: '1px solid #e5e7eb',
                borderRadius: '16px', padding: '14px 18px', marginBottom: '24px'
              }}>
                <Search size={20} color="#9ca3af" />
                <input
                  type="text"
                  placeholder="Search by name or number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1, border: 'none', background: 'transparent', outline: 'none',
                    marginLeft: '12px', fontSize: '16px', color: '#111827'
                  }}
                  autoFocus
                />
              </div>

              {searchTerm.length >= 3 ? (
                <div>
                  {results.length > 0 ? (
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>MATCHING USERS</div>
                      {results.map((r, i) => (
                        <div key={i} onClick={() => onSelectContact(r)} style={{
                          display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
                          borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s',
                          background: '#ffffff', marginBottom: '12px', border: '1px solid #e5e7eb',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}>
                          <img src={r.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=Bheeshma"} alt={r.name} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '2px' }}>{r.name}</div>
                            <div style={{ fontSize: '14px', color: '#6b7280' }}>{r.phone}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={(e) => {
                              e.stopPropagation();
                              setSavingContact(r.phone);
                            }} style={{
                              background: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db', borderRadius: '10px',
                              padding: '8px 16px', fontSize: '13px', fontWeight: '700', cursor: 'pointer'
                            }}>
                              Save
                            </button>
                            <button style={{
                              background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px',
                              padding: '8px 16px', fontSize: '13px', fontWeight: '700', cursor: 'pointer'
                            }}>
                              Pay
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <div style={{
                        width: '72px', height: '72px', borderRadius: '50%', background: '#f3f4f6',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
                      }}>
                        <UserPlus size={32} color="#6b7280" />
                      </div>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '10px' }}>Unknown Number</h3>
                      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                        No matching user found. Do you want to save this contact?
                      </p>
                      <button onClick={() => setSavingContact(searchTerm)} style={{
                        background: '#111827', color: '#fff', border: 'none',
                        borderRadius: '12px', padding: '14px 20px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', width: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                      }}>
                        <UserPlus size={20} /> Save New Contact
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding: '20px 0' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>YOUR SAVED CONTACTS</div>
                  {contacts && contacts.length > 0 ? (
                    contacts.map((c, i) => (
                      <div key={i} onClick={() => onSelectContact(c)} style={{
                        display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
                        borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s',
                        background: '#ffffff', marginBottom: '12px', border: '1px solid #e5e7eb',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                      }}>
                        <img src={c.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${c.name}`} alt={c.name} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '2px' }}>{c.name}</div>
                          <div style={{ fontSize: '14px', color: '#6b7280' }}>{c.phone || c.upiId}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button style={{
                            background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px',
                            padding: '8px 16px', fontSize: '13px', fontWeight: '700', cursor: 'pointer'
                          }}>
                            Chat / Pay
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af', fontSize: '15px' }}>
                      You have no saved contacts yet.<br/>Type a number above to search and add one.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
