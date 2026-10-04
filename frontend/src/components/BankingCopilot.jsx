import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Mic, MicOff, Volume2, VolumeX, Sparkles, 
  ShieldCheck, ChevronDown, ChevronUp, CheckCircle2, RefreshCw
} from 'lucide-react';

const createTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const generateMsgId = (prefix) => `${prefix}_${Date.now()}`;

export const BankingCopilot = ({ 
  agentEngine, 
  user,
  onTriggerUpiPin,
  onExecuteVoiceTransfer,
  messages,
  setMessages,
  onVoiceFailure,
  isDrawer = false, 
  onCloseDrawer 
}) => {


  const [inputVal, setInputVal] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState({});
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const handleSendMessageRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Setup Web Speech API for voice recognition if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputVal(transcript);
        setIsListening(false);
        window.dispatchEvent(new Event('resume-wake-word'));
        
        // Use a lightweight pre-calculated pitch to avoid blocking the voice UI
        let currentPitch = 150;

        // Automatically send after voice capture immediately
        handleSendMessageRef.current?.(transcript, true, { voicePitchScore: currentPitch });
      };

      recognition.onerror = (event) => {
        console.error("Speech Recognition Error in Copilot:", event.error);
        setIsListening(false);
        window.dispatchEvent(new Event('resume-wake-word'));
      };

      recognition.onend = () => {
        setIsListening(false);
        window.dispatchEvent(new Event('resume-wake-word'));
      };

      recognitionRef.current = recognition;
    }
  }, []); // Run once

  useEffect(() => {
    // Add wake word event listener separately
    const handleWakeWord = () => {
      if (recognitionRef.current && !isListening) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.warn("Wake word start failed:", e);
        }
      }
    };
    
    window.addEventListener('bheeshma-wake-word', handleWakeWord);
    return () => window.removeEventListener('bheeshma-wake-word', handleWakeWord);
  }, [isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported by your current browser. Please type your message.");
      return;
    }

    // Warm up the SpeechSynthesis engine with a silent utterance to securely unlock audio context
    if ('speechSynthesis' in window) {
      const silentUtterance = new SpeechSynthesisUtterance('');
      silentUtterance.volume = 0;
      window.speechSynthesis.speak(silentUtterance);
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      window.dispatchEvent(new Event('resume-wake-word'));
    } else {
      setIsListening(true); // INSTANT visual feedback
      try {
        window.dispatchEvent(new Event('pause-wake-word'));
        // Start synchronously to preserve the browser's User Gesture token
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (err) {
            console.error("Failed to start mic:", err);
            setIsListening(false); // Revert if failed
          }
        }
      } catch (e) {
        console.warn(e);
        setIsListening(false);
      }
    }
  };

  const speakText = (text, forceSpeak = false) => {
    if (!('speechSynthesis' in window)) return;
    if (!voiceEnabled && !forceSpeak) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend, isVoiceFlag = false) => {
    const query = typeof textToSend === 'string' ? textToSend : inputVal;
    if (!query.trim() || isProcessing) return;

    const userMessage = {
      id: generateMsgId("usr"),
      role: "user",
      content: query,
      timestamp: createTimestamp()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputVal("");
    setIsProcessing(true);

    try {
      const response = await agentEngine.processUserMessage(query, { isVoice: isVoiceFlag });

      const assistantMessage = {
        id: generateMsgId("ast"),
        role: "assistant",
        content: response.content,
        actionRequired: response.actionRequired,
        transferPayload: response.transferPayload,
        chartData: response.chartData,
        simulationData: response.simulationData,
        agentSteps: response.agentSteps,
        timestamp: createTimestamp()
      };

      setMessages(prev => [...prev, assistantMessage]);
      speakText(response.content, isVoiceFlag);
      
      if (response.actionRequired === "INCREMENT_VOICE_FAILURES" && onVoiceFailure) {
        onVoiceFailure();
      }

      if (response.actionRequired === "VOICE_AUTHORIZE_TRANSFER" && response.transferPayload && onExecuteVoiceTransfer) {
        // Automatically execute without MPIN if voice auth succeeded
        setTimeout(() => {
          onExecuteVoiceTransfer(response.transferPayload);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev, 
        {
          id: generateMsgId("err"),
          role: "assistant",
          content: "I encountered an issue processing that instruction. Please try again.",
          timestamp: createTimestamp()
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    handleSendMessageRef.current = handleSendMessage;
  });

  const toggleSteps = (msgId) => {
    setExpandedSteps(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  // Quick Action Chips from User Request
  const promptPills = [
    { label: "💸 Transfer ₹200 to John for rent", prompt: "Transfer ₹200 to John for rent" },
    { label: "📊 Dining vs Budget", prompt: "How much did I spend on dining out last month compared to my budget?" },
    { label: "🏖️ ₹1,500 Vacation Affordability", prompt: "Can I afford a ₹1,500 vacation next month?" },
    { label: "🗓️ Upcoming Bills", prompt: "What are my upcoming bills this month?" }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#ffffff',
      borderRadius: isDrawer ? '0' : '22px',
      overflow: 'hidden',
      border: isDrawer ? 'none' : '1px solid #e5e7eb',
      boxShadow: isDrawer ? 'none' : '0 4px 12px rgba(0,0,0,0.05)'
    }}>
      {/* Copilot Header */}
      <div style={{
        padding: '14px 18px',
        background: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            background: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            <Bot size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>Banking Copilot</span>
              <span style={{
                fontSize: '10px',
                padding: '2px 7px',
                borderRadius: '6px',
                background: 'rgba(0, 184, 117, 0.2)',
                color: '#00b875',
                fontWeight: '700',
                border: '1px solid rgba(0, 184, 117, 0.4)'
              }}>
                RE-ACT AGENT
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>Autonomous Wealth & Transaction Execution</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            title={voiceEnabled ? "Mute Voice Readout" : "Enable Voice Readout"}
            style={{
              background: voiceEnabled ? 'rgba(0, 184, 117, 0.2)' : 'rgba(0, 0, 0, 0.04)',
              border: `1px solid ${voiceEnabled ? '#00b875' : 'rgba(0, 0, 0, 0.08)'}`,
              color: voiceEnabled ? '#00b875' : '#6b7280',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          {isDrawer && onCloseDrawer && (
            <button
              onClick={onCloseDrawer}
              style={{
                background: 'rgba(0, 0, 0, 0.04)',
                border: 'none',
                color: '#111827',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div 
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '100%'
              }}
            >
              <div style={{
                maxWidth: '88%',
                padding: '12px 16px',
                borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: isUser 
                  ? 'linear-gradient(135deg, #6739b6 0%, #8b3ff0 100%)' 
                  : '#ffffff',
                border: isUser ? 'none' : '1px solid #e5e7eb',
                color: isUser ? '#ffffff' : '#111827',
                boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                fontSize: '13.5px',
                lineHeight: '1.5',
                whiteSpace: 'pre-line'
              }}>
                {msg.content}

                {/* Inline Action Card: Authorize Transfer */}
                {(msg.actionRequired === "AUTHORIZE_TRANSFER" || msg.actionRequired === "AUTHORIZE_TRANSFER_FALLBACK") && msg.transferPayload && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    borderRadius: '14px',
                    background: '#f3f4f6',
                    border: '1px solid rgba(168, 85, 247, 0.4)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#4b5563' }}>Pending Authorization</span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#3b82f6' }}>
                        ₹{msg.transferPayload.amount.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => onTriggerUpiPin(msg.transferPayload)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '10px',
                        border: 'none',
                        background: '#000000',
                        color: '#111827',
                        fontWeight: '600',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 12px rgba(0, 184, 117, 0.4)'
                      }}
                    >
                      <ShieldCheck size={16} /> Enter UPI PIN to Pay
                    </button>
                  </div>
                )}
                
                {msg.actionRequired === "VOICE_AUTHORIZE_TRANSFER" && msg.transferPayload && (
                  <div style={{
                    marginTop: '12px',
                    padding: '16px',
                    borderRadius: '14px',
                    background: '#ecfdf5',
                    border: '1px solid #10b981'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#047857', fontWeight: '700' }}>Biometric Auth Success</span>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: '#047857' }}>
                        ${msg.transferPayload.amount.toFixed(2)}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: '#047857',
                      fontWeight: '700',
                      fontSize: '13px',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}>
                      <div style={{ width: '12px', height: '12px', border: '2px solid #047857', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      Processing Voice Transaction...
                    </div>
                  </div>
                )}

                {/* Inline Chart: Budget Comparison */}
                {msg.chartData && msg.chartData.type === "BUDGET_COMPARISON" && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    borderRadius: '14px',
                    background: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                      <span style={{ color: '#4b5563' }}>Budget Allocated</span>
                      <span style={{ fontWeight: '700', color: '#111827' }}>${msg.chartData.budget.toFixed(2)}</span>
                    </div>

                    <div style={{
                      height: '10px',
                      borderRadius: '5px',
                      background: 'rgba(0, 0, 0, 0.05)',
                      overflow: 'hidden',
                      marginBottom: '6px'
                    }}>
                      <div style={{
                        width: `${Math.min(100, msg.chartData.percentUsed)}%`,
                        height: '100%',
                        background: msg.chartData.percentUsed > 90 
                          ? 'linear-gradient(90deg, #f59e0b, #ef4444)' 
                          : 'linear-gradient(90deg, #8b3ff0, #00d2ff)',
                        borderRadius: '5px'
                      }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280' }}>
                      <span>Spent: ${msg.chartData.spent.toFixed(2)}</span>
                      <span>{msg.chartData.percentUsed}% Utilized</span>
                    </div>
                  </div>
                )}

                {/* Inline Simulation: Vacation Affordability */}
                {msg.simulationData && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    borderRadius: '14px',
                    background: 'rgba(0, 184, 117, 0.1)',
                    border: '1px solid rgba(0, 184, 117, 0.3)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#00b875', fontWeight: '700', marginBottom: '6px' }}>
                      <CheckCircle2 size={15} /> Safe to Spend Projected Surplus
                    </div>
                    <div style={{ fontSize: '11px', color: '#4b5563' }}>
                      Post-vacation safe cushion remaining: <strong>+${msg.simulationData.remainingBuffer.toFixed(2)}</strong> from next salary cycle alone.
                    </div>
                  </div>
                )}

                <div style={{ fontSize: '10px', color: '#9ca3af', textAlign: 'right', marginTop: '6px' }}>
                  {msg.timestamp}
                </div>
              </div>

              {/* Collapsible ReAct Agent Reasoning Trace */}
              {msg.agentSteps && msg.agentSteps.length > 0 && (
                <div style={{ width: '88%', marginTop: '6px' }}>
                  <button
                    onClick={() => toggleSteps(msg.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#3b82f6',
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      padding: '2px 0'
                    }}
                  >
                    <Sparkles size={12} color="#3b82f6" />
                    <span>{expandedSteps[msg.id] ? "Hide Agent Execution Trace" : `View Agent Execution (${msg.agentSteps.length} steps)`}</span>
                    {expandedSteps[msg.id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>

                  {expandedSteps[msg.id] && (
                    <div style={{
                      marginTop: '6px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      fontSize: '11px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}>
                      {msg.agentSteps.map((s, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                          <span style={{ color: '#3b82f6', fontFamily: 'monospace', fontWeight: '600', whiteSpace: 'nowrap' }}>
                            [{s.step}]:
                          </span>
                          <span style={{ color: '#4b5563' }}>{s.detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {isProcessing && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: '14px',
            background: 'rgba(28, 22, 49, 0.85)',
            border: '1px solid rgba(139, 63, 240, 0.25)',
            width: 'fit-content',
            color: '#a78bfa',
            fontSize: '12px'
          }}>
            <RefreshCw size={14} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
            <span>Agent reasoning & querying financial ledger...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Pills */}
      <div style={{
        padding: '8px 14px',
        background: '#ffffff',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        {promptPills.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(pill.prompt)}
            disabled={isProcessing}
            style={{
              padding: '6px 12px',
              borderRadius: '999px',
              border: '1px solid rgba(139, 63, 240, 0.3)',
              background: 'rgba(139, 63, 240, 0.1)',
              color: '#374151',
              fontSize: '11px',
              fontWeight: '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 63, 240, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(139, 63, 240, 0.1)'}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div style={{
        padding: '12px 14px',
        background: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <input 
          type="text"
          placeholder="Ask Copilot e.g. 'Transfer ₹200 to John for rent'"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          disabled={isProcessing}
          style={{
            flex: 1,
            background: 'rgba(0, 0, 0, 0.03)',
            border: '1px solid rgba(139, 63, 240, 0.25)',
            borderRadius: '12px',
            padding: '10px 14px',
            color: '#111827',
            fontSize: '13px',
            outline: 'none'
          }}
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputVal.trim() || isProcessing}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            border: 'none',
            background: inputVal.trim() && !isProcessing
              ? 'linear-gradient(135deg, #6739b6 0%, #8b3ff0 100%)' 
              : 'rgba(0, 0, 0, 0.04)',
            color: '#111827',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputVal.trim() && !isProcessing ? 'pointer' : 'default',
            boxShadow: inputVal.trim() && !isProcessing ? '0 0 12px rgba(139, 63, 240, 0.4)' : 'none'
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
