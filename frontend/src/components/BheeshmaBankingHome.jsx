import React, { useState } from 'react';
import { 
  Landmark, QrCode, Eye, EyeOff, 
  ArrowUpRight, ArrowDownLeft, ShieldCheck, Zap, 
  Search, Bot, ChevronRight, Settings, FileCheck, Copy, Check, CheckCircle,
  Globe, TrendingUp, Sparkles, LogOut, Wallet, ArrowRightLeft, ArrowRight, User, Activity
} from 'lucide-react';
import { UpiPinModal } from './UpiPinModal';

export const BheeshmaBankingHome = ({
  user,
  transactions = [],
  contacts,
  onOpenTransferModal,
  onOpenScanPay,
  onOpenCheckBalance,
  onSelectContactToPay,
  onNavigateToCopilot,
  onNavigateToLoans,
  onOpenSettings,
  _onOpenAuthModal,
  onOpenOpenBankAccount,
  onOpenCloseBankAccount,
  onLogoutWebsite,
  onOpenPayMobile,
  onOpenMyQR,
  onToggleLock,
  onOpenBookings,
  onOpenAddMoney,
  onNavigateToAIInsights,
  onOpenContactChat,
  onNavigateToSavedContacts,
  onNavigateToTransactionHistory,
  onClearAccountCreatedModal
}) => {
  const [showBalance, setShowBalance] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [txSearch, setTxSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [copiedIban, setCopiedIban] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState(user?.currency || "INR");
  const hasFraudAlert = !!user?.pendingFraudAlert;

  const hasBankAccount = Boolean(user?.hasBankAccount);
  const primaryAccount = user?.accounts?.find(a => a.isPrimary) || user?.accounts?.[0] || {
    bankName: "Bheeshma Sovereign Checking",
    accountNumber: "•••• 0000",
    balance: 0.00,
    type: "Unprovisioned"
  };

  const currencySymbols = {
    INR: "₹",
    EUR: "€",
    GBP: "£",
    USD: "$"
  };

  const currentSymbol = currencySymbols[activeCurrency] || "₹";

  const exchangeRates = {
    INR: 1.0,
    EUR: 0.92,
    GBP: 0.78,
    USD: 0.012
  };

  const formatAmount = (amt) => {
    const rate = exchangeRates[activeCurrency] || 1.0;
    const converted = amt * rate;
    return `${currentSymbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleCopyIban = () => {
    if (!user?.iban) return;
    navigator.clipboard?.writeText(user.iban);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.title.toLowerCase().includes(txSearch.toLowerCase()) || 
                          (tx.upiId && tx.upiId.toLowerCase().includes(txSearch.toLowerCase())) ||
                          (tx.category && tx.category.toLowerCase().includes(txSearch.toLowerCase()));
    const matchesCategory = selectedCategory === "ALL" || tx.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = ["ALL", ...Array.from(new Set(transactions.map(t => t.category || "General")))];

  return (
    <div style={{ paddingBottom: '30px' }}>
      {/* Top International Neobank Navigation Banner */}
      <div style={{
        background: '#ffffff',
        padding: '22px 20px 24px',
        borderRadius: '0 0 28px 28px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
        color: '#111827',
        position: 'relative'
      }}>
        {/* Top identity bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div onClick={onOpenSettings} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '16px',
              border: '2px solid rgba(0, 240, 255, 0.5)',
              overflow: 'hidden',
              background: '#f3f4f6',
              boxShadow: '0 0 16px rgba(0, 240, 255, 0.25)'
            }}>
              <img src={user?.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=Bheeshma"} alt={user?.name || "User"} style={{ width: '100%', height: '100%' }} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontFamily: 'Outfit, sans-serif' }}>{user?.name || "Bheeshma User"}</span>
                <ShieldCheck size={16} color={hasBankAccount ? "#00f0ff" : "#f59e0b"} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  color: hasBankAccount ? '#000000' : '#f59e0b',
                  background: hasBankAccount ? 'rgba(0, 0, 0, 0.05)' : 'rgba(245, 158, 11, 0.12)',
                  padding: '1px 7px',
                  borderRadius: '6px',
                  letterSpacing: '0.4px'
                }}>
                  {hasBankAccount ? (user?.tier || "BHEESHMA BLACK") : "PROFILE VERIFIED (NO BANK ACCOUNT)"}
                </span>
                <span style={{ fontSize: '11px', color: '#6b7280' }}>
                  {hasBankAccount ? (user?.accountNumber || "BHEESHMA-7829-9182") : user?.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Action icon buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

            <button
              onClick={onOpenScanPay}
              title="International QR Scan & Pay"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                background: 'rgba(0, 0, 0, 0.05)',
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <QrCode size={18} />
            </button>

            {/* Requirement 5: Log out from website only */}
            <button
              onClick={onLogoutWebsite}
              title="Log Out from Bheeshma Website (Leaves Bank Account Intact)"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* BANK ACCOUNT STATUS: ACTIVE TITANIUM CARD vs PROVISIONING REQUIRED */}
        {(!user?.accounts || user.accounts.length === 0) ? (
          user?.accountRequested ? (
            <div className="titanium-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ marginBottom: '16px', background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '50%' }}>
                <Activity size={32} color="#00f0ff" />
              </div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>Your request is in progress</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
                Admin is verifying your documents. You will be notified once your account is provisioned.
              </p>
            </div>
          ) : (
            <div className="titanium-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ marginBottom: '16px', background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '50%' }}>
                <Sparkles size={32} color="#00f0ff" />
              </div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>Open Bank Account in Bheeshma</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
                You are currently unprovisioned. Create your Bheeshma sovereign bank account to unlock global transfers and AI wealth management.
              </p>
              <button
                onClick={onOpenOpenBankAccount}
                style={{
                  background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 210, 255, 0.3)'
                }}
              >
                Request Account Creation
              </button>
            </div>
          )
        ) : (
          <div className="titanium-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#94a3b8',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}>
                  <Sparkles size={14} />
                  <span>Bheeshma Sovereign Card</span>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                  {primaryAccount.type}
                </div>
              </div>

              {/* EMV Chip & Contactless wave */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '34px',
                  height: '24px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #d4af37, #aa7c11)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  boxShadow: 'inset 0 0 4px rgba(0,0,0,0.4)'
                }} />
                <Zap size={16} color="#00f0ff" />
              </div>
            </div>

            {/* Balance display */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
                  Primary Available Liquidity
                </span>
                <button 
                  onClick={() => {
                    if (showBalance) {
                      setShowBalance(false);
                    } else {
                      setIsPinModalOpen(true);
                    }
                  }}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {showBalance ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <div style={{
                fontSize: '34px',
                fontWeight: '900',
                fontFamily: 'Outfit, sans-serif',
                letterSpacing: '-1px',
                display: 'flex',
                alignItems: 'baseline',
                gap: '10px'
              }}>
                <span>{showBalance ? formatAmount(primaryAccount.balance) : "••••••••"}</span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.15)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px'
                }}>
                  <TrendingUp size={11} /> +2.4% APY
                </span>
              </div>
            </div>

            {/* Card Footer: Number & Expiry & IBAN copy & Close Bank Account */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '14px'
            }}>
              <div>
                <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  Cardholder Name
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0', letterSpacing: '0.5px' }}>
                  {user?.name?.toUpperCase()}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleCopyIban}
                  style={{
                    background: 'rgba(0, 240, 255, 0.08)',
                    border: '1px solid rgba(0, 240, 255, 0.25)',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    color: '#94a3b8',
                    fontSize: '11px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {copiedIban ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedIban ? "Copied" : (user?.iban ? user.iban.slice(0, 12) + "..." : "Copy IBAN")}</span>
                </button>

                {/* Requirement 5: Option to delete bank account */}
                <button
                  onClick={onOpenCloseBankAccount}
                  title="Close and Delete Bank Account"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    color: '#f87171',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Close Account
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Main Content Dashboard */}
      <div style={{ padding: '18px 16px' }}>

        {/* Global Financial Action 4-Grid */}
        <div style={{
          background: '#ffffff',
          borderRadius: '22px',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          padding: '18px 14px',
          marginBottom: '20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px 8px', textAlign: 'center' }}>
            <button
              onClick={() => onOpenAddMoney && onOpenAddMoney()}
              style={{ background: 'none', border: 'none', color: '#111827', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)',
                color: '#fff'
              }}>
                <Sparkles size={22} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700', lineHeight: '1.2' }}>Add<br />Money</span>
            </button>

            <button
              onClick={() => onNavigateToSavedContacts && onNavigateToSavedContacts()}
              style={{ background: 'none', border: 'none', color: '#111827', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(0, 240, 255, 0.35)',
                color: '#000000'
              }}>
                <ArrowRightLeft size={22} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700', lineHeight: '1.2' }}>Pay to<br />Mobile</span>
            </button>

            <button
              onClick={() => onOpenScanPay && onOpenScanPay()}
              style={{ background: 'none', border: 'none', color: '#111827', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.35)'
              }}>
                <QrCode size={22} color="#fff" />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700', lineHeight: '1.2' }}>Scan<br />QR Code</span>
            </button>

            <button
              onClick={() => onOpenMyQR && onOpenMyQR()}
              style={{ background: 'none', border: 'none', color: '#111827', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.35)'
              }}>
                <Eye size={22} color="#fff" />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700', lineHeight: '1.2' }}>My<br />QR Code</span>
            </button>

            <button
              onClick={() => onToggleLock && onToggleLock()}
              style={{ background: 'none', border: 'none', color: '#111827', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '16px',
                background: user?.isTransactionLocked ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)'
              }}>
                <ShieldCheck size={22} color="#fff" />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700', lineHeight: '1.2' }}>{user?.isTransactionLocked ? 'Unlock' : 'Lock'}<br />Access</span>
            </button>

            <button
              onClick={() => onOpenSettings && onOpenSettings()}
              style={{ background: 'none', border: 'none', color: '#111827', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)'
              }}>
                <User size={22} color="#fff" />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700', lineHeight: '1.2' }}>My<br />Account</span>
            </button>
          </div>
        </div>

        {/* Live Forex & Market Ticker Bar */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.03)',
          border: '1px solid rgba(0, 0, 0, 0.03)',
          borderRadius: '14px',
          padding: '10px 14px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          overflowX: 'auto',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#000000', fontWeight: '700' }}>
            <Globe size={14} />
            <span>GLOBAL RATES:</span>
          </div>
          <div style={{ color: '#4b5563' }}>EUR/INR: <b>1.0924</b> <span style={{ color: '#10b981' }}>+0.28%</span></div>
          <div style={{ color: '#4b5563' }}>GBP/INR: <b>1.3012</b> <span style={{ color: '#10b981' }}>+0.14%</span></div>
          <div style={{ color: '#4b5563' }}>INR/INR: <b>83.92</b> <span style={{ color: '#6b7280' }}>-0.02%</span></div>
          <div style={{ color: '#4b5563' }}>BHEESHMA APY: <b style={{ color: '#000000' }}>5.15%</b></div>
        </div>

        {/* NEW REQUIREMENT: AI Financial Insights & Security Hub Banner */}
        <div 
          onClick={onNavigateToAIInsights}
          style={{
            background: hasFraudAlert ? 'linear-gradient(135deg, #2a0b0b 0%, #111827 100%)' : 'linear-gradient(135deg, #111827 0%, #1e293b 100%)',
            borderRadius: '20px',
            border: hasFraudAlert ? '2px solid #ef4444' : '1px solid rgba(0, 240, 255, 0.4)',
            padding: '20px',
            marginBottom: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: hasFraudAlert ? '0 0 20px rgba(239, 68, 68, 0.6)' : '0 12px 30px rgba(0, 0, 0, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            animation: hasFraudAlert ? 'pulse-red 1.5s infinite' : 'none'
          }}
        >
          {/* Subtle background glow */}
          <style>{`
            @keyframes pulse-red {
              0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
              70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
              100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
            }
          `}</style>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: hasFraudAlert ? 'radial-gradient(circle, rgba(239,68,68,0.2) 0%, rgba(0,0,0,0) 70%)' : 'radial-gradient(circle, rgba(0,240,255,0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: hasFraudAlert ? 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)' : 'linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: hasFraudAlert ? '#fff' : '#000',
              boxShadow: hasFraudAlert ? '0 4px 15px rgba(239, 68, 68, 0.4)' : '0 4px 15px rgba(0, 240, 255, 0.4)'
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '15px', fontWeight: '800', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>
                  Smart Banking & AI Security
                </span>
                <span style={{ 
                  background: hasFraudAlert ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 240, 255, 0.15)', color: hasFraudAlert ? '#ef4444' : '#00f0ff', 
                  fontSize: '9px', fontWeight: '800', padding: '3px 6px', 
                  borderRadius: '6px', letterSpacing: '0.5px', textTransform: 'uppercase'
                }}>{hasFraudAlert ? 'ACTION REQUIRED' : 'AI Powered'}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.4' }}>
                Real-time fraud alerts, daily expense insights & waste tracking
              </div>
            </div>
          </div>
          <div style={{ 
            width: '32px', height: '32px', borderRadius: '50%', 
            background: 'rgba(255,255,255,0.1)', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', color: '#fff' 
          }}>
            <ChevronRight size={18} />
          </div>
        </div>

        {/* Feature Buttons: Saved Contacts & Transaction History */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <button 
            onClick={onNavigateToSavedContacts}
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
              <Globe size={20} />
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>Saved Contacts</div>
          </button>

          <button 
            onClick={onNavigateToTransactionHistory}
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <FileCheck size={20} />
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>Transaction History</div>
          </button>
        </div>

      </div>

      <UpiPinModal 
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={() => {
          setIsPinModalOpen(false);
          setShowBalance(true);
        }}
        transferData={{ action: 'check_balance' }}
      />
    </div>
    </div>
  );
};
