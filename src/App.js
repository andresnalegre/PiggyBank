import React, { useState, useEffect, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import Balance from './components/Balance';
import TransactionList from './components/TransactionList';
import AddTransaction from './components/AddTransaction';
import Footer from './components/Footer';

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const isFiltered = Boolean(startDate || endDate);

  const filteredTransactions = useMemo(() => {
    if (!isFiltered) return transactions;
    return transactions.filter(t => {
      const d = new Date(t.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start && end) return d >= start && d <= end;
      if (start) return d >= start;
      if (end) return d <= end;
      return true;
    });
  }, [transactions, startDate, endDate, isFiltered]);

  const addTransaction = (transaction) => {
    try {
      setTransactions(prev => [{ ...transaction, id: Date.now(), createdAt: new Date().toISOString() }, ...prev]);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const deleteTransaction = (id) => {
    try {
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const updateTransaction = (id, updatedTransaction) => {
    try {
      setTransactions(prev =>
        prev.map(t => t.id === id ? { ...updatedTransaction, updatedAt: new Date().toISOString() } : t)
      );
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const importTransactions = (imported, onResult) => {
    try {
      setTransactions(prev => {
        const key = t => `${t.description.trim().toLowerCase()}|${t.date}|${parseFloat(t.amount).toFixed(2)}`;
        const existingKeys = new Set(prev.map(key));
        const newOnes = imported.filter(t => !existingKeys.has(key(t)));
        const duplicates = imported.length - newOnes.length;
        if (onResult) onResult({ added: newOnes.length, duplicates });
        return [...newOnes, ...prev];
      });
    } catch (error) {
      console.error('Error importing transactions:', error);
    }
  };

  return (
    <div className="App">
      <div className="container py-4">
        <Header />
        <div className="row">
          <div className="col-md-6 mx-auto">
            <Balance
              transactions={transactions}
              filteredTransactions={filteredTransactions}
              isFiltered={isFiltered}
            />
            <TransactionList
              transactions={transactions}
              filteredTransactions={filteredTransactions}
              startDate={startDate}
              endDate={endDate}
              onStartDate={setStartDate}
              onEndDate={setEndDate}
              onDelete={deleteTransaction}
              onUpdate={updateTransaction}
              onImport={importTransactions}
            />
            <AddTransaction onAdd={addTransaction} />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;