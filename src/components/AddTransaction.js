import React, { useState } from 'react';

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
      date: new Date(date).toISOString().split('T')[0]
    });

    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title mb-3">Add Transaction</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
            <small className="text-muted">
              Use negative numbers (-) for expenses and positive for income
            </small>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTransaction;