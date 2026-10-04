const API_BASE = 'http://127.0.0.1:5000/api';

export const ADMIN_USER = {
  name: "System Admin",
  phone: "+1 4444455555",
  normalizedPhone: "14444455555",
  password: "221108",
  role: "ADMIN",
  avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Admin",
  createdAt: new Date().toISOString()
};

export const normalizePhone = (rawPhone = "") => {
  return rawPhone.replace(/\D/g, "");
};

// --- READS (Now return Promises) ---

export const getStoredUsers = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/users`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.error(e);
  }
  return [ADMIN_USER];
};

export const findUserByPhone = async (phoneInput) => {
  const norm = normalizePhone(phoneInput);
  if (!norm) return null;
  if (norm.includes("4444455555")) return ADMIN_USER;
  
  try {
    const res = await fetch(`${API_BASE}/user?phone=${encodeURIComponent(phoneInput)}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.error(e);
  }
  return null;
};

export const deleteUserAccount = async (phone) => {
  try {
    const res = await fetch(`${API_BASE}/user?phone=${encodeURIComponent(phone)}`, {
      method: 'DELETE'
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.error(e);
  }
  return { success: false };
};

export const searchUsersByPhone = async (phoneQuery) => {
  const users = await getStoredUsers();
  const query = normalizePhone(phoneQuery);
  return users.filter(u => u.role !== 'ADMIN' && normalizePhone(u.phone).includes(query));
};

export const getUserTransactions = async (phone) => {
  try {
    const res = await fetch(`${API_BASE}/transactions?phone=${encodeURIComponent(phone)}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.error(e);
  }
  return [];
};

export const getAdminRequests = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/requests`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.error(e);
  }
  return [];
};

// --- WRITES (Fire and forget, or awaited) ---

export const updateUserInStore = async (updatedUser) => {
  try {
    await fetch(`${API_BASE}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser)
    });
  } catch (e) {
    console.error(e);
  }
};

export const saveUserTransaction = async (transaction) => {
  try {
    await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: transaction.userPhone, transaction })
    });
  } catch (e) {
    console.error(e);
  }
};

export const addAdminRequest = async (requestData) => {
  requestData.id = "req_" + Date.now();
  requestData.timestamp = new Date().toISOString();
  if (!requestData.status) requestData.status = 'PENDING';
  try {
    await fetch(`${API_BASE}/admin/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });
  } catch (e) {
    console.error(e);
  }
  return { success: true };
};

export const updateAdminRequest = async (id, updates) => {
  try {
    await fetch(`${API_BASE}/admin/requests`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, update_data: updates })
    });
  } catch (e) {
    console.error(e);
  }
};

export const wipeAllData = async () => {
  sessionStorage.removeItem("bheeshma_session_phone");
  sessionStorage.removeItem("bheeshma_session_expiry");
  try {
    await fetch(`${API_BASE}/wipe`, { method: 'POST' });
  } catch (e) {
    console.error(e);
  }
};

// --- COMPLEX BUSINESS LOGIC WRAPPERS ---

export const loginWebsiteUser = async (phone, password) => {
  const user = await findUserByPhone(phone);
  if (!user) return { error: "User not found." };
  if (user.password !== password) return { error: "Incorrect password." };
  
  createWebsiteSession(user);
  return { success: true, user };
};

export const createWebsiteSession = async (user) => {
  const sessionId = Date.now().toString() + "_" + Math.random().toString(36).substring(7);
  if (user.role === 'ADMIN') {
    sessionStorage.setItem("bheeshma_admin_session_phone", user.phone);
    sessionStorage.setItem("bheeshma_admin_session_expiry", Date.now() + (7 * 24 * 60 * 60 * 1000));
  } else {
    localStorage.setItem("bheeshma_session_phone", user.phone);
    localStorage.setItem("bheeshma_session_expiry", Date.now() + (7 * 24 * 60 * 60 * 1000));
    localStorage.setItem("bheeshma_session_id", sessionId);
    await updateUserInStore({ ...user, sessionId });
  }
};

export const logoutWebsiteSession = () => {
  sessionStorage.removeItem("bheeshma_admin_session_phone");
  sessionStorage.removeItem("bheeshma_admin_session_expiry");
  localStorage.removeItem("bheeshma_session_phone");
  localStorage.removeItem("bheeshma_session_expiry");
  localStorage.removeItem("bheeshma_session_id");
};

export const INITIAL_CONTACTS = [];
export const MONTHLY_BUDGETS = [];
export const UPCOMING_SCHEDULED_BILLS = [];

export const deleteWebsiteAccount = async (phone) => {
  // Can implement DB deletion if needed
  await wipeAllData(); 
};

export const checkSessionValidity = async () => {
  // Check admin session (tab-specific) first
  const adminPhone = sessionStorage.getItem("bheeshma_admin_session_phone");
  const adminExpiry = sessionStorage.getItem("bheeshma_admin_session_expiry");
  
  if (adminPhone && adminExpiry && Date.now() < parseInt(adminExpiry)) {
    const adminUser = await findUserByPhone(adminPhone);
    if (adminUser) return { isValid: true, user: adminUser };
  }

  // Fallback to user session (global)
  const phone = localStorage.getItem("bheeshma_session_phone");
  const expiry = localStorage.getItem("bheeshma_session_expiry");
  const localSessionId = localStorage.getItem("bheeshma_session_id");
  
  if (!phone || !expiry || Date.now() > parseInt(expiry)) {
    return { isValid: false, user: null };
  }
  const user = await findUserByPhone(phone);
  if (!user) return { isValid: false, user: null };

  if (user.sessionId && localSessionId && user.sessionId !== localSessionId) {
    logoutWebsiteSession();
    return { isValid: false, user: null, reason: 'multi_device' };
  }

  return { isValid: true, user };
};

export const openBankAccountForUser = async (phoneOrUser, formData) => {
  const phone = typeof phoneOrUser === 'string' ? phoneOrUser : phoneOrUser.phone;
  let user = await findUserByPhone(phone);
  if (!user) {
    if (typeof phoneOrUser === 'object') {
       user = phoneOrUser;
    } else {
       return { error: "User not found" };
    }
  }
  if (user.accounts && user.accounts.length > 0) return { success: true, user, alreadyExists: true };
  
  const initialDeposit = formData?.initialDeposit ? Number(formData.initialDeposit) : 0;
  user.accounts = [{
    id: "acc_" + Math.random().toString(36).substr(2, 9),
    bankName: "Bheeshma Bank",
    accountNumber: "BHEESHMA" + Math.floor(100000000 + Math.random() * 900000000),
    balance: initialDeposit,
    isPrimary: true
  }];
  user.hasBankAccount = true;
  user.accountRequested = false;
  user.showAccountCreatedModal = true;
  await updateUserInStore(user);
  
  if (initialDeposit > 0) {
    await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: phone,
        transaction: {
          id: "tx_" + Date.now(),
          userPhone: phone,
          type: "credit",
          amount: initialDeposit,
          title: "Initial Deposit",
          category: "Deposit",
          merchant: "Bheeshma Bank",
          timestamp: new Date().toISOString(),
          status: "completed"
        }
      })
    });
  }
  
  return { success: true, user };
};

export const deleteBankAccountForUser = async (phone, accountId) => {
  const user = await findUserByPhone(phone);
  if (user && user.accounts) {
    user.accounts = user.accounts.filter(a => a.id !== accountId);
    await updateUserInStore(user);
  }
  return { success: true, user };
};

export const addMoneyToUserAccount = async (phone, amount, source) => {
  const user = await findUserByPhone(phone);
  if (!user || !user.accounts || user.accounts.length === 0) return { error: "No account found" };
  
  user.accounts[0].balance += Number(amount);
  user.pendingDepositAlert = Number(amount);
  await updateUserInStore(user);
  
  const tx = {
    id: "tx_" + Date.now(),
    userPhone: phone,
    type: "credit",
    amount: Number(amount),
    title: "Deposit",
    category: "Deposit",
    merchant: source || "Admin",
    timestamp: new Date().toISOString(),
    status: "completed"
  };
  await saveUserTransaction(tx);
  return { success: true };
};

export const toggleTransactionLock = async (user, txId) => {
  if (!user.transactions) return; // Note: transactions are stored separately now, so this is deprecated unless passed via prop
};

export const logMpinFailure = async (phone) => {
  const user = await findUserByPhone(phone);
  if (!user) return;
  const currentFails = user.mpinFailures || 0;
  user.mpinFailures = currentFails + 1;
  if (user.mpinFailures >= 3) {
    user.accountStatus = 'BLOCKED';
    const newAlert = {
      id: `fraud_${Date.now()}`,
      amount: 0,
      recipient: 'System Security',
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      reason: "Too many failed MPIN attempts.",
      status: 'ACTION_REQUIRED'
    };
    user.pendingFraudAlert = newAlert;
    user.fraudHistory = [...(user.fraudHistory || []), newAlert];
  }
  await updateUserInStore(user);
};

export const registerUserInStore = updateUserInStore;
export const requestBankAccountOpen = async (user, formData) => {
  if (!user || !user.phone) return { error: "User not found" };
  
  await addAdminRequest({
    type: "ACCOUNT_PROVISIONING",
    userPhone: user.phone,
    userName: user.name,
    data: formData,
    status: "PENDING"
  });

  user.accountRequested = true;
  await updateUserInStore(user);
  
  return { success: true, user };
};
