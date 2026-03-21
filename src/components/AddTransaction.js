import React, { useState } from 'react';
import './AddTransaction.css';

function AddTransaction({ onAdd }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !date) return;

    onAdd({
      description,
      amount: parseFloat(parseFloat(amount).toFixed(2)),
      date: new Date(date).toISOString().split('T')[0],
    });

    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="add-card">
      <h4 className="add-card-title">New Transaction</h4>
      <form onSubmit={handleSubmit}>
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
            className="add-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
          <span className="add-hint">Use negative (−) for expenses, positive for income</span>
        </div>
        <button type="submit" className="add-btn">Add Transaction</button>
      </form>
    </div>
  );
}

export default AddTransaction;