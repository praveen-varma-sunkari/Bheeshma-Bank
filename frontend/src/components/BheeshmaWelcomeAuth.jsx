import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Smartphone, CheckCircle2, 
  AlertCircle, ArrowRight, ArrowLeft, Sparkles, User, Mail, 
  RefreshCw, KeyRound, Eye, EyeOff, Lock
} from 'lucide-react';
import { 
  findUserByPhone, registerUserInStore, normalizePhone, 
  createWebsiteSession, addAdminRequest, getAdminRequests, updateUserInStore, getStoredUsers 
} from '../data/mockData';

export const BheeshmaWelcomeAuth = ({ onLoginSuccess, currentLoggedInUser, onCancel, sessionExpiredNotice }) => {
  const [stage, setStage] = useState(sessionExpiredNotice ? 'phone_lookup' : 'welcome');
  
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState(sessionExpiredNotice?.phone || '');
  const [isSearchingPhone, setIsSearchingPhone] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [phoneLookupError, setPhoneLookupError] = useState('');

  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [resetRequestId, setResetRequestId] = useState(null);
  const [resetPinInput, setResetPinInput] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formTouched, setFormTouched] = useState({});
  const [regError, setRegError] = useState('');

  const checks = {
    fullName: {
      isValid: formData.fullName.trim().split(' ').length >= 2 && formData.fullName.length >= 4,
      message: formData.fullName.trim().split(' ').length >= 2 ? "Verified legal name format" : "Please enter first and last name"
    },
    email: {
      isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      message: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? "Valid email domain format" : "Enter a valid personal or enterprise email"
    },
    password: {
      isValid: formData.newPassword.length >= 6,
      message: formData.newPassword.length >= 6 ? "Strong cryptographic key" : "Must be at least 6 characters"
    },
    confirmPassword: {
      isValid: formData.confirmPassword.length >= 6 && formData.confirmPassword === formData.newPassword,
      message: formData.confirmPassword === formData.newPassword && formData.confirmPassword.length >= 6 ? "Passwords match" : "Passwords must match"
    }
  };

  const isFormFullyValid = checks.fullName.isValid && checks.email.isValid && checks.password.isValid && checks.confirmPassword.isValid;

  useEffect(() => {
    if (stage === 'forgot_password' && resetRequestId && !resetPinInput) {
      const interval = setInterval(async () => {
        const reqs = await getAdminRequests();
        const myReq = reqs.find(r => r.id === resetRequestId);
        if (myReq && myReq.status === 'PIN_GENERATED' && myReq.generatedPin) {
          setResetPinInput(myReq.generatedPin);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [stage, resetRequestId, resetPinInput]);

  const handleCheckPhoneNumber = (e) => {
    if (e) e.preventDefault();
    const rawNumber = `${countryCode} ${phoneNumber}`.trim();
    const cleanDigits = normalizePhone(rawNumber);

    if (cleanDigits.length < 7) {
      setPhoneLookupError("Please enter a valid phone number.");
      return;
    }

    setPhoneLookupError('');
    setIsSearchingPhone(true);

    setTimeout(async () => {
      setIsSearchingPhone(false);
      const user = await findUserByPhone(rawNumber);
      if (user) {
        if (user.accountStatus === 'DELETED') {
          setPhoneLookupError("your account was permanently deleted by the bheeshma authorities. for any queries reach nearest bheeshma bank");
          return;
        }
        setMatchedUser(user);
        setPasswordInput('');
        setLoginError('');
        setStage('enter_password');
      } else {
        setMatchedUser(null);
        setFormData({ fullName: '', email: '', newPassword: '', confirmPassword: '' });
        setRegError('');
        setStage('create_profile');
      }
    }, 600);
  };

  const handlePasswordSubmit = (e) => {
    if (e) e.preventDefault();
    if (!passwordInput.trim()) {
      setLoginError("Please enter your password");
      return;
    }

    setIsAuthenticating(true);
    setLoginError('');

    setTimeout(() => {
      setIsAuthenticating(false);
      if (passwordInput === matchedUser.password) {
        if (matchedUser.sessionId && matchedUser.sessionId !== "null") {
          setStage('multi_device_prompt');
        } else {
          createWebsiteSession(matchedUser);
          onLoginSuccess(matchedUser);
        }
      } else {
        setLoginError("Incorrect password. Please verify and try again.");
      }
    }, 500);
  };

  const handleForgotPassword = async () => {
    const reqs = await getAdminRequests();
    const existingReq = reqs.find(r => r.type === 'FORGOT_CREDENTIALS' && r.userPhone === matchedUser.phone && (r.status === 'PENDING' || (r.status === 'PIN_GENERATED' && r.expiresAt > Date.now())));
    
    if (existingReq) {
      setResetRequestId(existingReq.id);
      setStage('forgot_password');
      setResetError('');
      setResetSuccess('');
      setResetPinInput(existingReq.generatedPin || '');
      return;
    }

    const req = {
      id: `req_${Date.now()}`,
      type: 'FORGOT_CREDENTIALS',
      userPhone: matchedUser.phone,
      userName: matchedUser.name,
      data: { type: 'Password' },
      timestamp: new Date().toISOString(),
      status: 'PENDING'
    };
    await addAdminRequest(req);
    setResetRequestId(req.id);
    setStage('forgot_password');
    setResetError('');
    setResetSuccess('');
  };

  const handleResetPasswordSubmit = async (e) => {
    if (e) e.preventDefault();
    setResetError('');
    const reqs = await getAdminRequests();
    const req = reqs.find(r => r.id === resetRequestId);
    
    if (!req) return setResetError("Request not found.");
    if (req.status !== 'PIN_GENERATED') return setResetError("Admin has not generated the PIN yet. Please wait.");
    if (Date.now() > req.expiresAt) return setResetError("PIN has expired (10 minutes limit).");
    if (req.generatedPin !== resetPinInput) return setResetError("Invalid PIN.");
    if (newResetPassword.length < 6) return setResetError("New password must be at least 6 characters.");

    if (req.data.type === 'MPIN') {
        await updateUserInStore({ ...matchedUser, mpin: newResetPassword });
        setResetSuccess("MPIN reset successfully. You can now use your new MPIN.");
    } else {
        await updateUserInStore({ ...matchedUser, password: newResetPassword });
        setResetSuccess("Password reset successfully. You can now log in.");
    }
    
    setTimeout(() => setStage('enter_password'), 2000);
  };

  const handleCreateProfileSubmit = async (e) => {
    e.preventDefault();
    setFormTouched({ fullName: true, email: true, newPassword: true, confirmPassword: true });
    
    if (!isFormFullyValid) {
      setRegError("Please resolve the errors above before continuing.");
      return;
    }
    
    setRegError('');
    setIsAuthenticating(true);

    const allUsers = await getStoredUsers();
    
    const emailExists = allUsers.some(u => u.email && u.email.toLowerCase() === formData.email.trim().toLowerCase());
    if (emailExists) {
        setRegError("Email already exists. Please provide a different email.");
        setIsAuthenticating(false);
        return;
    }

    const passwordExists = allUsers.some(u => u.password === formData.newPassword);
    if (passwordExists) {
        setRegError("Password already exists. Please choose a different password.");
        setIsAuthenticating(false);
        return;
    }

    await new Promise(r => setTimeout(r, 1500));
    const rawNumber = `${countryCode} ${phoneNumber}`.trim();
    const newUserId = `u_${Date.now()}`;
    const newUser = {
      id: newUserId,
      phone: rawNumber,
      normalizedPhone: normalizePhone(rawNumber),
      name: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.newPassword,
      role: "USER",
      hasBankAccount: false,
      accountStatus: "ACTIVE",
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formData.fullName.trim())}`,
      createdAt: new Date().toISOString(),
      currency: "INR",
      tier: "BHEESHMA STANDARD"
    };

    await registerUserInStore(newUser);
    createWebsiteSession(newUser);
    setIsAuthenticating(false);
    onLoginSuccess(newUser);
  };

  // Modern Blue Theme Input Style
  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #7c93b6',
    borderRadius: '24px',
    outline: 'none',
    fontSize: '14px',
    color: '#000000',
    background: 'transparent',
    marginTop: '6px'
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: '500',
    color: '#1f2937',
    display: 'block'
  };

  const btnPrimary = {
    background: '#000000',
    color: '#ffffff',
    border: 'none',
    padding: '12px 32px',
    borderRadius: '999px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    letterSpacing: '1px',
    marginTop: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  const btnSecondary = {
    ...btnPrimary,
    background: 'transparent',
    color: '#000000',
    border: '1px solid #000000',
    marginTop: '12px'
  };

  return (
    <div className="welcome-auth-container" style={{ zIndex: 9999 }}>
      <style>
        {`
          .welcome-auth-container {
            position: fixed;
            inset: 0;
            display: flex;
            font-family: 'Inter', sans-serif;
            background: url("/namaste_couple.jpg") no-repeat center center;
            background-size: cover;
            background-color: #e6f0f9;
            overflow-y: auto;
          }
          .welcome-content-wrapper {
            display: flex;
            width: 100%;
            height: 100%;
            padding: 40px;
            box-sizing: border-box;
          }
          .left-section {
            flex: 1;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .logo-area {
            display: flex;
            align-items: center;
            gap: 16px;
          }
          .features-panel {
            background: #1e293b;
            border-radius: 16px;
            padding: 32px 24px;
            color: #fff;
            display: flex;
            flex-direction: column;
            gap: 32px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            width: max-content;
            margin-top: auto;
            margin-bottom: auto;
          }
          .right-section {
            width: 500px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .auth-card {
            width: 100%;
            background: #ffffff;
            border-radius: 32px;
            box-shadow: 0 24px 60px rgba(0,0,0,0.15);
            overflow: hidden;
            position: relative;
            display: flex;
            flex-direction: column;
            max-height: 90vh;
          }
          
          @media (max-width: 1024px) {
            .welcome-content-wrapper {
              flex-direction: column;
              padding: 24px;
              gap: 40px;
            }
            .left-section {
              flex: none;
              align-items: center;
              text-align: center;
            }
            .features-panel {
              display: none; /* Hide features panel on small screens to save space */
            }
            .right-section {
              width: 100%;
              max-width: 500px;
              margin: 0 auto;
            }
            .auth-card {
              max-height: none;
            }
          }
        `}
      </style>

      <div className="welcome-content-wrapper">
        {/* Left Side Logo & Features */}
        <div className="left-section">
          {/* Top Left Logo Area */}
          <div className="logo-area">
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #0d47a1, #1976d2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(13, 71, 161, 0.3)',
              position: 'relative', overflow: 'hidden'
            }}>
              {/* Orbit */}
              <svg style={{ position: 'absolute', width: '100%', height: '100%' }} viewBox="0 0 100 100">
                <ellipse cx="50" cy="50" rx="35" ry="15" transform="rotate(-30 50 50)" fill="none" stroke="#60a5fa" strokeWidth="3" />
                <circle cx="20" cy="30" r="3" fill="#60a5fa" />
                <circle cx="80" cy="70" r="2" fill="#60a5fa" />
              </svg>
              {/* B with Pillars */}
              <svg width="40" height="40" viewBox="0 0 100 100" style={{ zIndex: 1 }}>
                <text x="30" y="60" fill="#ffffff" fontSize="48" fontWeight="900" fontStyle="italic" fontFamily="Inter, sans-serif">B</text>
                {/* Mini Bank Icon overlapping */}
                <g transform="translate(45, 55) scale(0.4)">
                  <rect x="10" y="0" width="80" height="15" fill="#ffffff" rx="4" />
                  <polygon points="50,-15 0,0 100,0" fill="#ffffff" />
                  <rect x="20" y="20" width="10" height="40" fill="#ffffff" />
                  <rect x="45" y="20" width="10" height="40" fill="#ffffff" />
                  <rect x="70" y="20" width="10" height="40" fill="#ffffff" />
                  <rect x="5" y="65" width="90" height="15" fill="#ffffff" rx="4" />
                </g>
              </svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <h1 style={{ margin: 0, fontSize: '36px', fontWeight: 800, color: '#0d3b66', letterSpacing: '-1px', lineHeight: 1 }}>Bheeshma<br/>Bank</h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#0d3b66', fontWeight: 600 }}>Autonomous Banking & Multi-Agent Engine</p>
            </div>
          </div>

          {/* Floating Features Panel (Hidden on Mobile) */}
          <div className="features-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}><ShieldCheck size={24} style={{color: '#93c5fd'}} /> <span style={{fontSize: '15px', fontWeight: 500}}>Secure</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}><Sparkles size={24} style={{color: '#93c5fd'}} /> <span style={{fontSize: '15px', fontWeight: 500}}>AI Powered</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}><RefreshCw size={24} style={{color: '#93c5fd'}} /> <span style={{fontSize: '15px', fontWeight: 500}}>Faster</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}><User size={24} style={{color: '#93c5fd'}} /> <span style={{fontSize: '15px', fontWeight: 500}}>For You</span></div>
          </div>
        </div>

        {/* Right Side Card Container */}
        <div className="right-section">
          <div className="auth-card">
            {/* Top Content Area */}
            <div style={{ padding: '48px 40px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 1, overflowY: 'auto' }}>
              
              <div style={{ width: '100%' }}>
                
                {/* Welcome Stage */}
                {stage === 'welcome' && (
                  <>
                    <div style={{
                      width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg, #0d47a1, #1976d2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 16px rgba(13, 71, 161, 0.2)',
                      position: 'relative', overflow: 'hidden'
                    }}>
                      {/* Orbit */}
                      <svg style={{ position: 'absolute', width: '100%', height: '100%' }} viewBox="0 0 100 100">
                        <ellipse cx="50" cy="50" rx="35" ry="15" transform="rotate(-30 50 50)" fill="none" stroke="#60a5fa" strokeWidth="3" />
                        <circle cx="20" cy="30" r="3" fill="#60a5fa" />
                        <circle cx="80" cy="70" r="2" fill="#60a5fa" />
                      </svg>
                      {/* B with Pillars */}
                      <svg width="50" height="50" viewBox="0 0 100 100" style={{ zIndex: 1 }}>
                        <text x="30" y="60" fill="#ffffff" fontSize="48" fontWeight="900" fontStyle="italic" fontFamily="Inter, sans-serif">B</text>
                        <g transform="translate(45, 55) scale(0.4)">
                          <rect x="10" y="0" width="80" height="15" fill="#ffffff" rx="4" />
                          <polygon points="50,-15 0,0 100,0" fill="#ffffff" />
                          <rect x="20" y="20" width="10" height="40" fill="#ffffff" />
                          <rect x="45" y="20" width="10" height="40" fill="#ffffff" />
                          <rect x="70" y="20" width="10" height="40" fill="#ffffff" />
                          <rect x="5" y="65" width="90" height="15" fill="#ffffff" rx="4" />
                        </g>
                      </svg>
                    </div>
                    <h2 style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.5px', color: '#0f172a', marginBottom: '16px' }}>Welcome to Bheeshma Bank</h2>
                    <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
                      Enter the next generation of autonomous banking. Please verify your identity to continue.
                    </p>
                    <button 
                      onClick={() => setStage('phone_lookup')}
                      style={{
                        background: 'linear-gradient(90deg, #1d4ed8, #2563eb)', color: '#ffffff', border: 'none',
                        padding: '16px 32px', borderRadius: '999px', cursor: 'pointer', fontWeight: '600', fontSize: '16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%',
                        boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)'
                      }}
                    >
                      Verify Mobile Number <ArrowRight size={20} />
                    </button>
                  </>
                )}

                {/* Phone Lookup Stage */}
                {stage === 'phone_lookup' && (
                  <form onSubmit={handleCheckPhoneNumber} style={{ textAlign: 'left' }}>
                    <style>
                      {`
                        .phone-input-wrapper { display: flex; align-items: center; border: 1px solid #cbd5e1; border-radius: 24px; transition: all 0.2s ease; background: #f8fafc; margin-top: 8px; }
                        .phone-input-wrapper:focus-within { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); background: #ffffff; }
                      `}
                    </style>
                    
                    <button type="button" onClick={() => setStage('welcome')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: '600', padding: 0, marginBottom: '24px' }}>
                      <ArrowLeft size={16} /> Back
                    </button>
                    
                    <h2 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '8px', color: '#0f172a', textAlign: 'center' }}>Log In or Register</h2>
                    <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px', textAlign: 'center' }}>
                      Enter your mobile number to securely access your Bheeshma Bank account.
                    </p>

                    {sessionExpiredNotice && (
                      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px', borderRadius: '12px', fontSize: '13px', marginBottom: '24px' }}>
                        Your session expired for security reasons. Please log in again.
                      </div>
                    )}

                    <div>
                      <label style={labelStyle}>Phone Number</label>
                      <div className="phone-input-wrapper">
                        <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} style={{ background: 'transparent', border: 'none', padding: '14px 0 14px 16px', fontSize: '15px', color: '#0f172a', outline: 'none', cursor: 'pointer', fontWeight: '500' }}>
                          <option value="+91">+91 (IN)</option>
                        </select>
                        <div style={{ width: '1px', height: '24px', background: '#cbd5e1', margin: '0 12px' }}></div>
                        <input type="tel" placeholder="e.g. 555 019 283" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '14px 16px 14px 0', fontSize: '15px', color: '#0f172a', fontWeight: '500' }} />
                      </div>
                    </div>
                    
                    {phoneLookupError && <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '12px', textAlign: 'center' }}>{phoneLookupError}</div>}

                    <button type="submit" style={{...btnPrimary, width: '100%', background: '#2563eb', fontSize: '16px', padding: '16px', marginTop: '32px'}} disabled={isSearchingPhone}>
                      {isSearchingPhone ? "Verifying..." : "Continue"}
                    </button>
                  </form>
                )}

                {/* Password Entry Stage */}
                {stage === 'enter_password' && (
                  <form onSubmit={handlePasswordSubmit} style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', background: '#f8fafc', padding: '16px', borderRadius: '16px' }}>
                      <img src={matchedUser?.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=Bheeshma"} alt="Avatar" style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fff' }} />
                      <div>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>Welcome back, {matchedUser?.name?.split(' ')[0]}</h2>
                        <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>{countryCode} {phoneNumber}</p>
                      </div>
                    </div>

                    <label style={labelStyle}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? "text" : "password"} placeholder="Enter your password"
                        value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                        style={{...inputStyle, background: '#f8fafc', padding: '14px 16px', fontSize: '15px'}}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '22px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    {loginError && <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '12px' }}>{loginError}</div>}

                    <div style={{ textAlign: 'right', marginTop: '12px' }}>
                      <button type="button" onClick={handleForgotPassword} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                        Forgot Password?
                      </button>
                    </div>

                    <button type="submit" style={{...btnPrimary, width: '100%', background: '#2563eb', fontSize: '16px', padding: '16px', marginTop: '32px'}} disabled={isAuthenticating}>
                      {isAuthenticating ? "Authenticating..." : "Log In"}
                    </button>
                    <button type="button" style={{...btnSecondary, width: '100%', border: '2px solid #e2e8f0', color: '#475569', fontSize: '16px', padding: '16px'}} onClick={() => setStage('phone_lookup')}>
                      Switch Account
                    </button>
                  </form>
                )}

                {/* Multi Device Prompt Stage */}
                {stage === 'multi_device_prompt' && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                        <ShieldCheck size={40} />
                      </div>
                    </div>
                    <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '12px', color: '#0f172a' }}>Active Session Detected</h2>
                    <p style={{ color: '#475569', fontSize: '15px', marginBottom: '32px', lineHeight: 1.6 }}>
                      Your account is already logged into another device. For your security, you can only have one active session at a time.
                      <br/><br/>
                      Would you like to log out of the other device and log in here?
                    </p>
                    <button onClick={() => { createWebsiteSession(matchedUser); onLoginSuccess(matchedUser); }} style={{...btnPrimary, width: '100%', background: '#f59e0b', fontSize: '16px', padding: '16px'}}>
                      Log Out Other Device & Continue
                    </button>
                    <button onClick={() => setStage('phone_lookup')} style={{...btnSecondary, width: '100%', border: '2px solid #e2e8f0', color: '#475569', fontSize: '16px', padding: '16px'}}>
                      Cancel Login
                    </button>
                  </div>
                )}

                {/* Forgot Password Stage */}
                {stage === 'forgot_password' && (
                  <div style={{ textAlign: 'left' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '12px', color: '#0f172a' }}>Reset Password</h2>
                    <p style={{ color: '#475569', fontSize: '15px', marginBottom: '32px', lineHeight: 1.6 }}>
                      A request has been sent to the System Admin. Please contact the Admin to receive your 6-digit Reset PIN.
                    </p>

                    {resetError && <div style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px' }}>{resetError}</div>}
                    {resetSuccess && <div style={{ color: '#10b981', fontSize: '14px', marginBottom: '16px' }}>{resetSuccess}</div>}

                    <label style={labelStyle}>Admin Reset PIN</label>
                    <input type="text" placeholder="6-digit PIN" value={resetPinInput} onChange={(e) => setResetPinInput(e.target.value)} style={{ ...inputStyle, background: '#f8fafc', padding: '14px 16px', fontSize: '15px', marginBottom: '20px' }} />

                    <label style={labelStyle}>New Password / MPIN</label>
                    <input type="tel" placeholder="New secure password or MPIN" value={newResetPassword} onChange={(e) => setNewResetPassword(e.target.value)} style={{ ...inputStyle, background: '#f8fafc', padding: '14px 16px', fontSize: '15px', WebkitTextSecurity: 'disc' }} />

                    <button style={{...btnPrimary, width: '100%', background: '#2563eb', fontSize: '16px', padding: '16px', marginTop: '32px'}} onClick={handleResetPasswordSubmit}>Verify PIN & Reset</button>
                    <button style={{...btnSecondary, width: '100%', border: '2px solid #e2e8f0', color: '#475569', fontSize: '16px', padding: '16px'}} onClick={() => setStage('enter_password')}>Go Back</button>
                  </div>
                )}

                {/* Create Profile Stage */}
                {stage === 'create_profile' && (
                  <form onSubmit={handleCreateProfileSubmit} style={{ textAlign: 'left' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '8px', color: '#0f172a' }}>Create Account</h2>
                    <p style={{ color: '#475569', fontSize: '15px', marginBottom: '24px' }}>
                      Linked to: <span style={{ fontWeight: '600', color: '#2563eb' }}>{countryCode} {phoneNumber}</span>
                    </p>

                    {regError && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px', borderRadius: '12px', fontSize: '14px', marginBottom: '24px' }}>{regError}</div>}

                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>Full Legal Name</label>
                      <input type="text" placeholder="e.g. Alexander Hamilton" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} style={{...inputStyle, background: '#f8fafc', padding: '14px 16px', fontSize: '15px'}} />
                      <div style={{ fontSize: '13px', marginTop: '6px', color: checks.fullName.isValid ? '#10b981' : '#94a3b8', fontWeight: '500' }}>{checks.fullName.message}</div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>Email Address</label>
                      <input type="email" placeholder="name@company.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{...inputStyle, background: '#f8fafc', padding: '14px 16px', fontSize: '15px'}} />
                      <div style={{ fontSize: '13px', marginTop: '6px', color: checks.email.isValid ? '#10b981' : '#94a3b8', fontWeight: '500' }}>{checks.email.message}</div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>Create Password</label>
                      <input type="tel" placeholder="6+ chars" value={formData.newPassword} onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} style={{ ...inputStyle, background: '#f8fafc', padding: '14px 16px', fontSize: '15px', WebkitTextSecurity: 'disc' }} />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>Confirm Password</label>
                      <input type="tel" placeholder="Re-enter password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} style={{ ...inputStyle, background: '#f8fafc', padding: '14px 16px', fontSize: '15px', WebkitTextSecurity: 'disc' }} />
                    </div>

                    <button type="submit" style={{...btnPrimary, width: '100%', background: '#2563eb', fontSize: '16px', padding: '16px', marginTop: '32px'}} disabled={isAuthenticating}>
                      {isAuthenticating ? "Creating Profile..." : "Complete Registration"}
                    </button>
                    <button type="button" style={{...btnSecondary, width: '100%', border: '2px solid #e2e8f0', color: '#475569', fontSize: '16px', padding: '16px'}} onClick={() => setStage('phone_lookup')}>
                      Change Phone Number
                    </button>
                  </form>
                )}

              </div>
            </div>

            {/* Bottom Features Row */}
            <div style={{ background: '#f8fafc', padding: '24px 16px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '1px solid #e2e8f0', zIndex: 1, marginTop: 'auto', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#475569' }}>
                <Sparkles size={24} style={{color: '#3b82f6'}} />
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Smart Banking</span>
              </div>
              <div style={{ width: '1px', height: '40px', background: '#cbd5e1' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#475569' }}>
                <ShieldCheck size={24} style={{color: '#3b82f6'}} />
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Secure & Safe</span>
              </div>
              <div style={{ width: '1px', height: '40px', background: '#cbd5e1' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#475569' }}>
                <User size={24} style={{color: '#3b82f6'}} />
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Multi-Agent Engine</span>
              </div>
            </div>

            {/* Blue Bottom Wave */}
            <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '140px', zIndex: 0, pointerEvents: 'none' }} preserveAspectRatio="none" viewBox="0 0 1440 320">
              <path fill="#e0f2fe" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
