import React from 'react';
import { X, Cpu, ShieldCheck, Brain, TrendingUp, Database } from 'lucide-react';

export const SystemArchitectureModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 3, 15, 0.88)',
      backdropFilter: 'blur(14px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '860px',
        width: '100%',
        maxHeight: '90vh',
        background: 'linear-gradient(180deg, #130f26 0%, #0d0a1b 100%)',
        borderRadius: '24px',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        boxShadow: '0 25px 70px rgba(0,0,0,0.9), 0 0 50px rgba(16, 185, 129, 0.15)',
        overflowY: 'auto',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '22px 26px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(14, 165, 233, 0.15) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981, #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
            }}>
              <Brain size={24} color="#06121e" />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>
                AI Architecture & Multi-Agent Design
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                Real-World Problem Statement, ReAct Tool-Calling & Credit Engine
              </div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '26px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Section 1: The Real World Problem */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
              1. The Real-World Problem Solved
            </div>
            <p style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
              Traditional banking and personal finance apps are passive: users must manually calculate affordability, remember payment deadlines, navigate complicated menus, and wait 3–7 business days for human underwriters to process loans.
              <br /><br />
              <strong>Nexus Banking AI</strong> solves this with two cooperating AI pillars:
              <br />
              • <strong>Autonomous Financial Copilot:</strong> An intelligent conversational agent that executes payments via verified tool calls, audits spending against budgets, and simulates multi-month cash flow before major expenses.
              <br />
              • <strong>Enterprise Multi-Agent Loan Underwriting:</strong> A 3-agent pipeline (KYC & Biometrics, Statement RAG Financial, Risk Scoring & Audit) that reduces loan processing from days to seconds with full Explainable AI (XAI) rationale and cryptographic auditing.
            </p>
          </div>

          {/* Section 2: Agent Architecture Blueprint */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '14px' }}>
              2. Multi-Agent System Architecture
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {/* Agent A */}
              <div style={{ background: 'rgba(16, 185, 129, 0.06)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#10b981', fontWeight: '700', fontSize: '13px' }}>
                  <Cpu size={16} /> Autonomous Copilot (ReAct)
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                  • Intent Parsing & Natural Language Querying<br />
                  • Tool Execution: <code>resolve_recipient</code>, <code>check_balance</code><br />
                  • Safety Policy Gate (UPI PIN Authorization)
                </div>
              </div>

              {/* Agent B */}
              <div style={{ background: 'rgba(139, 92, 246, 0.06)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#c084fc', fontWeight: '700', fontSize: '13px' }}>
                  <ShieldCheck size={16} /> KYC & Biometrics Agent
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                  • Optical Character Recognition (OCR)<br />
                  • Face Vector Similarity Match (98.9%)<br />
                  • Sanctions, AML & PEP Database Screening
                </div>
              </div>

              {/* Agent C */}
              <div style={{ background: 'rgba(14, 165, 233, 0.06)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#38bdf8', fontWeight: '700', fontSize: '13px' }}>
                  <Database size={16} /> Financial Statement Agent
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                  • Bank Statement Ingestion via PDF RAG<br />
                  • Debt-To-Income (DTI) Computation<br />
                  • Income Regularity & Stability Scoring
                </div>
              </div>

              {/* Agent D */}
              <div style={{ background: 'rgba(245, 158, 11, 0.06)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#fbbf24', fontWeight: '700', fontSize: '13px' }}>
                  <TrendingUp size={16} /> Risk Scoring & Audit Agent
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                  • Multi-Factor Underwriting Scorecard<br />
                  • Explainable AI (XAI) Decision Rationale<br />
                  • Cryptographic SHA-256 Audit Trail
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: The 3 Core Copilot Capabilities */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>
              3. Flagship Copilot Interactions You Can Test Right Now
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: '#f3f4f6', padding: '12px 14px', borderRadius: '10px', fontSize: '12.5px', borderLeft: '3px solid #10b981' }}>
                <div style={{ color: '#10b981', fontWeight: '700', marginBottom: '2px' }}>A. Transactional Execution</div>
                <div style={{ color: '#1f2937', fontFamily: 'monospace' }}>"Transfer ₹200 to John for rent"</div>
                <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px' }}>
                  Agent resolves John Davis from contact graph, checks primary bank balance (₹8,450.00), prepares transaction parameters, and invokes the UPI PIN authorization modal.
                </div>
              </div>

              <div style={{ background: '#f3f4f6', padding: '12px 14px', borderRadius: '10px', fontSize: '12.5px', borderLeft: '3px solid #0ea5e9' }}>
                <div style={{ color: '#0ea5e9', fontWeight: '700', marginBottom: '2px' }}>B. Analytical Reasoning</div>
                <div style={{ color: '#1f2937', fontFamily: 'monospace' }}>"How much did I spend on dining out last month compared to my budget?"</div>
                <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px' }}>
                  Agent queries the transaction ledger, aggregates dining expenses (₹310 spent vs ₹400 budget), calculates variance (78% utilization, ₹90 remaining), and plots an interactive visual breakdown.
                </div>
              </div>

              <div style={{ background: '#f3f4f6', padding: '12px 14px', borderRadius: '10px', fontSize: '12.5px', borderLeft: '3px solid #f59e0b' }}>
                <div style={{ color: '#f59e0b', fontWeight: '700', marginBottom: '2px' }}>C. Proactive Affordability & Cash Flow Forecasting</div>
                <div style={{ color: '#1f2937', fontFamily: 'monospace' }}>"Can I afford a ₹1,500 vacation next month?"</div>
                <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px' }}>
                  Agent simulates next month’s cash flow: incoming salary (₹6,500) minus scheduled bills (₹1,540) minus essentials (₹800) = ₹4,160 surplus. Confirms ₹1,500 vacation leaves a safe ₹2,660 buffer without touching emergency reserves.
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)',
              color: '#06121e',
              fontSize: '14px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Explore Live Application
          </button>
        </div>
      </div>
    </div>
  );
};
