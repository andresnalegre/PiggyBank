import React from 'react';

function Balance({ transactions }) {
  const total = transactions.reduce((acc, curr) => {
    return acc + curr.amount;
  }, 0);

  return (
    <div className="card mb-4">
      <div className="card-body text-center">
        <h4 className="card-title">Current Balance</h4>
        <h2 className={`${total >= 0 ? 'text-success' : 'text-danger'}`}>
          $ {total.toFixed(2)}
        </h2>
      </div>
    </div>
  );
}

export default Balance;