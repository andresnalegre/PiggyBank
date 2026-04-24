import React, { useState } from 'react';
import './AddTransaction.css';

function AddTransaction({ onAdd }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isExpense, setIsExpense] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !date) return;

    const raw = parseFloat(parseFloat(amount).toFixed(2));
    if (isNaN(raw) || raw <= 0) return;

    onAdd({
      description,
      amount: isExpense ? -Math.abs(raw) : Math.abs(raw),
      date: new Date(date).toISOString().split('T')[0],
    });

    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsExpense(true);
  };

  return (
    <div className="add-card">
      <h4 className="add-card-title">New Transaction</h4>
      <form onSubmit={handleSubmit}>
        <div className="add-field">
          <label className="add-label">Type</label>
          <div className="add-toggle">
            <button
              type="button"
              className={`add-toggle-btn expense ${isExpense ? 'active' : ''}`}
              onClick={() => setIsExpense(true)}
            >
              − Expense
            </button>
            <button
              type="button"
              className={`add-toggle-btn income ${!isExpense ? 'active' : ''}`}
              onClick={() => setIsExpense(false)}
            >
              + Income
            </button>
          </div>
        </div>
        <div className="add-field">
          <label className="add-label">Date</label>
          <input
            type="date"
            className="add-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="add-field">
          <label className="add-label">Description</label>
          <input
            type="text"
            className="add-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Grocery shopping"
          />
        </div>
        <div className="add-field">
          <label className="add-label">Amount ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="add-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <button type="submit" className={`add-btn ${isExpense ? 'expense' : 'income'}`}>
          Add {isExpense ? 'Expense' : 'Income'}
        </button>
      </form>
    </div>
  );
}

export default AddTransaction;