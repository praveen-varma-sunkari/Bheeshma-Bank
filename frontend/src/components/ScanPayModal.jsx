import React, { useState } from 'react';
import { X, Camera, ShieldCheck, Copy } from 'lucide-react';

export const ScanPayModal = ({ isOpen, onClose, user, onSimulateMerchantScan }) => {
  const [activeTab, setActiveTab] = useState("scan"); // 'scan' | 'myqr'
  const [copied, setCopied] = useState(false);
  const [scanPhone, setScanPhone] = useState("");

  if (!isOpen) return null;

  const handleCopyUPI = () => {
    navigator.clipboard?.writeText(user.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      zIndex: 9998,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: '#ffffff',
        borderRadius: '26px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        color: '#111827',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Modal Top Header */}
        <div style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', gap: '8px', background: '#f3f4f6', padding: '4px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <button
              onClick={() => setActiveTab("scan")}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === "scan" ? '#8b3ff0' : 'transparent',
                color: activeTab === "scan" ? '#ffffff' : '#6b7280',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Scan Any QR
            </button>
            <button
              onClick={() => setActiveTab("myqr")}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === "myqr" ? '#8b3ff0' : 'transparent',
                color: activeTab === "myqr" ? '#ffffff' : '#6b7280',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              My QR Code
            </button>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {activeTab === "scan" ? (
          <div style={{ padding: '24px 20px', textAlign: 'center' }}>
            {/* Viewfinder simulator */}
            <div style={{
              position: 'relative',
              width: '240px',
              height: '240px',
              margin: '0 auto 20px',
              borderRadius: '24px',
              border: '2px solid rgba(139, 63, 240, 0.3)',
              background: '#f9fafb',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Corner brackets */}
              <div style={{ position: 'absolute', top: 12, left: 12, width: 24, height: 24, borderTop: '3px solid #8b3ff0', borderLeft: '3px solid #8b3ff0' }} />
              <div style={{ position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderTop: '3px solid #8b3ff0', borderRight: '3px solid #8b3ff0' }} />
              <div style={{ position: 'absolute', bottom: 12, left: 12, width: 24, height: 24, borderBottom: '3px solid #8b3ff0', borderLeft: '3px solid #8b3ff0' }} />
              <div style={{ position: 'absolute', bottom: 12, right: 12, width: 24, height: 24, borderBottom: '3px solid #8b3ff0', borderRight: '3px solid #8b3ff0' }} />

              {/* Animated laser line */}
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #8b3ff0, transparent)',
                boxShadow: '0 0 15px rgba(139, 63, 240, 0.5)',
                animation: 'scanLaser 2s infinite ease-in-out'
              }} />

              <Camera size={44} color="#d1d5db" />
            </div>

            <style>{`
              @keyframes scanLaser {
                0% { top: 10%; opacity: 0; }
                50% { opacity: 1; }
                100% { top: 90%; opacity: 0; }
              }
            `}</style>

            <div style={{ fontSize: '13px', color: '#4b5563', marginBottom: '8px' }}>
              Align BheeshmaPay, BharatQR, Google Pay, or any UPI QR code inside the frame
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
              <button
                onClick={() => {
                  onClose();
                  onSimulateMerchantScan({
                    recipient: { name: "Starbucks Coffee", upiId: "starbucks@icici", avatarBg: "#00704A", initials: "SB" },
                    amount: 6.80,
                    note: "Caramel Macchiato"
                  });
                }}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(0, 163, 255, 0.2)',
                  background: 'rgba(0, 163, 255, 0.05)',
                  color: '#0284c7',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Simulate Cafe QR (₹6.80)
              </button>
              <button
                onClick={() => {
                  onClose();
                  onSimulateMerchantScan({
                    recipient: { name: "Whole Foods Market", upiId: "wholefoods@hdfc", avatarBg: "#006241", initials: "WF" },
                    amount: 48.50,
                    note: "Organic Groceries"
                  });
                }}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  background: 'rgba(16, 185, 129, 0.05)',
                  color: '#047857',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Simulate Supermarket (₹48.50)
              </button>
            </div>

            {/* Simulate User Scan */}
            <div style={{ marginTop: '24px', padding: '16px', background: '#f9fafb', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px', textAlign: 'left', fontWeight: '500' }}>Or enter phone number to scan user:</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="tel" 
                  value={scanPhone}
                  onChange={e => setScanPhone(e.target.value)}
                  placeholder="e.g. 9988776655"
                  style={{ flex: 1, padding: '12px 14px', borderRadius: '12px', background: '#ffffff', border: '1px solid #d1d5db', color: '#111827', outline: 'none', fontSize: '14px' }}
                />
                <button 
                  onClick={() => {
                    if(scanPhone.trim().length > 3) {
                      onClose();
                      onSimulateMerchantScan({
                        recipient: { name: `User (${scanPhone})`, phone: scanPhone, upiId: `${scanPhone.replace(/[^0-9]/g, '')}@bheeshma`, initials: "U" },
                        note: "P2P Transfer via QR Scan"
                      });
                    }
                  }}
                  style={{ padding: '12px 20px', background: '#8b3ff0', border: 'none', borderRadius: '12px', color: '#ffffff', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                >
                  Scan
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '24px 20px', textAlign: 'center' }}>
            {/* My QR Tab */}
            <div style={{
              background: '#f9fafb',
              padding: '16px',
              borderRadius: '20px',
              display: 'inline-block',
              border: '1px solid #e5e7eb',
              marginBottom: '16px'
            }}>
              {/* High-quality SVG QR Code representation */}
              <svg width="180" height="180" viewBox="0 0 100 100" fill="#ffffff">
                <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                <rect x="0" y="0" width="30" height="30" fill="#8b3ff0" rx="4" />
                <rect x="5" y="5" width="20" height="20" fill="#ffffff" rx="2" />
                <rect x="9" y="9" width="12" height="12" fill="#8b3ff0" />

                <rect x="70" y="0" width="30" height="30" fill="#8b3ff0" rx="4" />
                <rect x="75" y="5" width="20" height="20" fill="#ffffff" rx="2" />
                <rect x="79" y="9" width="12" height="12" fill="#8b3ff0" />

                <rect x="0" y="70" width="30" height="30" fill="#8b3ff0" rx="4" />
                <rect x="5" y="75" width="20" height="20" fill="#ffffff" rx="2" />
                <rect x="9" y="79" width="12" height="12" fill="#8b3ff0" />

                {/* Matrix dots */}
                <rect x="36" y="8" width="6" height="6" fill="#111827" />
                <rect x="48" y="8" width="6" height="6" fill="#111827" />
                <rect x="42" y="20" width="6" height="6" fill="#111827" />
                <rect x="54" y="20" width="6" height="6" fill="#111827" />
                <rect x="12" y="40" width="6" height="6" fill="#111827" />
                <rect x="24" y="46" width="6" height="6" fill="#111827" />
                <rect x="36" y="40" width="10" height="10" fill="#10b981" rx="2" />
                <rect x="54" y="42" width="6" height="6" fill="#111827" />
                <rect x="66" y="42" width="6" height="6" fill="#111827" />
                <rect x="80" y="44" width="6" height="6" fill="#111827" />
                <rect x="40" y="60" width="6" height="6" fill="#111827" />
                <rect x="50" y="60" width="6" height="6" fill="#111827" />
                <rect x="70" y="66" width="6" height="6" fill="#111827" />
                <rect x="84" y="74" width="6" height="6" fill="#111827" />
                <rect x="44" y="80" width="6" height="6" fill="#111827" />
                <rect x="56" y="84" width="6" height="6" fill="#111827" />
              </svg>
            </div>

            <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px', color: '#111827' }}>{user.name}</div>
            <div style={{ fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '16px' }}>
              <span>UPI: {user.upiId}</span>
              <button onClick={handleCopyUPI} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Copy size={14} />
              </button>
            </div>
            {copied && <div style={{ fontSize: '12px', color: '#10b981', marginBottom: '12px', fontWeight: '600' }}>UPI ID copied!</div>}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: '#4b5563', fontWeight: '500' }}>
              <ShieldCheck size={16} color="#10b981" />
              Verified BHIM UPI Merchant & Individual VPA
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
