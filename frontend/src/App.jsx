/**
 * App.jsx (Frontend Main Application)
 * Logic Implemented:
 * Acts as the central hub of the React frontend. It manages the global state (user data, 
 * transactions, contacts), handles the routing logic to switch between tabs (Dashboard, AI, History), 
 * and orchestrates the presentation of UI modals.
 */
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Bot, Smartphone, Sparkles, Monitor, Phone, FileCheck, CheckCircle
} from 'lucide-react';
import { 
  INITIAL_CONTACTS, 
  MONTHLY_BUDGETS, 
  UPCOMING_SCHEDULED_BILLS,
  checkSessionValidity,
  logoutWebsiteSession,
  getUserTransactions,
  saveUserTransaction,
  addAdminRequest,
  updateUserInStore,
  wipeAllData,
  deleteWebsiteAccount,
  findUserByPhone
} from './data/mockData';
import { BankingAgentEngine } from './services/agentEngine';
import { BheeshmaBankingHome } from './components/BheeshmaBankingHome';
import { BheeshmaWelcomeAuth } from './components/BheeshmaWelcomeAuth';
import { BankingCopilot } from './components/BankingCopilot';

import { AIFinancialHub } from './components/AIFinancialHub';
import { QuickTransferModal } from './components/QuickTransferModal';
import { UpiPinModal } from './components/UpiPinModal';
import { TransactionSuccessModal } from './components/TransactionSuccessModal';
import { ScanPayModal } from './components/ScanPayModal';
import { AccountBalanceModal } from './components/AccountBalanceModal';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { MyAccountModal } from './components/MyAccountModal';
import { OpenBankAccountModal } from './components/OpenBankAccountModal';
import { CloseBankAccountModal } from './components/CloseBankAccountModal';
import { AdminDashboard } from './components/AdminDashboard';

import { SavedContactsPage } from './components/SavedContactsPage';
import { TransactionHistoryPage } from './components/TransactionHistoryPage';
import { WelcomeAnimationModal } from './components/WelcomeAnimationModal';
import { MyQRModal } from './components/MyQRModal';
import { TransactionLockModal } from './components/TransactionLockModal';
import { CommercialBookingsModal } from './components/CommercialBookingsModal';
import { NotificationModal } from './components/NotificationModal';
import { AddMoneyModal } from './components/AddMoneyModal';
import { ContactChatModal } from './components/ContactChatModal';
import { CredentialResetPopupModal } from './components/CredentialResetPopupModal';
import { ToastNotification } from './components/ToastNotification';
import { DepositApprovedModal } from './components/DepositApprovedModal';

export default function App() {
  const [sessionCheck, setSessionCheck] = useState({ isValid: false, user: null });
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [rawTransactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleClearAccountCreatedModal = async () => {
    if (user) {
      const updatedUser = { ...user, showAccountCreatedModal: false };
      await updateUserInStore(updatedUser);
      setUser(updatedUser);
    }
  };


  useEffect(() => {
    const initApp = async () => {
      const valid = await checkSessionValidity();
      setSessionCheck(valid);
      
      if (valid.isValid && valid.user) {
        setUser(valid.user);
        
        // Fetch contacts and transactions
        const [fetchedContacts, fetchedTxs] = await Promise.all([
           fetch(`http://127.0.0.1:5000/api/contacts?phone=${encodeURIComponent(valid.user.phone)}`).then(r => r.json()).catch(() => []),
           getUserTransactions(valid.user.phone)
        ]);
        
        setContacts(fetchedContacts || []);
        setTransactions(fetchedTxs || []);
      }
      setLoading(false);
    };
    initApp();

    const sessionInterval = setInterval(async () => {
      const valid = await checkSessionValidity();
      if (!valid.isValid && valid.reason === 'multi_device') {
        alert("Your account was logged into from another device. For security reasons, you have been logged out of this session.");
        window.location.reload();
      } else if (valid.isValid && valid.user) {
        setUser(valid.user);
        const [fetchedContacts, fetchedTxs] = await Promise.all([
           fetch(`http://127.0.0.1:5000/api/contacts?phone=${encodeURIComponent(valid.user.phone)}`).then(r => r.json()).catch(() => []),
           getUserTransactions(valid.user.phone)
        ]);
        if (fetchedTxs) {
          setTransactions(fetchedTxs);
        }
        if (fetchedContacts) {
          setContacts(fetchedContacts);
        }
      }
    }, 5000);

    return () => clearInterval(sessionInterval);
  }, []);

  const handleAddContact = async (newContact) => {
    if (user?.phone && newContact.phone === user.phone) {
      showToast("You cannot save your own account number as a contact.", "error");
      return;
    }
    await fetch('http://127.0.0.1:5000/api/contacts', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ phone: user.phone, contact: newContact })
    });
    setContacts(prev => [...prev, newContact]);
  };
  // Loading state handled at the bottom
  const transactions = useMemo(() => {
    return rawTransactions.map(tx => {
      if (tx.recipient?.phone) {
        const matchingContact = contacts.find(c => c.phone === tx.recipient.phone);
        if (matchingContact) {
          return { ...tx, title: `Transfer to ${matchingContact.name}` };
        }
      }
      return tx;
    });
  }, [rawTransactions, contacts]);

  const [budgets, setBudgets] = useState(MONTHLY_BUDGETS);
  const [bills] = useState(UPCOMING_SCHEDULED_BILLS);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Modal States for Requirement 3 (Open Bank Account) & Requirement 5 (Close Bank Account)
  const [isOpenBankModalOpen, setIsOpenBankModalOpen] = useState(false);
  const [isCloseBankModalOpen, setIsCloseBankModalOpen] = useState(false);

  // App Navigation & Layout Mode
  const [viewMode, setViewMode] = useState("desktop"); // 'phone' | 'desktop'
  const [activeTab, setActiveTab] = useState("home"); // 'home' | 'copilot' | 'loans'

  // Toast State
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Modal States
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferMode, setTransferMode] = useState("contact");
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pendingTransferData, setPendingTransferData] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [completedTransaction, setCompletedTransaction] = useState(null);
  const [isScanPayOpen, setIsScanPayOpen] = useState(false);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Neo-Banking Modal States
  const [isPayMobileOpen, setIsPayMobileOpen] = useState(false);
  const [isMyQROpen, setIsMyQROpen] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);

  const [isWelcomeAnimOpen, setIsWelcomeAnimOpen] = useState(false);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [activeChatContact, setActiveChatContact] = useState(null);
  const [quickTransferPrefill, setQuickTransferPrefill] = useState(null);
  
  const [engineVersion, setEngineVersion] = useState(0);

  // Copilot Chat State (Lifted from BankingCopilot to persist across tabs)
  const [copilotMessages, setCopilotMessages] = useState(() => [
    {
      id: "m_welcome",
      role: "assistant",
      content: `Hello! I am your **Autonomous Wealth & Banking Copilot**.\n\nYou can chat or speak with me to execute payments, query budgets, analyze expenses, or project your upcoming cash flow.\n\nTry one of the quick actions below to see autonomous agent tool-calling in action!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentSteps: [
        { agent: "Copilot", step: "System Initialization", detail: "Loaded financial ledger, contact graph, and spending rules." }
      ]
    }
  ]);

  // Initialize Agent Engine
  const agentEngine = useMemo(() => {
    void engineVersion;
    return new BankingAgentEngine(
      // State getter
      () => ({
        user: user || { name: 'Bheeshma Guest', phone: '', accounts: [] },
        contacts,
        transactions,
        budgets,
        bills
      }),
      // Execute Action Trigger
      (actionType, payload) => {
        if (actionType === "TRIGGER_PIN") {
          setPendingTransferData(payload);
          setIsPinModalOpen(true);
        }
      }
    );
  }, [user, contacts, transactions, budgets, bills, engineVersion]);

  // Handle Transfer Initiation
  const handleInitiateTransfer = async (transferData) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    // Always fetch fresh state to handle cross-tab admin unblocks smoothly
    const freshUser = await findUserByPhone(user.phone) || user;
    if (freshUser.accountStatus !== user.accountStatus || freshUser.pendingFraudAlert !== user.pendingFraudAlert) {
      setUser(freshUser); // Sync local state
    }

    if (freshUser.accountStatus === 'BLOCKED' || freshUser.pendingFraudAlert) {
      showToast(freshUser.pendingFraudAlert ? "Your account is locked due to a pending fraud verification. Please verify it in the AI Security tab." : "Your account has been blocked due to suspicious activity. Please wait for Admin verification.", "error");
      return;
    }

    if (transferData.recipient?.phone === freshUser.phone || transferData.recipient?.id === freshUser.phone) {
      showToast("You cannot send money to your own account.", "error");
      return;
    }

    const primaryAcc = (freshUser.accounts || []).find(a => a.isPrimary) || freshUser.accounts?.[0];
    if (!primaryAcc || primaryAcc.balance < parseFloat(transferData.amount || 0)) {
      showToast("Insufficient balance in your primary account.", "error");
      return;
    }

    setPendingTransferData(transferData);
    setIsPinModalOpen(true);
  };

  const executeTransfer = (amount, recipient, transferPayload) => {
    // 1. Deduct balance from primary bank account
    setUser(prevUser => {
      if (!prevUser) return prevUser;
      const updatedAccounts = (prevUser.accounts || []).map(acc => {
        if (acc.isPrimary) {
          return { ...acc, balance: Math.max(0, acc.balance - amount) };
        }
        return acc;
      });
      const updatedUser = { ...prevUser, accounts: updatedAccounts };
      try {
        localStorage.setItem("bheeshma_logged_in_user", JSON.stringify(updatedUser));
        updateUserInStore(updatedUser); 
      } catch (e) {
        console.warn("Could not sync user to storage", e);
      }
      return updatedUser;
    });

    setIsPinModalOpen(false);

    // 2. Create REAL transaction record
    const newTx = {
      id: `tx_${Date.now()}`,
      title: `Transfer to ${recipient.name}`,
      subtitle: transferPayload.note || "Transfer via Bheeshma Bank",
      upiId: recipient.upiId || `${recipient.name.toLowerCase().replace(/\s+/g, '')}@bheeshma`,
      type: "debit",
      category: transferPayload.note?.toLowerCase().includes("rent") ? "Rent & Housing" : "Personal Transfer",
      amount: amount,
      timestamp: new Date().toISOString(),
      status: "SUCCESS",
      refId: `BHEESHMA/TX/${Math.floor(10000000 + Math.random() * 90000000)}`,
      recipient,
      senderName: user?.name,
      senderPhone: user?.phone,
      recipientName: recipient.name,
      recipientPhone: recipient.phone
    };

    if (user?.phone) {
      newTx.userPhone = user.phone;
      saveUserTransaction(newTx);
    }
    
    // Process Receiver side asynchronously
    if (recipient?.phone) {
      (async () => {
        try {
          const receiver = await findUserByPhone(recipient.phone);
          if (receiver && receiver.accounts && receiver.accounts.length > 0) {
            // Update receiver balance
            const updatedAccounts = receiver.accounts.map(acc => {
              if (acc.isPrimary) {
                return { ...acc, balance: acc.balance + amount };
              }
              return acc;
            });
            await updateUserInStore({ ...receiver, accounts: updatedAccounts });
            
            // Record credit transaction for receiver
            const rxTx = {
              ...newTx,
              id: `tx_${Date.now()}_rx`,
              type: "credit",
              title: `Received from ${user?.name || 'Bheeshma User'}`,
              userPhone: recipient.phone
            };
            await saveUserTransaction(rxTx);
          }
        } catch (e) {
          console.error("Failed to process receiver side", e);
        }
      })();
    }
    setTransactions(prev => [newTx, ...prev]);

    // 3. Update budget if category matches
    if (newTx.category in budgets) {
      setBudgets(prev => ({
        ...prev,
        [newTx.category]: {
          ...prev[newTx.category],
          spent: prev[newTx.category].spent + amount
        }
      }));
    }

    // 4. Wipe MPIN if triggered by security fallback
    if (transferPayload.triggerMpinWipe && user?.phone) {
      wipeMpinData(user.phone);
      updateUserInStore(user.phone, { voiceAuthFailures: 0 });
      setUser(prev => prev ? { ...prev, voiceAuthFailures: 0 } : prev);
    }

    // 5. Show success modal with confetti and chime
    setCompletedTransaction(newTx);
    setIsSuccessModalOpen(true);
  };

  // Handle UPI PIN Verified -> Execute Transaction
  const handlePinSuccess = async (transferPayload) => {
    const amount = parseFloat(transferPayload.amount);
    const recipient = transferPayload.recipient;

    const currentHour = new Date().getHours();
    const isLateNight = currentHour < 6 || currentHour >= 22;
    const isSuspiciousAmount = isLateNight ? amount >= 50000 : amount >= 100000;

    if (isSuspiciousAmount) {
      const apiKey = localStorage.getItem("bheeshma_gemini_api_key") || "";
      if (apiKey && user) {
        try {
          const res = await fetch("http://localhost:5000/api/fraud-check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              apiKey,
              transaction: { amount, recipient: recipient.name, category: transferPayload.note || "Transfer" },
              userContext: {
                name: user.name,
                current_time: new Date().toLocaleTimeString(),
                recent_tx_str: transactions.slice(0, 5).map(t => `${t.amount} to ${t.title}`).join(", ")
              }
            })
          });
          
          if (res.ok) {
            const fraudAnalysis = await res.json();
            if (fraudAnalysis.status === "HIGH" || fraudAnalysis.status === "MEDIUM") {
              const newAlert = {
                id: `fraud_${Date.now()}`,
                amount,
                recipient: recipient.name,
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString(),
                reason: fraudAnalysis.reasoning,
                status: 'ACTION_REQUIRED',
                transferPayload
              };
              const updatedUser = { 
                ...user, 
                pendingFraudAlert: newAlert,
                fraudHistory: [...(user.fraudHistory || []), newAlert]
              };
              setIsPinModalOpen(false);
              setUser(updatedUser);
              updateUserInStore(updatedUser);
              showToast("🚨 AI SECURITY ALERT: Transaction paused due to suspicious activity.", "warning");
              setActiveTab("ai-insights");
              return; 
            }
          }
        } catch (e) {
          console.warn("AI Fraud Agent unavailable, falling back.", e);
        }
      } 
      
      // Fallback if no API key or API failed
      const newAlert = {
        id: `fraud_${Date.now()}`,
        amount,
        recipient: recipient.name,
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
        reason: `Unusual transaction of ₹${amount} detected.`,
        status: 'ACTION_REQUIRED',
        transferPayload
      };
      const updatedUser = { 
        ...user, 
        pendingFraudAlert: newAlert,
        fraudHistory: [...(user.fraudHistory || []), newAlert]
      };
      setIsPinModalOpen(false);
      setUser(updatedUser);
      updateUserInStore(updatedUser);
      showToast("🚨 AI SECURITY ALERT: Transaction paused due to suspicious activity.", "warning");
      setActiveTab("ai-insights");
      return;
    }

    // Execute directly if not suspicious or if AI deemed safe
    executeTransfer(amount, recipient, transferPayload);
  };

  const handleResolveFraud = (isMyConcern) => {
    if (!user || !user.pendingFraudAlert) return;
    
    const alertData = user.pendingFraudAlert;
    
    if (isMyConcern) {
      const updatedUser = { ...user, pendingFraudAlert: null };
      setUser(updatedUser);
      updateUserInStore(updatedUser);
      showToast("Verification successful. Resuming transaction...", "success");
      
      if (alertData.transferPayload) {
        executeTransfer(alertData.amount, alertData.transferPayload.recipient, alertData.transferPayload);
      }
    } else {
      const updatedUser = { ...user, pendingFraudAlert: null, accountStatus: 'BLOCKED' };
      setUser(updatedUser);
      updateUserInStore(updatedUser);
      
      addAdminRequest({
        id: `req_${Date.now()}`,
        type: 'FRAUD_DETECTED',
        userPhone: user.phone,
        userName: user.name,
        data: { 
          amount: alertData.amount, 
          time: alertData.time, 
          recipient: alertData.recipient, 
          reason: alertData.reason 
        },
        timestamp: new Date().toISOString(),
        status: 'PENDING'
      });
      showToast("Your account has been blocked for your safety. Details have been sent to the Admin for investigation.", "error");
    }
  };



  // Requirement 3: Bank Account Opening Handler
  const handleBankAccountOpened = async (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("bheeshma_logged_in_user", JSON.stringify(updatedUser));
    setTransactions(await getUserTransactions(updatedUser.phone));
    setIsOpenBankModalOpen(false);
  };

  // Requirement 5: Bank Account Deletion Handler
  const handleBankAccountDeleted = async (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("bheeshma_logged_in_user", JSON.stringify(updatedUser));
    setTransactions(await getUserTransactions(updatedUser.phone));
    setIsCloseBankModalOpen(false);
  };

  // Requirement 5: Website-only Logout Handler
  const handleWebsiteLogout = () => {
    logoutWebsiteSession();
    setUser(null);
    setTransactions([]);
    setIsAuthModalOpen(true);
    setCopilotMessages([
      {
        id: "m_welcome",
        role: "assistant",
        content: `Hello! I am your **Autonomous Wealth & Banking Copilot**.\n\nYou can chat or speak with me to execute payments, query budgets, analyze expenses, or project your upcoming cash flow.\n\nTry one of the quick actions below to see autonomous agent tool-calling in action!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentSteps: [
          { agent: "Copilot", step: "System Initialization", detail: "Loaded financial ledger, contact graph, and spending rules." }
        ]
      }
    ]);
  };

  const handleDeleteWebsiteAccount = () => {
    if (window.confirm("Are you sure you want to permanently delete your Bheeshma Bank website account? This action cannot be undone.")) {
      deleteWebsiteAccount(user.phone);
      setUser(null);
      setTransactions([]);
      setIsAuthModalOpen(true);
    }
  };

  if (user?.role === 'ADMIN') {
    return <AdminDashboard onLogout={handleWebsiteLogout} />;
  }

  // If no user is logged in, show the Corporate Auth Screen
  if (!user) {
    return (
      <BheeshmaWelcomeAuth 
        currentLoggedInUser={user}
        sessionExpiredNotice={sessionCheck?.reason === "EXPIRED" ? { phone: sessionCheck.phone } : null}
        onCancel={() => {}} // Root level, no cancel
        onLoginSuccess={async (authedUser) => {
          setUser(authedUser);
          localStorage.setItem("bheeshma_logged_in_user", JSON.stringify(authedUser));
          setTransactions(await getUserTransactions(authedUser.phone));
          
          const fetchedContacts = await fetch(`http://127.0.0.1:5000/api/contacts?phone=${authedUser.phone}`).then(r => r.json()).catch(() => []);
          setContacts(fetchedContacts || []);
          
          setIsAuthModalOpen(false);
        }}
      />
    );
  }

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-[#09090b] text-white">Loading Bheeshma Bank...</div>;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f4f6f8', color: '#111827' }}>
      <ToastNotification message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      {/* Top Global Navigation Bar */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '12px 24px'
      }}>
        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab("home")}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '13px',
              background: '#2b3a42',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}>
              <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Gold Flourish Background */}
                <path d="M10 80 Q 25 70, 50 85 Q 75 70, 90 80 Q 85 95, 50 90 Q 15 95, 10 80" fill="#cda45e" />
                <path d="M20 60 Q 10 40, 25 50 Q 30 70, 20 60" fill="#cda45e" />
                <path d="M80 60 Q 90 40, 75 50 Q 70 70, 80 60" fill="#cda45e" />
                {/* Center Pillar */}
                <rect x="44" y="20" width="12" height="50" fill="#ffffff" />
                <rect x="42" y="15" width="16" height="5" fill="#ffffff" />
                <rect x="42" y="70" width="16" height="5" fill="#ffffff" />
                {/* Left Pillar */}
                <rect x="24" y="30" width="10" height="40" fill="#ffffff" />
                <rect x="22" y="25" width="14" height="5" fill="#ffffff" />
                <rect x="22" y="70" width="14" height="5" fill="#ffffff" />
                {/* Right Pillar */}
                <rect x="66" y="30" width="10" height="40" fill="#ffffff" />
                <rect x="64" y="25" width="14" height="5" fill="#ffffff" />
                <rect x="64" y="70" width="14" height="5" fill="#ffffff" />
              </svg>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '19px', fontWeight: '700', fontFamily: 'Inter, sans-serif', color: '#111827', letterSpacing: '-0.5px' }}>
                  Bheeshma Bank
                </span>
                <span style={{
                  fontSize: '9px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: '#f3f4f6',
                  color: '#4b5563',
                  letterSpacing: '0.8px',
                  border: '1px solid #e5e7eb'
                }}>
                  AUTONOMOUS BANKING
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>
                Autonomous Financial Operating System & Multi-Agent Engine
              </div>
            </div>
          </div>

          {/* Navigation Pill Tabs */}
          <nav style={{
            display: 'flex',
            background: '#f9fafb',
            padding: '4px',
            borderRadius: '14px',
            border: '1px solid #e5e7eb'
          }}>
            <button
              onClick={() => setActiveTab("home")}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'home' ? '#ffffff' : 'transparent',
                color: activeTab === 'home' ? '#111827' : '#6b7280',
                boxShadow: activeTab === 'home' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Smartphone size={16} />
              <span>Bheeshma Bank</span>
            </button>

            <button
              onClick={() => setActiveTab(activeTab === "copilot" ? "home" : "copilot")}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'copilot' ? '#ffffff' : 'transparent',
                color: activeTab === 'copilot' ? '#111827' : '#6b7280',
                boxShadow: activeTab === 'copilot' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Bot size={16} />
              <span>{activeTab === "copilot" ? "Close Copilot" : "Bheeshma AI"}</span>
            </button>


          </nav>

          {/* Right Action Icons & View Mode */}
          <div className="right-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* User Account Controls */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 12px',
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                  background: '#f9fafb',
                  color: '#111827',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  <img src={user.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=Bheeshma"} alt={user.name} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                  <span style={{ maxWidth: '85px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={handleWebsiteLogout}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    background: '#ffffff',
                    color: '#111827',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
                <button
                  onClick={handleDeleteWebsiteAccount}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #ef4444',
                    background: '#fef2f2',
                    color: '#ef4444',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Delete Account
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(0, 240, 255, 0.4)',
                  background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(59, 130, 246, 0.2))',
                  color: '#00f0ff',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Body Layout */}
      <main style={{ flex: 1, padding: '24px 16px' }}>
        {/* DESKTOP DUAL DASHBOARD VIEW (Displays BheeshmaPay + Copilot + Quick Loans Side-by-Side) */}
        {viewMode === "desktop" ? (
          <div className={activeTab === 'copilot' ? 'app-grid-container with-copilot' : 'app-grid-container'} style={{
            maxWidth: '1360px',
            margin: '0 auto',
            alignItems: 'start'
          }}>
            {/* Left or Main Content */}
            {activeTab === 'ai-insights' ? (
              <AIFinancialHub user={user} transactions={transactions} onBack={() => setActiveTab("home")} onResolveFraud={handleResolveFraud} showToast={showToast} />
            ) : activeTab === 'saved-contacts' ? (
              <SavedContactsPage 
                contacts={contacts}
                onAddContact={handleAddContact}
                onBack={() => setActiveTab('home')}
                onSelectContact={(c) => setActiveChatContact(c)}
                currentUser={user}
              />
            ) : activeTab === 'tx-history' ? (
              <TransactionHistoryPage 
                transactions={transactions}
                onBack={() => setActiveTab('home')}
                onSelectContactToPay={(c) => {
                  handleInitiateTransfer({
                    recipient: c,
                    amount: c.recentAmount || 50,
                    note: `Payment to ${c.name}`
                  });
                }}
              />
            ) : (
              <>
                {/* Left Column: Bheeshma Bank Interactive UI */}
                <div style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}>
                  <BheeshmaBankingHome 
                    user={user}
                    transactions={transactions}
                    contacts={contacts}
                    onOpenTransferModal={(mode) => {
                      setTransferMode(mode);
                      setIsTransferModalOpen(true);
                    }}
                    onOpenScanPay={() => setIsScanPayOpen(true)}
                    onOpenCheckBalance={() => setIsBalanceModalOpen(true)}
                    onOpenPayMobile={() => setIsPayMobileOpen(true)}
                    onOpenMyQR={() => setIsMyQROpen(true)}
                    onToggleLock={() => setIsLockModalOpen(true)}
                    onOpenBookings={() => setIsBookingsOpen(true)}

                    onSelectContactToPay={(c) => {
                      handleInitiateTransfer({
                        recipient: c,
                        amount: c.recentAmount || 50,
                        note: `Payment to ${c.name}`
                      });
                    }}
                    onOpenContactChat={(c) => setActiveChatContact(c)}
                    onNavigateToSavedContacts={() => setActiveTab("saved-contacts")}
                    onNavigateToTransactionHistory={() => setActiveTab("tx-history")}
                    onNavigateToCopilot={() => setActiveTab("copilot")}
                    onNavigateToLoans={() => setActiveTab("loans")}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                    onOpenAuthModal={() => setIsAuthModalOpen(true)}
                    onOpenOpenBankAccount={() => setIsOpenBankModalOpen(true)}
                    onOpenCloseBankAccount={() => setIsCloseBankModalOpen(true)}
                    onLogoutWebsite={handleWebsiteLogout}
                    onOpenAddMoney={() => setIsAddMoneyOpen(true)}
                    onNavigateToAIInsights={() => setActiveTab("ai-insights")}
                    onClearAccountCreatedModal={handleClearAccountCreatedModal}
                  />
                </div>

                {/* Right Column: Autonomous Wealth Copilot side-by-side */}
                {activeTab === 'copilot' && (
                  <div style={{
                    height: '840px',
                    position: 'sticky',
                    top: '90px'
                  }}>
                    <BankingCopilot 
                      agentEngine={agentEngine}
                      user={user}
                      messages={copilotMessages}
                      setMessages={setCopilotMessages}
                      onTriggerUpiPin={(payload) => {
                        setPendingTransferData(payload);
                        setIsPinModalOpen(true);
                      }}
                      onExecuteVoiceTransfer={(payload) => {
                        setPendingTransferData(payload);
                        // Using setTimeout to allow state update before processing
                        setTimeout(() => handlePinSuccess(), 100);
                      }}
                      onVoiceFailure={() => {
                        if (user) {
                          const newCount = (user.voiceAuthFailures || 0) + 1;
                          updateUserInStore(user.phone, { voiceAuthFailures: newCount });
                          setUser({ ...user, voiceAuthFailures: newCount });
                        }
                      }}
                    />
                  </div>
                )}

              </>
            )}
          </div>
        ) : (
          /* MOBILE PHONE FRAME VIEW (Sleek Phone Frame Mockup) */
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 40px' }}>
            <div className="phone-viewport-container">
              {/* Dynamic Island Notch */}
              <div className="phone-notch">
                <div className="phone-sensor" />
                <div className="phone-camera" />
              </div>

              {/* Inside Phone Screen Content */}
              <div style={{ flex: 1, overflowY: 'auto', paddingTop: '36px' }}>
                {activeTab === 'home' && (
                  <BheeshmaBankingHome 
                    user={user}
                    transactions={transactions}
                    contacts={contacts}
                    onOpenTransferModal={(mode) => {
                      setTransferMode(mode);
                      setIsTransferModalOpen(true);
                    }}
                    onOpenScanPay={() => setIsScanPayOpen(true)}
                    onOpenCheckBalance={() => setIsBalanceModalOpen(true)}
                    onSelectContactToPay={(c) => {
                      handleInitiateTransfer({
                        recipient: c,
                        amount: c.recentAmount || 50,
                        note: `Payment to ${c.name}`
                      });
                    }}
                    onOpenContactChat={(c) => setActiveChatContact(c)}
                    onNavigateToSavedContacts={() => setActiveTab("saved-contacts")}
                    onNavigateToTransactionHistory={() => setActiveTab("tx-history")}
                    onNavigateToCopilot={() => setActiveTab("copilot")}
                    onNavigateToLoans={() => setActiveTab("loans")}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                    onOpenAuthModal={() => setIsAuthModalOpen(true)}
                    onOpenOpenBankAccount={() => setIsOpenBankModalOpen(true)}
                    onOpenCloseBankAccount={() => setIsCloseBankModalOpen(true)}
                    onLogoutWebsite={handleWebsiteLogout}
                    onOpenAddMoney={() => setIsAddMoneyOpen(true)}
                    onNavigateToAIInsights={() => setActiveTab("ai-insights")}
                    onClearAccountCreatedModal={handleClearAccountCreatedModal}
                  />
                )}

                {activeTab === 'copilot' && (
                  <div style={{ height: '780px' }}>
                    <BankingCopilot 
                      agentEngine={agentEngine}
                      messages={copilotMessages}
                      setMessages={setCopilotMessages}
                      onTriggerUpiPin={(payload) => {
                        setPendingTransferData(payload);
                        setIsPinModalOpen(true);
                      }}
                    />
                  </div>
                )}

                {activeTab === 'ai-insights' && (
                  <div style={{ paddingBottom: '40px' }}>
                    <AIFinancialHub user={user} transactions={transactions} onBack={() => setActiveTab("home")} onResolveFraud={handleResolveFraud} showToast={showToast} />
                  </div>
                )}



                {activeTab === 'saved-contacts' && (
                  <div style={{ height: '100%' }}>
                    <SavedContactsPage 
                      contacts={contacts}
                      onAddContact={handleAddContact}
                      onBack={() => setActiveTab('home')}
                      onSelectContact={(c) => setActiveChatContact(c)}
                      currentUser={user}
                    />
                  </div>
                )}

                {activeTab === 'tx-history' && (
                  <div style={{ height: '100%' }}>
                    <TransactionHistoryPage 
                      transactions={transactions}
                      onBack={() => setActiveTab('home')}
                      onSelectContactToPay={(c) => {
                        handleInitiateTransfer({
                          recipient: c,
                          amount: c.recentAmount || 50,
                          note: `Payment to ${c.name}`
                        });
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Phone Bottom Navigation Bar */}
              <div style={{
                height: '62px',
                background: '#ffffff',
                borderTop: '1px solid #e5e7eb',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                alignItems: 'center',
                textAlign: 'center',
                zIndex: 40
              }}>
                <button
                  onClick={() => setActiveTab("home")}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: activeTab === 'home' ? '#000000' : '#9ca3af',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <Smartphone size={20} />
                  <span style={{ fontSize: '10px', fontWeight: '600' }}>Banking</span>
                </button>

                <button
                  onClick={() => setActiveTab("copilot")}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: activeTab === 'copilot' ? '#000000' : '#9ca3af',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <Bot size={20} />
                  <span style={{ fontSize: '10px', fontWeight: '600' }}>AI Copilot</span>
                </button>


              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Modals */}
      <QuickTransferModal 
        isOpen={isTransferModalOpen}
        onClose={() => {
          setIsTransferModalOpen(false);
          setQuickTransferPrefill(null);
        }}
        onInitiateTransfer={handleInitiateTransfer}
        contacts={contacts}
        mode={transferMode}
        prefilledRecipient={quickTransferPrefill}
      />

      <UpiPinModal 
        isOpen={isPinModalOpen}
        user={user}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinSuccess}
        transferData={pendingTransferData}
      />

      <TransactionSuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        transaction={completedTransaction}
      />

      <AddMoneyModal 
        isOpen={isAddMoneyOpen}
        onClose={() => setIsAddMoneyOpen(false)}
        user={user}
        onSuccess={() => {
          setIsAddMoneyOpen(false);
        }}
      />

      <ScanPayModal 
        isOpen={isScanPayOpen}
        onClose={() => setIsScanPayOpen(false)}
        user={user}
        onSimulateMerchantScan={(scanPayload) => {
          if (!scanPayload.amount) {
            setQuickTransferPrefill(scanPayload.recipient);
            setTransferMode("upi");
            setIsTransferModalOpen(true);
          } else {
            handleInitiateTransfer(scanPayload);
          }
        }}
      />

      <AccountBalanceModal 
        isOpen={isBalanceModalOpen}
        onClose={() => setIsBalanceModalOpen(false)}
        user={user}
      />

      {/* Account Approved Notification Modal */}
      {user?.showAccountCreatedModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: '#fff', width: '100%', maxWidth: '400px', borderRadius: '24px', padding: '24px',
            textAlign: 'center', animation: 'slideUp 0.3s ease-out', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ width: '64px', height: '64px', background: '#d1fae5', borderRadius: '32px', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={32} color="#10b981" />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>Request Accepted!</h2>
            <p style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.5', marginBottom: '24px' }}>
              Congratulations! Your request to open a bank account has been approved by the admin. Your account is now fully active.
            </p>
            <button 
              onClick={handleClearAccountCreatedModal}
              style={{
                width: '100%', padding: '16px', background: '#111827', color: '#fff',
                border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: '700', cursor: 'pointer'
              }}
            >
              Awesome, let's go!
            </button>
          </div>
        </div>
      )}

      {/* Requirement 3: Verified Bank Account Opening Modal */}
      <OpenBankAccountModal 
        isOpen={isOpenBankModalOpen}
        onClose={() => setIsOpenBankModalOpen(false)}
        user={user}
        onAccountOpened={handleBankAccountOpened}
      />

      {/* Requirement 5: Verified Bank Account Deletion Modal */}
      <CloseBankAccountModal 
        isOpen={isCloseBankModalOpen}
        onClose={() => setIsCloseBankModalOpen(false)}
        user={user}
        onAccountDeleted={handleBankAccountDeleted}
      />


      {/* Neo-Banking Modals */}
      <WelcomeAnimationModal
        isOpen={isWelcomeAnimOpen}
        onClose={() => setIsWelcomeAnimOpen(false)}
      />

      <MyQRModal
        isOpen={isMyQROpen}
        onClose={() => setIsMyQROpen(false)}
        user={user}
      />

      <TransactionLockModal
        isOpen={isLockModalOpen}
        onClose={() => setIsLockModalOpen(false)}
        user={user}
        onStatusChanged={setUser}
      />

      <CommercialBookingsModal
        isOpen={isBookingsOpen}
        onClose={() => setIsBookingsOpen(false)}
        onSelectBooking={(opt) => {
          setIsBookingsOpen(false);
          handleInitiateTransfer({
            recipient: { name: opt.title, phone: 'BILLER', upiId: `booking@${opt.id}`, avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Booking' },
            amount: 100,
            note: `Payment for ${opt.title}`
          });
        }}
      />



      <NotificationModal 
        user={user} 
        onUserUpdated={setUser} 
      />



      <MyAccountModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onUserUpdated={(u) => {
          setUser(u);
          updateUserInStore(u);
        }}
      />

      <CredentialResetPopupModal 
        user={user}
        onUserUpdated={(u) => {
          setUser(u);
          updateUserInStore(u);
        }}
      />

      <ContactChatModal 
        isOpen={!!activeChatContact}
        onClose={() => setActiveChatContact(null)}
        contact={activeChatContact}
        currentUser={user}
        onSuccessPayment={(paymentDetails) => {
          handleInitiateTransfer(paymentDetails);
        }}
      />
      
      <DepositApprovedModal
        isOpen={!!(user && user.pendingDepositAlert)}
        amount={user?.pendingDepositAlert || 0}
        onClose={async () => {
          if (user) {
            const updatedUser = { ...user };
            delete updatedUser.pendingDepositAlert;
            await updateUserInStore(updatedUser);
            setUser(updatedUser);
          }
        }}
      />
    </div>
  );
}
