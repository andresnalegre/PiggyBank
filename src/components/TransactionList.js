import React, { useState, useRef } from 'react';
import TransactionItem from './TransactionItem';
import { FaFilter, FaTimes, FaFileExcel, FaUpload } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import './TransactionList.css';

const REQUIRED_COLUMNS = ['Date', 'Description', 'Amount', 'Type'];

const SUPPORTED_DATE_FORMATS = [
  (s) => { const d = new Date(s); return isNaN(d) ? null : d; },
  (s) => {
    const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    return m ? new Date(`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`) : null;
  },
  (s) => {
    const m = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    return m ? new Date(`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`) : null;
  },
];

function parseDate(raw) {
  if (typeof raw === 'number') {
    const d = XLSX.SSF.parse_date_code(raw);
    return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`;
  }
  const str = String(raw).trim();
  for (const fn of SUPPORTED_DATE_FORMATS) {
    const d = fn(str);
    if (d && !isNaN(d)) return d.toISOString().split('T')[0];
  }
  return new Date().toISOString().split('T')[0];
}

function validateStructure(rows) {
  if (!rows.length) return null;
  const rowKeys = Object.keys(rows[0]).map(k => k.trim());
  const missing = REQUIRED_COLUMNS.filter(
    col => !rowKeys.some(k => k.toLowerCase() === col.toLowerCase())
  );
  const extra = rowKeys.filter(
    k => !REQUIRED_COLUMNS.some(col => col.toLowerCase() === k.toLowerCase())
  );
  if (missing.length || extra.length) {
    return { missing, extra };
  }
  return null;
}

function TransactionList({ transactions, filteredTransactions, startDate, endDate, onStartDate, onEndDate, onDelete, onUpdate, onImport }) {
  const [showFilters, setShowFilters] = useState(false);
  const [importMsg, setImportMsg] = useState(null);
  const fileInputRef = useRef(null);

  const isFiltered = Boolean(startDate || endDate);

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const exportToExcel = () => {
    const dataToExport = filteredTransactions.map(t => ({
      Date: new Date(t.date).toLocaleDateString('en-US'),
      Description: t.description,
      Amount: Math.abs(t.amount).toFixed(2),
      Type: t.amount >= 0 ? 'Income' : 'Expense',
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, `piggy_bank_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const showMsg = (type, text, duration = 4000) => {
    setImportMsg({ type, text });
    setTimeout(() => setImportMsg(null), duration);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);

        if (!rows.length) {
          showMsg('error', 'File is empty or unreadable.');
          return;
        }

        const missingCols = validateStructure(rows);
        if (missingCols) {
          showMsg(
            'error',
            `File structure doesn't match. Missing: ${missingCols.join(', ')}. Expected columns: Date, Description, Amount, Type.`,
            6000
          );
          return;
        }

        const parsed = rows.map((row) => {
            const rawDate = row['Date'] || row['date'] || '';
            const desc = row['Description'] || row['description'] || row['desc'] || '';
            const rawAmount = row['Amount'] || row['amount'] || 0;
            const type = (row['Type'] || row['type'] || '').toLowerCase();

            if (!desc) return null;

            const parsedDate = parseDate(rawDate);
            let amount = parseFloat(String(rawAmount).replace(/[^0-9.-]/g, ''));
            if (isNaN(amount)) return null;

            if (type === 'expense') amount = -Math.abs(amount);
            else if (type === 'income') amount = Math.abs(amount);

            return {
              id: Date.now() + Math.random(),
              description: String(desc),
              amount: parseFloat(amount.toFixed(2)),
              date: parsedDate,
              createdAt: new Date().toISOString(),
            };
          });

        const imported = parsed.filter(Boolean);
        const skipped = parsed.length - imported.length;

        if (!imported.length) {
          showMsg('error', 'No valid transactions found. Check that rows have Description and Amount filled in.');
          return;
        }

        onImport(imported, ({ added, duplicates }) => {
          const parts = [];
          if (added > 0) parts.push(`${added} transaction${added !== 1 ? 's' : ''} imported.`);
          if (duplicates > 0) parts.push(`${duplicates} duplicate${duplicates !== 1 ? 's' : ''} ignored.`);
          if (skipped > 0) parts.push(`${skipped} row${skipped !== 1 ? 's' : ''} skipped (missing data).`);
          if (added === 0) {
            showMsg('error', `No new transactions. ${parts.slice(1).join(' ')}`.trim(), 6000);
          } else {
            showMsg('success', parts.join(' '), parts.length > 1 ? 6000 : 4000);
          }
        });
      } catch {
        showMsg('error', 'Failed to read file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const clearFilters = () => { onStartDate(''); onEndDate(''); };

  return (
    <div className="tlist-card">
      <div className="tlist-header">
        <h4 className="tlist-title">Transaction History</h4>
        <div className="tlist-actions">
          <input
            type="file"
            accept=".xlsx,.xls"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImport}
          />
          <button className="tlist-btn import-btn" onClick={() => fileInputRef.current.click()}>
            <FaUpload size={11} /> <span className="btn-label">Import</span>
          </button>
          <button className="tlist-btn export-btn" onClick={exportToExcel}>
            <FaFileExcel size={12} /> <span className="btn-label">Export</span>
          </button>
          <button
            className={`tlist-btn ${showFilters ? 'filter-active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter size={11} /> <span className="btn-label">Filters</span>
          </button>
        </div>
      </div>

      {importMsg && (
        <div className={`import-msg ${importMsg.type}`}>
          {importMsg.text}
        </div>
      )}

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-field">
            <label className="filter-label">From</label>
            <input
              type="date"
              className="filter-input"
              value={startDate}
              onChange={(e) => onStartDate(e.target.value)}
              max={endDate || new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="filter-field">
            <label className="filter-label">To</label>
            <input
              type="date"
              className="filter-input"
              value={endDate}
              onChange={(e) => onEndDate(e.target.value)}
              min={startDate}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <button className="filter-clear" onClick={clearFilters}>
            <FaTimes size={11} /> Clear
          </button>
        </div>
      )}

      <p className="tlist-count">
        {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
        {isFiltered && ' · filtered'}
      </p>

      {sortedTransactions.length === 0 ? (
        <div className="tlist-empty">
          {isFiltered ? 'No transactions in this period' : 'No transactions yet'}
        </div>
      ) : (
        <ul className="tlist-items">
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
  );
}

export default TransactionList;