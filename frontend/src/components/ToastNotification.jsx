import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Info, X, ShieldAlert } from 'lucide-react';

export const ToastNotification = ({ message, type = 'info', onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const icons = {
    error: <AlertCircle size={20} color="#fca5a5" />,
    success: <CheckCircle size={20} color="#6ee7b7" />,
    warning: <ShieldAlert size={20} color="#fcd34d" />,
    info: <Info size={20} color="#93c5fd" />
  };

  const backgrounds = {
    error: 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)',
    success: 'linear-gradient(135deg, #065f46 0%, #022c22 100%)',
    warning: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
    info: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)'
  };
  
  const borderColors = {
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    info: '#3b82f6'
  };

  return (
    <div style={{
      position: 'fixed',
      top: '40px',
      left: '50%',
      transform: `translateX(-50%) translateY(${isVisible ? '0' : '-100px'})`,
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 10000,
      background: backgrounds[type] || backgrounds.info,
      border: `1px solid ${borderColors[type] || borderColors.info}`,
      borderRadius: '16px',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      minWidth: '320px',
      maxWidth: '90%'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icons[type] || icons.info}
      </div>
      <div style={{ flex: 1, color: '#f8fafc', fontSize: '14px', fontWeight: '500', lineHeight: '1.4' }}>
        {message}
      </div>
      <button 
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{
          background: 'none', border: 'none', color: '#94a3b8', 
          cursor: 'pointer', padding: '4px', display: 'flex', 
          alignItems: 'center', justifyContent: 'center'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
