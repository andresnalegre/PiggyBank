import React, { useState } from 'react';
import TransactionItem from './TransactionItem';
import { FaFilter, FaTimes, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import './TransactionList.css';

function TransactionList({ transactions, onDelete, onUpdate }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTransactions = transactions.filter(transaction => {
    if (!startDate && !endDate) return true;
    const transactionDate = new Date(transaction.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && end) return transactionDate >= start && transactionDate <= end;
    if (start) return transactionDate >= start;
    if (end) return transactionDate <= end;
    return true;
  });

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const exportToExcel = () => {
    const dataToExport = filteredTransactions.map(t => ({
      Date: new Date(t.date).toLocaleDateString('en-US'),
      Description: t.description,
      Amount: `$ ${Math.abs(t.amount).toFixed(2)}`,
      Type: t.amount >= 0 ? 'Income' : 'Expense',
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, `piggy_bank_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const clearFilters = () => { setStartDate(''); setEndDate(''); };

  return (
    <div className="tlist-card">
      <div className="tlist-header">
        <h4 className="tlist-title">Transaction History</h4>
        <div className="tlist-actions">
          <button className="tlist-btn export-btn" onClick={exportToExcel}>
            <FaFileExcel size={12} /> Export
          </button>
          <button
            className={`tlist-btn ${showFilters ? 'filter-active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter size={11} /> Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-field">
            <label className="filter-label">From</label>
            <input
              type="date"
              className="filter-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="filter-field">
            <label className="filter-label">To</label>
            <input
              type="date"
              className="filter-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <button className="filter-clear" onClick={clearFilters}>
            <FaTimes size={11} /> Clear
          </button>
        </div>
      )}

      <p className="tlist-count">
        {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
        {(startDate || endDate) && ' · filtered'}
      </p>

      {sortedTransactions.length === 0 ? (
        <div className="tlist-empty">No transactions yet</div>
      ) : (
        <ul className="tlist-items">
          {sortedTransactions.map(transaction => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default TransactionList;