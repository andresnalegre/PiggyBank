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

    if (start && end) {
      return transactionDate >= start && transactionDate <= end;
    } else if (start) {
      return transactionDate >= start;
    } else if (end) {
      return transactionDate <= end;
    }
    return true;
  });

  const exportToExcel = () => {
    const dataToExport = filteredTransactions.map(transaction => ({
      Date: new Date(transaction.date).toLocaleDateString('en-US'),
      Description: transaction.description,
      Amount: `$ ${Math.abs(transaction.amount).toFixed(2)}`,
      Type: transaction.amount >= 0 ? 'Income' : 'Expense'
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");

    const fileName = `piggy_bank_transactions_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="card-title mb-0">Transaction History</h4>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-success btn-sm"
              onClick={exportToExcel}
              title="Export to Excel"
            >
              <FaFileExcel className="me-1" />
              Export
            </button>
            <button 
              className={`btn btn-sm ${showFilters ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="me-1" />
              Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-light p-3 rounded mb-3">
            <div className="row g-2">
              <div className="col-md-5">
                <label className="form-label small">Start Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="col-md-5">
                <label className="form-label small">End Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button 
                  className="btn btn-sm btn-secondary w-100"
                  onClick={clearFilters}
                  title="Clear filters"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="small text-muted mb-3">
          {filteredTransactions.length} transactions found
          {(startDate || endDate) && (
            <span className="ms-2">
              (filtered by period)
            </span>
          )}
        </div>

        {sortedTransactions.length === 0 ? (
          <p className="text-muted text-center">No transactions found</p>
        ) : (
          <ul className="list-group">
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
    </div>
  );
}

export default TransactionList;