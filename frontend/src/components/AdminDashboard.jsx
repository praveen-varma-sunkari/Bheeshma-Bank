import React, { useState, useEffect } from 'react';
import { getAdminRequests, updateAdminRequest, openBankAccountForUser, findUserByPhone, addMoneyToUserAccount, updateUserInStore, getStoredUsers, deleteUserAccount } from '../data/mockData';
import { ShieldCheck, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export const AdminDashboard = ({ onLogout }) => {
  const [requests, setRequests] = useState([]);
  const [globalApiKey, setGlobalApiKey] = useState(localStorage.getItem('admin_gemini_api_key') || '');
  const [savedKey, setSavedKey] = useState(false);
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'users'
  const [selectedUser, setSelectedUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [dashboardError, setDashboardError] = useState("");

  const showError = (msg) => {
    setDashboardError(msg);
    setTimeout(() => setDashboardError(""), 6000);
  };

  const handleDeleteUser = async (userPhone) => {
    if (window.confirm("Are you sure you want to permanently delete this user? This action cannot be undone and will wipe out all their data!")) {
      await deleteUserAccount(userPhone);
      const users = await getStoredUsers();
      setAllUsers(users.filter(u => u.role !== 'ADMIN'));
      setSelectedUser(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setRequests(await getAdminRequests());
      if (activeTab === 'users') {
        const users = await getStoredUsers();
        setAllUsers(users.filter(u => u.role !== 'ADMIN'));
      }
    };
    
    // Poll for new requests every 3 seconds for demo purposes
    const interval = setInterval(fetchData, 3000);
    fetchData(); // Initial load
    
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleApproveAccount = async (req) => {
    // Open the bank account for user
    const res = await openBankAccountForUser(req.userPhone, req.data);
    if (!res.error) {
      await updateAdminRequest(req.id, { status: 'APPROVED' });
      setRequests(await getAdminRequests());
    } else {
      showError("Failed to approve: " + res.error + ". This usually happens if the user's base account was deleted or corrupted.");
    }
  };

  const handleRejectAccount = async (req) => {
    await updateAdminRequest(req.id, { status: 'REJECTED' });
    setRequests(await getAdminRequests());
  };

  const handleApproveDeposit = async (req) => {
    const res = await addMoneyToUserAccount(req.userPhone, req.data.amount, req.data.source);
    if (!res.error) {
      await updateAdminRequest(req.id, { status: 'APPROVED' });
      setRequests(await getAdminRequests());
    } else {
      showError("Failed to approve deposit: " + res.error);
    }
  };

  const handleUnblockUser = async (req) => {
    const user = await findUserByPhone(req.userPhone);
    if (user) {
      await updateUserInStore({ ...user, accountStatus: 'ACTIVE', pendingFraudAlert: null });
    }
    await updateAdminRequest(req.id, { status: 'UNBLOCKED' });
    setRequests(await getAdminRequests());
  };

  const handleKeepBlocked = async (req) => {
    await updateAdminRequest(req.id, { status: 'KEPT_BLOCKED' });
    setRequests(await getAdminRequests());
  };

  const handleGenerateResetPin = async (req) => {
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    await updateAdminRequest(req.id, { status: 'PIN_GENERATED', generatedPin: pin, expiresAt: Date.now() + 10 * 60 * 1000 });
    setRequests(await getAdminRequests());
  };

  return (
    <div style={{ padding: '24px', color: '#111827', background: '#f4f6f8', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', color: '#111827', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={32} /> Bheeshma Admin Console
        </h1>
        <button onClick={onLogout} style={{ padding: '8px 16px', background: 'rgba(255,0,0,0.2)', border: '1px solid red', color: 'red', borderRadius: '8px', cursor: 'pointer' }}>
          Logout Admin
        </button>
      </div>

      {/* Global AI Config Section */}
      <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '12px', color: '#111827' }}>Global AI Configuration</h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
          Enter the Gemini API Key to power AI Chat, Fraud Detection, and Insights for ALL users.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="password"
            value={globalApiKey}
            onChange={(e) => setGlobalApiKey(e.target.value)}
            placeholder="AIzaSy..."
            style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }}
          />
          <button 
            onClick={async () => {
              localStorage.setItem('admin_gemini_api_key', globalApiKey);
              localStorage.setItem('bank_agent_api_key', globalApiKey);
              localStorage.setItem('bheeshma_gemini_api_key', globalApiKey);
              try {
                await fetch('http://localhost:5000/api/settings', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ apiKey: globalApiKey })
                });
              } catch (err) {
                console.error("Failed to sync API key to backend", err);
              }
              setSavedKey(true);
              setTimeout(() => setSavedKey(false), 2000);
            }}
            style={{ padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {savedKey ? "Saved!" : "Save Global Key"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button onClick={() => { setActiveTab('requests'); setSelectedUser(null); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: activeTab === 'requests' ? '#111827' : '#e5e7eb', color: activeTab === 'requests' ? '#fff' : '#4b5563', cursor: 'pointer', fontWeight: 'bold' }}>
          Action Center
        </button>
        <button onClick={() => { setActiveTab('users'); setSelectedUser(null); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: activeTab === 'users' ? '#111827' : '#e5e7eb', color: activeTab === 'users' ? '#fff' : '#4b5563', cursor: 'pointer', fontWeight: 'bold' }}>
          Registered Users
        </button>
      </div>

      {dashboardError && (
        <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle size={24} />
          <div style={{ fontWeight: '500' }}>{dashboardError}</div>
        </div>
      )}

      {activeTab === 'requests' && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {requests.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No pending admin requests.</p>
        ) : (
          requests.map(req => (
            <div key={req.id} style={{ background: '#ffffff', border: '1px solid #e5e7eb', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold', color: '#111827' }}>[{req.type}]</span>
                <span style={{ color: '#6b7280', fontSize: '12px' }}>{new Date(req.timestamp).toLocaleString()}</span>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <p><strong>User:</strong> {req.userName} ({req.userPhone})</p>
                {req.type === 'ACCOUNT_PROVISIONING' && (
                  <div style={{ fontSize: '12px', color: '#4b5563', marginTop: '4px' }}>
                    Data: {req.data.idType} - {req.data.idNumber} | Deposit: ${req.data.initialDeposit}
                  </div>
                )}
                {req.type === 'MPIN_CREATION_FAILED' && (
                  <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '4px' }}>
                    Reason: {req.data.reason} | DOB: {req.data.dob} | Attempted MPIN: {req.data.mpin}
                  </div>
                )}
                {req.type === 'ADD_MONEY_DEPOSIT' && (
                  <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px', fontWeight: 'bold' }}>
                    Deposit Request: {req.data.currency || '₹'}{req.data.amount} from {req.data.source}
                  </div>
                )}
                {req.type === 'FRAUD_DETECTED' && (
                  <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                    Amount: ${req.data.amount} | Time: {req.data.time} | User blocked.
                  </div>
                )}
                {req.type === 'FORGOT_CREDENTIALS' && (
                  <div style={{ fontSize: '12px', color: '#3b82f6', marginTop: '4px' }}>
                    Requesting reset PIN for: {req.data.type}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                {req.status === 'PENDING' && req.type === 'ACCOUNT_PROVISIONING' && (
                  <>
                    <button onClick={() => handleApproveAccount(req)} style={{ padding: '6px 12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Accept (Open Account)</button>
                    <button onClick={() => handleRejectAccount(req)} style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Reject</button>
                  </>
                )}

                {req.status === 'PENDING' && req.type === 'ADD_MONEY_DEPOSIT' && (
                  <>
                    <button onClick={() => handleApproveDeposit(req)} style={{ padding: '6px 12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Approve Deposit</button>
                    <button onClick={() => handleRejectAccount(req)} style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Reject</button>
                  </>
                )}
                
                {req.status === 'PENDING' && req.type === 'FRAUD_DETECTED' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleUnblockUser(req)} style={{ padding: '6px 12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Verify & Unblock Account</button>
                    <button onClick={() => handleKeepBlocked(req)} style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Keep in Block</button>
                  </div>
                )}

                {req.status === 'KEPT_BLOCKED' && req.type === 'FRAUD_DETECTED' && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: '#ef4444', fontStyle: 'italic', marginRight: '8px' }}>Status: {req.status}</span>
                    <button onClick={() => handleUnblockUser(req)} style={{ padding: '6px 12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Unblock Account</button>
                  </div>
                )}

                {(!req.status || req.status === 'PENDING') && req.type === 'FORGOT_CREDENTIALS' && (
                  <button onClick={() => handleGenerateResetPin(req)} style={{ padding: '6px 12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Generate Reset PIN</button>
                )}

                {req.status === 'PIN_GENERATED' && (
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>Generated PIN: {req.generatedPin} (Expires in 10m)</span>
                )}

                {req.status !== 'PENDING' && req.status !== 'PIN_GENERATED' && req.status !== 'LOG' && req.status !== 'KEPT_BLOCKED' && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ color: '#6b7280', fontStyle: 'italic' }}>Status: {req.status || 'UNKNOWN'}</span>
                    <button onClick={() => handleRejectAccount(req)} style={{ padding: '4px 10px', background: '#e5e7eb', color: '#4b5563', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Dismiss</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      )}

      {activeTab === 'users' && !selectedUser && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {allUsers.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No users registered yet.</p>
          ) : (
            allUsers.map(u => (
              <div 
                key={u.phone} 
                onClick={() => setSelectedUser(u)}
                style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
              >
                <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111827' }}>{u.name}</h3>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#4b5563' }}><strong>Phone:</strong> {u.phone}</p>
                <p style={{ margin: '0', fontSize: '14px', color: '#4b5563' }}><strong>Status:</strong> <span style={{ color: u.accountStatus === 'BLOCKED' ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>{u.accountStatus}</span></p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'users' && selectedUser && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
          <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' }}>&larr; Back to Users List</button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '24px', margin: 0, color: '#111827' }}>User Profile: {selectedUser.name}</h2>
            <button 
              onClick={() => handleDeleteUser(selectedUser.phone)}
              style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Delete Account
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '30px' }}>
            <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Account Status:</strong> {selectedUser.accountStatus}</p>
              <p><strong>Created At:</strong> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : 'Unknown'}</p>
            </div>
            <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
              <p><strong>Password Set:</strong> {selectedUser.password ? 'Yes' : 'No'}</p>
              <p><strong>MPIN Set:</strong> {selectedUser.mpin ? 'Yes' : 'No'}</p>
              <p><strong>Bank Account:</strong> {selectedUser.hasBankAccount ? 'Active' : 'Not Provisioned'}</p>
            </div>
          </div>

          <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#111827' }}>Detailed Activity & Requests Log</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {requests.filter(r => r.userPhone === selectedUser.phone).length === 0 ? (
              <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No logged activity for this user.</p>
            ) : (
              requests.filter(r => r.userPhone === selectedUser.phone).map(req => (
                <div key={req.id} style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>{req.type.replace(/_/g, ' ')}</span>
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>{new Date(req.timestamp).toLocaleString()}</span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#4b5563' }}>
                    <strong>Status:</strong> {req.status}
                    <div style={{ marginTop: '8px', padding: '8px', background: '#f4f6f8', borderRadius: '6px', fontSize: '12px' }}>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{JSON.stringify(req.data, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
