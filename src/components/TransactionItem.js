import React, { useState } from 'react';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import './TransactionItem.css';

function TransactionItem({ transaction, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(transaction.description);
  const [newDate, setNewDate] = useState(transaction.date);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSubmit = () => {
    if (newDescription.trim() && newDate) {
      onUpdate(transaction.id, { ...transaction, description: newDescription.trim(), date: newDate });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setNewDescription(transaction.description);
    setNewDate(transaction.date);
    setIsEditing(false);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

  const isIncome = transaction.amount >= 0;

  if (isEditing) {
    return (
      <li className="titem">
        <div className="titem-edit">
          <input
            type="date"
            className="titem-edit-input date-input"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
          <input
            type="text"
            className="titem-edit-input desc-input"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            autoFocus
          />
          <button className="titem-edit-btn save" onClick={handleSubmit} title="Save">
            <FaCheck size={11} />
          </button>
          <button className="titem-edit-btn cancel" onClick={handleCancel} title="Cancel">
            <FaTimes size={11} />
          </button>
        </div>
      </li>
    );
  }

  return (
    <>
      <li className="titem">
        <div className="titem-left">
          <span className={`titem-dot ${isIncome ? 'income' : 'expense'}`} />
          <div className="titem-info">
            <div className="titem-desc" onClick={() => setIsEditing(true)} title="Click to edit">
              {transaction.description}
            </div>
            <div className="titem-date">{formatDate(transaction.date)}</div>
          </div>
        </div>
        <div className="titem-right">
          <span className={`titem-amount ${isIncome ? 'income' : 'expense'}`}>
            {isIncome ? '+' : '−'}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          <div className="titem-actions">
            <button className="titem-btn" onClick={() => setIsEditing(true)} title="Edit">
              <FaEdit size={11} />
            </button>
            <button className="titem-btn delete" onClick={() => setShowDeleteModal(true)} title="Delete">
              <FaTrash size={11} />
            </button>
          </div>
        </div>
      </li>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h4 className="modal-title">Delete transaction?</h4>
            <p className="modal-desc">This action cannot be undone.</p>
            <div className="modal-info">
              <strong>Description:</strong> {transaction.description}<br />
              <strong>Amount:</strong> ${Math.abs(transaction.amount).toFixed(2)}<br />
              <strong>Date:</strong> {formatDate(transaction.date)}
            </div>
            <div className="modal-actions">
              <button className="modal-btn cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="modal-btn delete-btn" onClick={() => { onDelete(transaction.id); setShowDeleteModal(false); }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TransactionItem;