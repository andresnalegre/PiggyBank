import React, { useState } from 'react';
import { FaTrash, FaEdit, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import './TransactionItem.css';

function TransactionItem({ transaction, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(transaction.description);
  const [newDate, setNewDate] = useState(transaction.date);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSubmit = () => {
    if (newDescription.trim() && newDate) {
      onUpdate(transaction.id, { 
        ...transaction, 
        description: newDescription.trim(),
        date: newDate
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setNewDescription(transaction.description);
    setNewDate(transaction.date);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const DeleteConfirmationModal = () => (
    <Modal 
      show={showDeleteModal} 
      onHide={() => setShowDeleteModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FaExclamationTriangle className="text-warning me-2" />
          Confirm Deletion
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this transaction?</p>
        <div className="alert alert-warning">
          <strong>Description:</strong> {transaction.description}<br />
          <strong>Amount:</strong> $ {Math.abs(transaction.amount).toFixed(2)}<br />
          <strong>Date:</strong> {formatDate(transaction.date)}
        </div>
        <p className="text-muted mb-0">This action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          <FaTimes className="me-1" /> Cancel
        </Button>
        <Button 
          variant="danger" 
          onClick={() => {
            onDelete(transaction.id);
            setShowDeleteModal(false);
          }}
        >
          <FaTrash className="me-1" /> Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <>
      <li className="list-group-item">
        {isEditing ? (
          <div className="d-flex flex-column">
            <div className="d-flex align-items-center mb-2">
              <input
                type="date"
                className="form-control form-control-sm me-2"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
              <input
                type="text"
                className="form-control form-control-sm me-2"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                autoFocus
              />
              <button 
                className="btn btn-sm btn-success me-1"
                onClick={handleSubmit}
                title="Save"
              >
                <FaCheck />
              </button>
              <button 
                className="btn btn-sm btn-secondary"
                onClick={handleCancel}
                title="Cancel"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <span className="text-muted me-3" style={{ fontSize: '0.9rem' }}>
                {formatDate(transaction.date)}
              </span>
              <span 
                className="transaction-description"
                style={{ cursor: 'pointer' }}
                onClick={() => setIsEditing(true)}
                title="Click to edit"
              >
                {transaction.description}
              </span>
              <button 
                className="btn btn-sm btn-link text-primary ms-2"
                onClick={() => setIsEditing(true)}
                title="Edit"
              >
                <FaEdit />
              </button>
            </div>
            <div>
              <span className={`badge ${transaction.amount >= 0 ? 'bg-success' : 'bg-danger'} me-2`}>
                $ {Math.abs(transaction.amount).toFixed(2)}
              </span>
              <button 
                className="btn btn-sm btn-outline-danger"
                onClick={() => setShowDeleteModal(true)}
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        )}
      </li>
      <DeleteConfirmationModal />
    </>
  );
}

export default TransactionItem;