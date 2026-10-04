import React, { useState, useRef, useEffect } from 'react';
import { X, Send, ArrowLeft, MoreVertical, IndianRupee } from 'lucide-react';
import { UpiPinModal } from './UpiPinModal';

export const ContactChatModal = ({ isOpen, onClose, contact, onSuccessPayment, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");
  const [mode, setMode] = useState("chat"); // 'chat' or 'pay'
  const [payAmount, setPayAmount] = useState("");
  const [payError, setPayError] = useState("");
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && contact && currentUser?.phone) {
      const fetchChats = async () => {
        try {
          const res = await fetch(`http://127.0.0.1:5000/api/p2p-chat?phone1=${currentUser.phone}&phone2=${contact.phone}`);
          const data = await res.json();
          // Transform backend data to frontend format
          const formatted = data.map(m => ({
            id: m.id || m.timestamp,
            text: m.text,
            sender: m.senderPhone === currentUser.phone ? "me" : "them",
            time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          if (formatted.length > 0) {
            setMessages(formatted);
          } else {
            setMessages([
              { id: 1, text: "Hey! Let's chat securely on Bheeshma.", sender: "them", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            ]);
          }
        } catch (e) {
          console.error("Failed to fetch chats", e);
        }
      };
      fetchChats();
      const interval = setInterval(fetchChats, 2000);
      
      setMode("chat");
      setPayAmount("");
      setPayError("");
      setSuccessMsg("");
      return () => clearInterval(interval);
    }
  }, [isOpen, contact, currentUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, mode]);

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !currentUser?.phone) return;
    
    const newMsg = {
      id: Date.now(),
      text: inputMsg,
      senderPhone: currentUser.phone,
      receiverPhone: contact.phone,
      timestamp: new Date().toISOString()
    };
    
    // Optimistic UI update
    const frontendMsg = {
      id: newMsg.id,
      text: newMsg.text,
      sender: "me",
      time: new Date(newMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, frontendMsg]);
    setInputMsg("");

    try {
      await fetch('http://127.0.0.1:5000/api/p2p-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg)
      });
    } catch (e) {
      console.error("Failed to send message", e);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear this chat?")) {
      setMessages([]);
      localStorage.removeItem(`chat_${contact.phone}`);
    }
  };

  const handleInitiatePay = (e) => {
    e.preventDefault();
    const amount = parseFloat(payAmount.replace(/,/g, ''));
    if (isNaN(amount) || amount <= 0) {
      setPayError("The minimum payable amount is ₹1.");
      return;
    }
    setPayError("");
    
    // Delegate entirely to App.jsx so it uses the real transaction flow, PIN validation, and balance checks.
    if (onSuccessPayment) {
      onSuccessPayment({
        recipient: contact,
        amount: amount,
        note: "Chat Payment"
      });
    }
    setMode("chat");
    setPayAmount("");
  };

  if (!isOpen || !contact) return null;

  return (
    <>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)'
      }}>
        <div style={{
          background: '#ffffff', borderRadius: '24px', width: '90%', maxWidth: '400px', height: '80vh',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: '#111827', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}>
                <ArrowLeft size={20} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={contact.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=Bheeshma"} alt={contact.name} style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fff' }} />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700' }}>{contact.name}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>{contact.phone}</div>
                </div>
              </div>
            </div>
            <button onClick={handleClearChat} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, fontSize: '13px', fontWeight: '600' }}>
              Clear
            </button>
          </div>

          {/* Chat / Content Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#f9fafb', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {successMsg && (
              <div style={{ background: '#d1fae5', color: '#065f46', padding: '10px', borderRadius: '8px', fontSize: '12px', textAlign: 'center', fontWeight: '600' }}>
                {successMsg}
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '75%',
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'me' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                  background: msg.sender === 'me' ? '#3b82f6' : '#ffffff',
                  color: msg.sender === 'me' ? '#ffffff' : '#111827',
                  border: msg.sender === 'me' ? 'none' : '1px solid #e5e7eb',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                  {msg.type === 'payment' ? (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>₹{msg.amount}</div>
                      <div style={{ fontSize: '11px', opacity: 0.9 }}>Paid Successfully ✓</div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '14px', lineHeight: '1.4' }}>{msg.text}</div>
                  )}
                  <div style={{ fontSize: '9px', textAlign: 'right', marginTop: '4px', opacity: 0.7 }}>{msg.time}</div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Action Footer */}
          {mode === 'chat' ? (
            <div style={{ padding: '12px', background: '#fff', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button 
                onClick={() => setMode('pay')}
                style={{ 
                  background: '#111827', color: '#fff', border: 'none', borderRadius: '50px', 
                  padding: '10px 20px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <IndianRupee size={16} /> Pay
              </button>
              <form onSubmit={handleSendChat} style={{ flex: 1, display: 'flex', background: '#f3f4f6', borderRadius: '50px', padding: '6px 6px 6px 16px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={inputMsg}
                  onChange={e => setInputMsg(e.target.value)}
                  placeholder="Message..." 
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px' }}
                />
                <button type="submit" style={{ background: '#3b82f6', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
                  <Send size={16} />
                </button>
              </form>
            </div>
          ) : (
            <div style={{ padding: '20px', background: '#fff', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Enter Amount</h4>
                <button onClick={() => setMode('chat')} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                  Cancel
                </button>
              </div>
              
              <form onSubmit={handleInitiatePay} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 16px' }}>
                  <IndianRupee size={20} color="#4b5563" />
                  <input 
                    type="text"
                    value={payAmount}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, '');
                      if (rawValue === '' || !isNaN(rawValue)) {
                        setPayAmount(rawValue ? Number(rawValue).toLocaleString('en-IN') : '');
                      }
                    }}
                    placeholder="0"
                    style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '24px', fontWeight: '800', marginLeft: '10px' }}
                    autoFocus
                  />
                </div>
                {payError && <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600' }}>{payError}</div>}
                
                <button type="submit" style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginTop: '4px' }}>
                  Proceed to Pay
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
