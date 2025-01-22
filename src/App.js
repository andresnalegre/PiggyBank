import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import Balance from './components/Balance';
import TransactionList from './components/TransactionList';
import AddTransaction from './components/AddTransaction';

function App() {
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    try {
      const newTransaction = {
        ...transaction,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      
      setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const deleteTransaction = (id) => {
    try {
      setTransactions(prevTransactions => 
        prevTransactions.filter(transaction => transaction.id !== id)
      );
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const updateTransaction = (id, updatedTransaction) => {
    try {
      setTransactions(prevTransactions =>
        prevTransactions.map(transaction =>
          transaction.id === id
            ? { ...updatedTransaction, updatedAt: new Date().toISOString() }
            : transaction
        )
      );
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const statistics = {
    total: transactions.reduce((acc, curr) => acc + curr.amount, 0),
    income: transactions
      .filter(t => t.amount > 0)
      .reduce((acc, curr) => acc + curr.amount, 0),
    expenses: transactions
      .filter(t => t.amount < 0)
      .reduce((acc, curr) => acc + curr.amount, 0),
  };

  return (
    <div className="App">
      <div className="container py-4">
        <Header />
        <div className="row">
          <div className="col-md-6 mx-auto">
            <Balance 
              transactions={transactions}
              statistics={statistics}
            />
            <TransactionList 
              transactions={transactions} 
              onDelete={deleteTransaction}
              onUpdate={updateTransaction}
            />
            <AddTransaction onAdd={addTransaction} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;