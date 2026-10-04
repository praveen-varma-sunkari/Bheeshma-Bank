import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react';
import { TransactionReceiptModal } from './TransactionReceiptModal';

export const TransactionHistoryPage = ({ transactions, onSelectContactToPay, onBack }) => {
  const [txSearch, setTxSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [receiptTx, setReceiptTx] = useState(null);

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

  return (
    <div style={{
      background: '#f9fafb', minHeight: '100%', display: 'flex', flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '24px', background: '#111827', color: '#fff', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 10
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>Transaction History</h2>
          <div style={{ fontSize: '13px', color: '#9ca3af' }}>Real-time settled transfers & receipts</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: '16px 24px', background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={txSearch}
            onChange={(e) => setTxSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '12px',
              padding: '12px 14px 12px 42px', color: '#111827', fontSize: '15px', outline: 'none'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {uniqueCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px', borderRadius: '20px', border: '1px solid',
                borderColor: selectedCategory === cat ? '#3b82f6' : '#e5e7eb',
                background: selectedCategory === cat ? '#eff6ff' : '#ffffff',
                color: selectedCategory === cat ? '#2563eb' : '#4b5563',
                fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger List */}
      <div style={{ flex: 1, padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '800px', margin: '0 auto' }}>
          {filteredTransactions.map(tx => {
            const isDebit = tx.type === 'debit';
            const txDate = tx.timestamp 
              ? new Date(tx.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
              : tx.date || 'N/A';
            return (
              <div key={tx.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px', borderRadius: '16px', background: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: isDebit ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isDebit ? '#f43f5e' : '#10b981'
                  }}>
                    {isDebit ? <ArrowUpRight size={22} /> : <ArrowDownLeft size={22} />}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>{tx.title}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span>{tx.subtitle || 'Transfer'} • {tx.category}</span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>{txDate}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '17px', fontWeight: '800', fontFamily: 'Outfit, sans-serif',
                      color: isDebit ? '#111827' : '#10b981'
                    }}>
                      {isDebit ? "-" : "+"}{formatAmount(tx.amount)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{tx.status || 'Settled'}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <button
                      onClick={() => setReceiptTx(tx)}
                      style={{
                        padding: '6px 12px', borderRadius: '8px', background: '#f3f4f6', color: '#4b5563',
                        border: '1px solid #d1d5db', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      <FileText size={14} /> Receipt
                    </button>
                    {isDebit && (
                      <button
                        onClick={() => onSelectContactToPay({ name: tx.title, recentAmount: tx.amount, id: 'tx-'+tx.id })}
                        style={{
                          padding: '6px 12px', borderRadius: '8px', background: '#111827', color: '#ffffff',
                          border: 'none', fontSize: '12px', fontWeight: '700', cursor: 'pointer'
                        }}
                      >
                        Pay Again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filteredTransactions.length === 0 && (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '60px 20px', fontSize: '15px' }}>
              No transactions match your search.
            </div>
          )}
        </div>
      </div>

      <TransactionReceiptModal 
        isOpen={!!receiptTx} 
        onClose={() => setReceiptTx(null)} 
        transaction={receiptTx} 
      />
    </div>
  );
};
