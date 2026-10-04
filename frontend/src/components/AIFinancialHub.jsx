import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, ShieldAlert, Activity, 
  TrendingDown, TrendingUp, PieChart, Target, AlertCircle, 
  CheckCircle2, ArrowRight, Zap, Coffee, ShoppingBag, Home,
  Loader2, Bell, ArrowLeft, Sparkles
} from 'lucide-react';



const DailyExpenses = ({ data, loading, onTrack }) => {
  const getIcon = (name) => {
    switch(name) {
      case 'Coffee': return <Coffee size={14} />;
      case 'ShoppingBag': return <ShoppingBag size={14} />;
      case 'Home': return <Home size={14} />;
      default: return <Activity size={14} />;
    }
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PieChart size={24} color="#3b82f6" />
          Tracked Expense Breakdown
        </h3>
        <button onClick={onTrack} disabled={loading} style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: loading ? 0.7 : 1 }}>
          <Sparkles size={14} /> Track
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px', color: '#94a3b8' }}>
          <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={32} />
        </div>
      ) : !data || (!data.trackedSpend && (!data.distribution || data.distribution.length === 0)) ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '16px' }}>
          <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>No expenses made</div>
          <div style={{ fontSize: '13px' }}>You haven't made any transactions yet. Great job saving!</div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
            <div style={{ flex: '1 1 200px', padding: '20px', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', borderRadius: '16px', border: '1px solid #bae6fd' }}>
              <div style={{ fontSize: '13px', color: '#0369a1', fontWeight: '600', marginBottom: '4px' }}>Total Tracked Spend</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>{data.trackedSpend}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: data.trendStr?.includes('-') ? '#10b981' : '#ef4444', marginTop: '8px', fontWeight: '600' }}>
                {data.trendStr?.includes('-') ? <TrendingDown size={14} /> : <TrendingUp size={14} />} {data.trendStr}
              </div>
            </div>

            <div style={{ flex: '1 1 200px', padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600', marginBottom: '12px' }}>Distribution</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(data.distribution || []).map(cat => (
                  <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: cat.color || '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {getIcon(cat.iconName)}
                    </div>
                    <div style={{ flex: 1, fontSize: '12px', fontWeight: '600', color: '#334155' }}>{cat.name}</div>
                    <div style={{ fontSize: '12px', fontWeight: '800' }}>{cat.percent}</div>
                  </div>
                ))}
                {(!data.distribution || data.distribution.length === 0) && (
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>No data available</div>
                )}
              </div>
            </div>
          </div>

          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#64748b', marginBottom: '12px' }}>Recent Outflows</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(data.recentOutflows || []).map((tx, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{tx.name}</div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{tx.amount}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{tx.time}</div>
                </div>
              </div>
            ))}
            {(!data.recentOutflows || data.recentOutflows.length === 0) && (
              <div style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>No recent outflows found.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const WasteTracker = ({ data, loading, onTrack }) => {
  return (
    <div style={{ background: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={24} color="#8b5cf6" />
          Smart Waste & Leak Detector
        </h3>
        <button onClick={onTrack} disabled={loading} style={{ padding: '8px 16px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: loading ? 0.7 : 1 }}>
          <Sparkles size={14} /> Track
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px', color: '#94a3b8' }}>
          <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={32} />
        </div>
      ) : !data || (!data.potentialSavings && (!data.insights || data.insights.length === 0)) ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '16px' }}>
          <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>No money wasted</div>
          <div style={{ fontSize: '13px' }}>We couldn't detect any lifestyle creep or unused subscriptions.</div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: 1, padding: '16px', background: 'rgba(139,92,246,0.05)', borderRadius: '16px', border: '1px solid rgba(139,92,246,0.1)' }}>
              <div style={{ fontSize: '12px', color: '#6d28d9', fontWeight: '700', marginBottom: '4px' }}>Potential Monthly Savings</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#1e293b' }}>{data.potentialSavings || '$0.00'}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>By trimming detected waste</div>
            </div>
          </div>

          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#64748b', marginBottom: '12px' }}>Actionable Insights</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(data.insights || []).map((insight, idx) => (
              <div key={idx} style={{ 
                padding: '16px', borderRadius: '16px', 
                background: insight.type === 'CREEP' ? '#fef2f2' : '#fdf4ff', 
                border: `1px solid ${insight.type === 'CREEP' ? '#fecaca' : '#fbcfe8'}` 
              }}>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', 
                  color: insight.type === 'CREEP' ? '#ef4444' : '#d946ef', 
                  fontWeight: '700', fontSize: '13px', marginBottom: '8px' 
                }}>
                  {insight.type === 'CREEP' ? <Activity size={16} /> : <Target size={16} />} 
                  {insight.title}
                </div>
                <div style={{ 
                  fontSize: '13px', 
                  color: insight.type === 'CREEP' ? '#7f1d1d' : '#831843', 
                  lineHeight: '1.5',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div dangerouslySetInnerHTML={{ __html: insight.desc }} />
                  {insight.type === 'SUBSCRIPTION' && (
                    <button style={{ padding: '6px 12px', background: '#d946ef', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', marginLeft: '12px' }}>Cancel</button>
                  )}
                </div>
              </div>
            ))}
            {(!data.insights || data.insights.length === 0) && (
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                <CheckCircle2 size={24} color="#10b981" style={{ margin: '0 auto 8px' }} />
                Your spending habits look perfectly healthy!
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export const AIFinancialHub = ({ user, transactions, onBack, onResolveFraud, showToast }) => {
  const [insightData, setInsightData] = useState({ fraudAlerts: [], dailyExpenses: null, wasteTracker: null });
  const [loading, setLoading] = useState(true);
  const [expenseLoading, setExpenseLoading] = useState(false);
  const [wasteLoading, setWasteLoading] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      const apiKey = localStorage.getItem("bheeshma_gemini_api_key") || "";
      if (!apiKey) {
        setLoading(false);
        return;
      }
      try {
        const primaryAcc = (user?.accounts || []).find(a => a.isPrimary) || user?.accounts?.[0];
        const res = await fetch("http://localhost:5000/api/ai-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            apiKey,
            transactions: transactions || [],
            userContext: {
              name: user?.name || 'User',
              balance: primaryAcc ? `${user.currencySymbol || '₹'}${primaryAcc.balance}` : 'N/A'
            }
          })
        });
        if (res.ok) {
          const data = await res.json();
          setInsightData(prev => ({ ...prev, fraudAlerts: data.fraudAlerts }));
        }
      } catch (err) {
        console.error("Failed to fetch AI Insights", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [user, transactions]);

  const handleTrackExpenses = async () => {
    setExpenseLoading(true);
    const lastTxCount = Number(localStorage.getItem('bheeshma_last_tx_count')) || 0;
    
    // Send all transactions to AI so it has full context to analyze
    const currentTxCount = (transactions || []).length;
    
    if (insightData?.dailyExpenses && lastTxCount > 0 && currentTxCount === lastTxCount) {
      if (showToast) showToast("No new transactions to track since your last analysis.", "info");
      else alert("No new transactions to track since your last analysis.");
      setExpenseLoading(false);
      return;
    }

    const apiKey = localStorage.getItem("bheeshma_gemini_api_key") || "";
    if (!apiKey) { 
      if (showToast) showToast("Please configure your Gemini API Key in the Admin Dashboard first.", "error");
      else alert("Please configure your Gemini API Key in the Admin Dashboard first.");
      setExpenseLoading(false); 
      return; 
    }

    try {
      const res = await fetch("http://localhost:5000/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, transactions: transactions || [], userContext: { name: user?.name || 'User' } })
      });
      if (res.ok) {
        const data = await res.json();
        setInsightData(prev => ({ ...prev, dailyExpenses: data.dailyExpenses }));
        localStorage.setItem('bheeshma_last_tx_count', currentTxCount);
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to fetch AI insights");
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast("AI Analyst Error: " + err.message, "error");
      else alert("AI Analyst Error: " + err.message);
    } finally {
      setExpenseLoading(false);
    }
  };

  const handleTrackWaste = async () => {
    setWasteLoading(true);
    const lastTxCount = Number(localStorage.getItem('bheeshma_last_waste_tx_count')) || 0;
    
    // Send all transactions to AI so it has full context to analyze
    const currentTxCount = (transactions || []).length;
    
    if (insightData?.wasteTracker && lastTxCount > 0 && currentTxCount === lastTxCount) {
      if (showToast) showToast("No new transactions to track since your last analysis.", "info");
      else alert("No new transactions to track since your last analysis.");
      setWasteLoading(false);
      return;
    }

    const apiKey = localStorage.getItem("bheeshma_gemini_api_key") || "";
    if (!apiKey) { 
      if (showToast) showToast("Please configure your Gemini API Key in the Admin Dashboard first.", "error");
      else alert("Please configure your Gemini API Key in the Admin Dashboard first.");
      setWasteLoading(false); 
      return; 
    }

    try {
      const res = await fetch("http://localhost:5000/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, transactions: transactions || [], userContext: { name: user?.name || 'User' } })
      });
      if (res.ok) {
        const data = await res.json();
        setInsightData(prev => ({ ...prev, wasteTracker: data.wasteTracker }));
        localStorage.setItem('bheeshma_last_waste_tx_count', currentTxCount);
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to fetch AI insights");
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast("AI Analyst Error: " + err.message, "error");
      else alert("AI Analyst Error: " + err.message);
    } finally {
      setWasteLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px 16px', maxWidth: '800px', margin: '0 auto' }}>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      
      {onBack && (
        <button 
          onClick={onBack}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: 'none', border: 'none', color: '#64748b', 
            fontSize: '14px', fontWeight: '600', cursor: 'pointer',
            marginBottom: '20px', padding: '0'
          }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      )}

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '900', fontFamily: 'Outfit, sans-serif', color: '#111827', marginBottom: '8px' }}>
          AI Financial Insights
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          Real-time fraud alerts, daily expense insights & waste tracking dynamically powered by Gemini AI analyzing your real transaction history.
        </p>
      </div>

      {user?.pendingFraudAlert && (
        <div style={{ background: '#fef2f2', border: '2px solid #ef4444', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#ef4444' }}>
            <ShieldAlert size={28} />
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>ACTION REQUIRED: Fraud Detected</h3>
          </div>
          <p style={{ color: '#7f1d1d', marginBottom: '16px', fontWeight: '500' }}>
            We paused a transaction because our AI detected unusual activity. Please verify it.
          </p>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #fca5a5' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Transaction Details</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>₹{user.pendingFraudAlert.amount}</div>
            <div style={{ fontSize: '14px', color: '#4b5563', marginBottom: '4px' }}>To: <b>{user.pendingFraudAlert.recipient}</b></div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Time: {user.pendingFraudAlert.time} on {user.pendingFraudAlert.date}</div>
            
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb', fontSize: '13px', color: '#b91c1c', fontWeight: '600' }}>
              🤖 AI Reason: {user.pendingFraudAlert.reason}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
            <button onClick={() => onResolveFraud && onResolveFraud(false)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
              Something odd, not me
            </button>
            <button onClick={() => onResolveFraud && onResolveFraud(true)} style={{ background: '#fff', color: '#111827', border: '1px solid #d1d5db', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
              Yes, it was made on my concern
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <DailyExpenses data={insightData?.dailyExpenses} loading={expenseLoading} onTrack={handleTrackExpenses} />
        <WasteTracker data={insightData?.wasteTracker} loading={wasteLoading} onTrack={handleTrackWaste} />
      </div>

      {user?.fraudHistory && user.fraudHistory.length > 0 && (
        <div style={{ marginTop: '30px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} color="#ef4444" /> Past Fraud Detections
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {user.fraudHistory.map((fraud, idx) => (
              <div key={idx} style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#f9fafb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '700', color: '#111827' }}>₹{fraud.amount} to {fraud.recipient}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{fraud.date} {fraud.time}</div>
                </div>
                <div style={{ fontSize: '13px', color: '#ef4444', fontWeight: '600' }}>Reason: {fraud.reason}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
