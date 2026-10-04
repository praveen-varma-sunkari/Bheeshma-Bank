import React, { useState } from 'react';
import { X, Cpu, Key, Check, Sparkles } from 'lucide-react';

export const ApiSettingsModal = ({ isOpen, onClose, agentEngine, onEngineUpdated }) => {
  const [provider, setProvider] = useState(agentEngine?.getProvider() || "builtin");
  const [apiKey, setApiKey] = useState(agentEngine?.apiKey || "");
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    agentEngine.setApiKey(apiKey, provider);
    
    // Sync with backend globally
    try {
      await fetch('http://localhost:5000/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey })
      });
    } catch (err) {
      console.error("Failed to sync API key to backend", err);
    }
    
    setSaved(true);
    if (onEngineUpdated) onEngineUpdated();
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(6, 4, 16, 0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        background: '#19132c',
        borderRadius: '24px',
        border: '1px solid rgba(139, 63, 240, 0.35)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
        overflow: 'hidden',
        color: '#111827',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #441477 0%, #220b3d 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={20} color="#a855f7" />
            <span style={{ fontSize: '15px', fontWeight: '700' }}>AI & LLM Engine Settings</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: '#4b5563', marginBottom: '16px', lineHeight: '1.5' }}>
            Configure how the <strong>Autonomous Banking Copilot</strong> reasons and executes financial commands.
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
              Select Intelligence Provider
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '12px',
                background: provider === 'builtin' ? 'rgba(139, 63, 240, 0.2)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${provider === 'builtin' ? '#8b3ff0' : 'rgba(0, 0, 0, 0.04)'}`,
                cursor: 'pointer'
              }}>
                <input 
                  type="radio" 
                  name="provider" 
                  value="builtin" 
                  checked={provider === 'builtin'} 
                  onChange={(e) => setProvider(e.target.value)} 
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>Autonomous ReAct Engine (Recommended)</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Built-in, zero latency, guaranteed reliability, no API keys needed.</div>
                </div>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '12px',
                background: provider === 'gemini' ? 'rgba(139, 63, 240, 0.2)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${provider === 'gemini' ? '#8b3ff0' : 'rgba(0, 0, 0, 0.04)'}`,
                cursor: 'pointer'
              }}>
                <input 
                  type="radio" 
                  name="provider" 
                  value="gemini" 
                  checked={provider === 'gemini'} 
                  onChange={(e) => setProvider(e.target.value)} 
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>Google Gemini 1.5 Flash (Live LLM)</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Connects directly to Google Generative AI API with live streaming.</div>
                </div>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '12px',
                background: provider === 'openai' ? 'rgba(139, 63, 240, 0.2)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${provider === 'openai' ? '#8b3ff0' : 'rgba(0, 0, 0, 0.04)'}`,
                cursor: 'pointer'
              }}>
                <input 
                  type="radio" 
                  name="provider" 
                  value="openai" 
                  checked={provider === 'openai'} 
                  onChange={(e) => setProvider(e.target.value)} 
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>OpenAI GPT-4o-mini (Live LLM)</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Connects to OpenAI Chat Completions API.</div>
                </div>
              </label>
            </div>
          </div>

          {provider !== 'builtin' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>
                {provider === 'gemini' ? 'Google Gemini API Key' : 'OpenAI API Key'}
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: '#f9fafb',
                border: '1px solid rgba(139, 63, 240, 0.3)',
                borderRadius: '12px',
                padding: '0 12px'
              }}>
                <Key size={16} color="#94a3b8" style={{ marginRight: '8px' }} />
                <input 
                  type="password"
                  placeholder="Paste your API key here (sk-... or AIza...)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    padding: '12px 0',
                    color: '#111827',
                    fontSize: '13px'
                  }}
                  required={provider !== 'builtin'}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: saved ? '#00b875' : 'linear-gradient(135deg, #6739b6 0%, #8b3ff0 100%)',
                color: '#111827',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              {saved ? <Check size={18} /> : <Sparkles size={18} />}
              {saved ? "Settings Saved!" : "Apply Engine Configuration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
