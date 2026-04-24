import React from 'react';
import './Balance.css';

function Balance({ transactions, filteredTransactions, isFiltered }) {
  const displayList = isFiltered ? filteredTransactions : transactions;
  const total = displayList.reduce((acc, curr) => acc + curr.amount, 0);
  const income = displayList.filter(t => t.amount > 0).reduce((acc, curr) => acc + curr.amount, 0);
  const expenses = displayList.filter(t => t.amount < 0).reduce((acc, curr) => acc + curr.amount, 0);
  const isPositive = total >= 0;

  return (
    <div className="balance-card">
      <p className="balance-label">{isFiltered ? 'Filtered Balance' : 'Current Balance'}</p>
      <h2 className={`balance-amount ${isPositive ? 'positive' : 'negative'}`}>
        <span className="balance-currency">$</span>
        {Math.abs(total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        {!isPositive && <span className="balance-sign">−</span>}
      </h2>
      {isFiltered && (
        <div className="balance-stats">
          <div className="balance-stat">
            <span className="stat-dot income-dot" />
            <span className="stat-label">Income</span>
            <span className="stat-value income-value">+${income.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="balance-divider" />
          <div className="balance-stat">
            <span className="stat-dot expense-dot" />
            <span className="stat-label">Expenses</span>
            <span className="stat-value expense-value">${Math.abs(expenses).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Balance;