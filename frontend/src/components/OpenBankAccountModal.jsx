import React, { useState } from 'react';
import { 
  CheckCircle2, AlertCircle, ArrowRight, 
  Sparkles, RefreshCw, FileCheck, X
} from 'lucide-react';
import { requestBankAccountOpen, logMpinFailure } from '../data/mockData';

export const OpenBankAccountModal = ({ isOpen, onClose, user, onAccountOpened }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form details
  const [formData, setFormData] = useState({
    legalName: user?.name || '',
    dob: '2000-08-20',
    nationality: 'United States',
    address: '742 Evergreen Terrace, Suite 100',
    postalCode: '94016',
    country: 'United States',
    taxId: '984-21-4091',
    employment: 'Executive / Technology',
    annualIncome: '₹120,000 - ₹250,000',
    pepDeclared: 'NO',
    idType: 'International Passport',
    idNumber: 'P9820491X',
    tier: 'Bheeshma Black Metal',
    currency: 'INR',
    initialDeposit: 1500,
    fundingSource: 'Instant Federal Reserve Wire',
    mpin: ''
  });

  if (!isOpen) return null;

  // Real-time verification helpers
  const isAdult = () => {
    if (!formData.dob) return false;
    const birthYear = parseInt(formData.dob.split('-')[0], 10);
    return (2026 - birthYear) >= 18;
  };

  const isTaxIdValid = () => {
    return formData.taxId.trim().length >= 8;
  };

  const isAddressValid = () => {
    return formData.address.trim().length >= 10 && formData.postalCode.trim().length >= 4;
  };

  const isIdValid = () => {
    return formData.idNumber.trim().length >= 6;
  };

  const handleNextStep = () => {
    setErrorMessage('');
    if (currentStep === 1) {
      if (!formData.legalName.trim() || formData.legalName.trim().split(' ').length < 2) {
        setErrorMessage("Please enter your complete legal name (first and last name).");
        return;
      }
      if (!isAdult()) {
        setErrorMessage("Legal adult age (18+) is required to open an international sovereign account.");
        return;
      }
      if (!isAddressValid()) {
        setErrorMessage("Please provide a valid street address and postal/ZIP code.");
        return;
      }
    }

    if (currentStep === 2) {
      if (!isTaxIdValid()) {
        setErrorMessage("Please enter a valid Taxpayer ID / SSN (minimum 8 characters).");
        return;
      }
      if (!formData.employment) {
        setErrorMessage("Please specify your employment status.");
        return;
      }
    }

    if (currentStep === 3) {
      if (!isIdValid()) {
        setErrorMessage("Please enter a valid document identity number.");
        return;
      }
    }

    if (currentStep === 4) {
      if (!formData.mpin || formData.mpin.length < 4) {
        setErrorMessage("Please enter a 4-6 digit MPIN.");
        return;
      }
      
      // AI Check for DOB Match
      const dobString = formData.dob.replace(/-/g, ''); // YYYYMMDD
      const year = formData.dob.split('-')[0];
      const month = formData.dob.split('-')[1];
      const day = formData.dob.split('-')[2];
      
      if (formData.mpin.includes(year) || formData.mpin.includes(month+day) || formData.mpin.includes(day+month)) {
        // Log failure
        logMpinFailure(user.phone, user.name, formData.dob, formData.mpin);
        setErrorMessage("Security AI Alert: MPIN cannot contain parts of your Date of Birth. Please choose a different, secure MPIN.");
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setIsVerifying(true);
    setErrorMessage('');

    // Simulate 1.8s verification delay
    await new Promise(r => setTimeout(r, 1800));
    
    setIsVerifying(false);
    const res = await requestBankAccountOpen(user, formData);
    if (res.error) {
      setErrorMessage(res.error);
      return;
    }

    onAccountOpened(res.user);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9998,
      backgroundColor: 'rgba(5, 7, 12, 0.88)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        maxWidth: '620px',
        width: '100%',
        background: '#ffffff',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '26px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
        padding: '30px',
        color: '#111827',
        position: 'relative'
      }}>
        {/* Header Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f9fafb',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '999px',
                background: currentStep >= s ? '#000000' : 'rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Title */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '8px'
          }}>
            <Sparkles size={12} />
            <span>Step {currentStep} of 4 • Bank Account Verification</span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>
            {currentStep === 1 && "Legal Identity & Residential Address"}
            {currentStep === 2 && "Tax ID & Financial Background"}
            {currentStep === 3 && "Government ID & Biometric Verification"}
            {currentStep === 4 && "Select Account Tier & Initial Funding"}
          </h2>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            Required by international banking standards to issue your IBAN, debit card, and credit facility.
          </p>
        </div>

        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#f87171',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '12px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: LEGAL IDENTITY & ADDRESS */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#4b5563', fontWeight: '700' }}>Legal Full Name</label>
              <input
                type="text"
                value={formData.legalName}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                placeholder="Full name as printed on ID"
                style={{
                  width: '100%',
                  marginTop: '4px',
                  background: '#f9fafb',
                  border: '1px solid rgba(0, 0, 0, 0.15)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  color: '#111827',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#4b5563', fontWeight: '700' }}>Date of Birth (18+)</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  style={{
                    width: '100%',
                    marginTop: '4px',
                    background: '#f9fafb',
                    border: '1px solid rgba(0, 0, 0, 0.15)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: '#111827',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#4b5563', fontWeight: '700' }}>Nationality</label>
                <div style={{
                  width: '100%',
                  marginTop: '4px',
                  background: '#f3f4f6',
                  border: '1px solid rgba(0, 0, 0, 0.15)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  color: '#6b7280',
                  fontSize: '13px',
                }}>
                  India
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#4b5563', fontWeight: '700' }}>Residential Street Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street name, apartment or suite number"
                style={{
                  width: '100%',
                  marginTop: '4px',
                  background: '#f9fafb',
                  border: '1px solid rgba(0, 0, 0, 0.15)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  color: '#111827',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#4b5563', fontWeight: '700' }}>Postal / ZIP Code</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="e.g. 94016"
                  style={{
                    width: '100%',
                    marginTop: '4px',
                    background: '#f9fafb',
                    border: '1px solid rgba(0, 0, 0, 0.15)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: '#111827',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#4b5563', fontWeight: '700' }}>Country of Residence</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  style={{
                    width: '100%',
                    marginTop: '4px',
                    background: '#f9fafb',
                    border: '1px solid rgba(0, 0, 0, 0.15)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: '#111827',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: TAX ID & FINANCIAL BACKGROUND */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#4b5563', fontWeight: '700' }}>Government Tax ID / SSN / National Number</label>
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                placeholder="e.g. 984-21-4091 or Tax ID"
                style={{
                  width: '100%',
                  marginTop: '4px',
                  background: '#f9fafb',
                  border: isTaxIdValid() ? '1px solid #10b981' : '1px solid rgba(0, 0, 0, 0.15)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  color: '#111827',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <div style={{ fontSize: '10px', color: '#10b981', marginTop: '4px' }}>
                ✓ Encrypted with SHA-256 for regulatory compliance
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#4b5563', fontWeight: '700' }}>Employment & Wealth Origin</label>
              <select
                value={formData.employment}
                onChange={(e) => setFormData({ ...formData, employment: e.target.value })}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  background: '#f9fafb',
                  border: '1px solid rgba(0, 0, 0, 0.15)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  color: '#111827',
                  fontSize: '13px',
                  outline: 'none'
                }}
              >
                <option value="Executive / Technology" style={{ background: '#0d131f' }}>Executive / Technology & Engineering</option>
                <option value="Business Owner / Founder" style={{ background: '#0d131f' }}>Business Owner / Founder</option>
                <option value="Finance & Professional Services" style={{ background: '#0d131f' }}>Finance & Professional Services</option>
                <option value="Self-Employed / Independent" style={{ background: '#0d131f' }}>Self-Employed / Independent Consultant</option>
                <option value="Investor / Private Wealth" style={{ background: '#0d131f' }}>Investor / Private Wealth</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#4b5563', fontWeight: '700' }}>Estimated Annual Liquidity</label>
              <select
                value={formData.annualIncome}
                onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  background: '#f9fafb',
                  border: '1px solid rgba(0, 0, 0, 0.15)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  color: '#111827',
                  fontSize: '13px',
                  outline: 'none'
                }}
              >
                <option value="₹50,000 - ₹100,000" style={{ background: '#0d131f' }}>₹50,000 - ₹100,000</option>
                <option value="₹100,000 - ₹250,000" style={{ background: '#0d131f' }}>₹100,000 - ₹250,000</option>
                <option value="₹250,000 - ₹500,000" style={{ background: '#0d131f' }}>₹250,000 - ₹500,000</option>
                <option value="₹500,000+" style={{ background: '#0d131f' }}>₹500,000+ (Private Client)</option>
              </select>
            </div>

            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '11px', color: '#4b5563' }}>
                Politically Exposed Person (PEP) Screening
              </span>
              <span style={{ fontSize: '10px', fontWeight: '800', color: '#10b981' }}>
                CLEAN / NON-PEP
              </span>
            </div>
          </div>
        )}

        {/* STEP 3: DOCUMENT & BIOMETRIC KYC */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#4b5563', fontWeight: '700' }}>Document Type</label>
                <div style={{
                  width: '100%',
                  marginTop: '4px',
                  background: '#f3f4f6',
                  border: '1px solid rgba(0, 0, 0, 0.15)',
                  borderRadius: '10px',
                  padding: '10px 8px',
                  color: '#6b7280',
                  fontSize: '12px',
                }}>
                  Aadhar Card
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#4b5563', fontWeight: '700' }}>Document Serial Number</label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value.toUpperCase() })}
                  placeholder="e.g. P9820491X"
                  style={{
                    width: '100%',
                    marginTop: '4px',
                    background: '#f9fafb',
                    border: isIdValid() ? '1px solid #10b981' : '1px solid rgba(0, 0, 0, 0.15)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: '#111827',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Simulated Live Biometric Scan Card */}
            <div style={{
              background: 'rgba(0, 240, 255, 0.04)',
              border: '1px dashed rgba(0, 0, 0, 0.1)',
              borderRadius: '16px',
              padding: '18px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
                color: '#111827'
              }}>
                <FileCheck size={24} />
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>
                Biometric Document Verification Check
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                Holographic optical text match & 1:1 facial vector similarity check
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: '700',
                marginTop: '10px'
              }}>
                <CheckCircle2 size={13} />
                <span>99.2% Biometric Match Confidence</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: TIER SELECTION & INITIAL FUNDING */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#4b5563', fontWeight: '700' }}>Choose Account Tier</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tier: 'Bheeshma Sovereign' })}
                  style={{
                    background: formData.tier === 'Bheeshma Sovereign' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255,255,255,0.03)',
                    border: formData.tier === 'Bheeshma Sovereign' ? '1px solid #00f0ff' : '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    padding: '12px',
                    textAlign: 'left',
                    color: '#111827',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>Bheeshma Sovereign</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>Zero fee • 4.2% APY</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tier: 'Bheeshma Black Metal' })}
                  style={{
                    background: formData.tier === 'Bheeshma Black Metal' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255,255,255,0.03)',
                    border: formData.tier === 'Bheeshma Black Metal' ? '1px solid #00f0ff' : '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    padding: '12px',
                    textAlign: 'left',
                    color: '#111827',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>Bheeshma Black Metal</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>Titanium Card • 5.15% APY</div>
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#4b5563', fontWeight: '700' }}>Base Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  style={{
                    width: '100%',
                    marginTop: '4px',
                    background: '#f9fafb',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: '#111827',
                    fontSize: '13px',
                    fontWeight: '700'
                  }}
                >
                  <option value="INR" style={{ background: '#0d131f' }}>INR (₹)</option>
                  <option value="EUR" style={{ background: '#0d131f' }}>EUR (€)</option>
                  <option value="GBP" style={{ background: '#0d131f' }}>GBP (£)</option>
                  <option value="INR" style={{ background: '#0d131f' }}>INR (₹)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#4b5563', fontWeight: '700' }}>Initial Deposit Allocation</label>
                <input
                  type="number"
                  value={formData.initialDeposit}
                  onChange={(e) => setFormData({ ...formData, initialDeposit: e.target.value })}
                  placeholder="e.g. 1500"
                  style={{
                    width: '100%',
                    marginTop: '4px',
                    background: '#f9fafb',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: '#111827',
                    fontSize: '14px',
                    fontWeight: '700',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#4b5563', fontWeight: '700' }}>Create Secure MPIN</label>
              <input
                type="tel"
                style={{ WebkitTextSecurity: 'disc', letterSpacing: '4px', width: '100%', marginTop: '4px', background: '#f9fafb', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '10px', padding: '10px 12px', color: '#111827', fontSize: '14px', fontWeight: '700', outline: 'none' }}
                value={formData.mpin}
                onChange={(e) => setFormData({ ...formData, mpin: e.target.value.replace(/[^0-9]/g, '').slice(0,6) })}
                placeholder="4-6 digit numeric PIN"
              />
            </div>

            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '11px',
              color: '#4b5563'
            }}>
              🛡️ Upon creation, your official <b>Account Number</b>, <b>IBAN</b>, and <b>Virtual Visa Infinite Card</b> will be allocated with instant clearing capability once verified by Admin.
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              style={{
                padding: '12px 18px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.15)',
                background: 'transparent',
                color: '#6b7280',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Back
            </button>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)',
                color: '#111827',
                fontSize: '14px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>Verify & Continue</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextStep}
              disabled={isVerifying}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                color: '#111827',
                fontSize: '15px',
                fontWeight: '800',
                cursor: isVerifying ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)'
              }}
            >
              {isVerifying ? (
                <>
                  <RefreshCw size={18} style={{ animation: 'spin 1s infinite linear' }} />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <span>Submit for Verification</span>
                  <CheckCircle2 size={18} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
