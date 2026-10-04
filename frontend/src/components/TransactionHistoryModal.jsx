import React, { useState, useMemo } from 'react';
import { X, Search, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const TransactionHistoryModal = ({ isOpen, onClose, transactions, onSelectContactToPay }) => {
  const [txSearch, setTxSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const formatAmount = (num) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(num);
  };

  const uniqueCategories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return ["ALL", ...Array.from(cats)];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchCat = selectedCategory === "ALL" || tx.category === selectedCategory;
      const matchSearch = tx.title.toLowerCase().includes(txSearch.toLowerCase()) || 
                          (tx.subtitle || "").toLowerCase().includes(txSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [transactions, txSearch, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: '#ffffff', borderRadius: '24px', width: '90%', maxWidth: '500px', height: '80vh',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px', background: '#111827', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>Transaction History</h2>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>Real-time settled transfers & receipts</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        {/* Filters */}
        <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={txSearch}
              onChange={(e) => setTxSearch(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px',
                padding: '10px 12px 10px 36px', color: '#111827', fontSize: '14px', outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {uniqueCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 12px', borderRadius: '20px', border: '1px solid',
                  borderColor: selectedCategory === cat ? '#3b82f6' : '#e5e7eb',
                  background: selectedCategory === cat ? '#eff6ff' : '#ffffff',
                  color: selectedCategory === cat ? '#2563eb' : '#4b5563',
                  fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#f9fafb' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredTransactions.map(tx => {
              const isDebit = tx.type === 'debit';
              return (
                <div key={tx.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px', borderRadius: '16px', background: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '12px',
                      background: isDebit ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isDebit ? '#f43f5e' : '#10b981'
                    }}>
                      {isDebit ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827', marginBottom: '2px' }}>{tx.title}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{tx.subtitle || tx.date} • {tx.category}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '15px', fontWeight: '800', fontFamily: 'Outfit, sans-serif',
                        color: isDebit ? '#111827' : '#10b981'
                      }}>
                        {isDebit ? "-" : "+"}{formatAmount(tx.amount)}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{tx.status || 'Settled'}</div>
                    </div>
                    {isDebit && (
                      <button
                        onClick={() => {
                          onSelectContactToPay({ name: tx.title, recentAmount: tx.amount, id: 'tx-'+tx.id });
                          onClose();
                        }}
                        style={{
                          padding: '6px 12px', borderRadius: '8px', background: '#111827', color: '#ffffff',
                          border: 'none', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
                        }}
                      >
                        Pay Again
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {filteredTransactions.length === 0 && (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 20px', fontSize: '14px' }}>
                No transactions match your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
