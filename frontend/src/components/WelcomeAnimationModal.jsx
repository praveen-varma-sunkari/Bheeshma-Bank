import React, { useState, useEffect } from 'react';
import { Sparkles, Globe, ShieldCheck, ArrowRight, X } from 'lucide-react';

export const WelcomeAnimationModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      const timers = [
        setTimeout(() => setStep(1), 500),
        setTimeout(() => setStep(2), 2500),
        setTimeout(() => setStep(3), 4500),
        setTimeout(() => setStep(4), 6500)
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a0a', overflow: 'hidden'
    }}>
      <button onClick={onClose} style={{
        position: 'absolute', top: '30px', right: '30px', background: 'rgba(0, 0, 0, 0.1)', border: 'none',
        borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', zIndex: 10, color: '#fff'
      }}>
        <X size={20} />
      </button>

      {/* Video-like background animation */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '150vw', height: '150vh', background: 'radial-gradient(circle at center, rgba(0,240,255,0.15) 0%, rgba(0,0,0,1) 50%)',
        animation: 'pulseBg 4s infinite alternate', opacity: step >= 1 ? 1 : 0, transition: 'opacity 1s ease'
      }} />

      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', color: '#fff', maxWidth: '600px', padding: '40px' }}>
        
        <div style={{
          opacity: step === 1 ? 1 : 0, transform: step === 1 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease', position: 'absolute', width: '100%', left: 0, top: '100px', pointerEvents: step === 1 ? 'auto' : 'none'
        }}>
          <Sparkles size={64} color="#00f0ff" style={{ margin: '0 auto 24px' }} />
          <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome to the Future.
          </h1>
          <p style={{ fontSize: '20px', color: '#94a3b8' }}>You've been invited to Bheeshma Bank.</p>
        </div>

        <div style={{
          opacity: step === 2 ? 1 : 0, transform: step === 2 ? 'translateY(0)' : (step < 2 ? 'translateY(20px)' : 'translateY(-20px)'),
          transition: 'all 0.8s ease', position: 'absolute', width: '100%', left: 0, top: '100px', pointerEvents: step === 2 ? 'auto' : 'none'
        }}>
          <Globe size={64} color="#3b82f6" style={{ margin: '0 auto 24px' }} />
          <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px' }}>
            Borderless Finance.
          </h1>
          <p style={{ fontSize: '20px', color: '#94a3b8' }}>Send money anywhere, instantly, with zero fees.</p>
        </div>

        <div style={{
          opacity: step === 3 ? 1 : 0, transform: step === 3 ? 'translateY(0)' : (step < 3 ? 'translateY(20px)' : 'translateY(-20px)'),
          transition: 'all 0.8s ease', position: 'absolute', width: '100%', left: 0, top: '100px', pointerEvents: step === 3 ? 'auto' : 'none'
        }}>
          <ShieldCheck size={64} color="#10b981" style={{ margin: '0 auto 24px' }} />
          <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px' }}>
            Military-Grade Security.
          </h1>
          <p style={{ fontSize: '20px', color: '#94a3b8' }}>Secured by advanced AI and biometric authentication.</p>
        </div>

        <div style={{
          opacity: step >= 4 ? 1 : 0, transform: step >= 4 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease', position: 'absolute', width: '100%', left: 0, top: '100px', pointerEvents: step >= 4 ? 'auto' : 'none'
        }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '30px', background: 'linear-gradient(135deg, #00f0ff, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', boxShadow: '0 0 40px rgba(0, 240, 255, 0.4)'
          }}>
            <span style={{ fontSize: '40px', fontWeight: '900', color: '#111827' }}>A</span>
          </div>
          <h1 style={{ fontSize: '56px', fontWeight: '900', marginBottom: '24px', letterSpacing: '-1px' }}>
            Bheeshma Bank
          </h1>
          <button onClick={onClose} style={{
            background: '#fff', color: '#111827', border: 'none', borderRadius: '16px', padding: '16px 32px',
            fontSize: '18px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', margin: '0 auto',
            boxShadow: '0 10px 25px rgba(255,255,255,0.2)', transition: 'transform 0.2s'
          }}>
            Create Your Account <ArrowRight size={20} />
          </button>
        </div>

      </div>

      <style>{`
        @keyframes pulseBg {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
