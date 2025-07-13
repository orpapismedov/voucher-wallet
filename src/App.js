import { useState, useEffect } from 'react';
import './App.css';
import buymeLogo from './buyme.png';
import { db } from './firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot
} from "firebase/firestore";

function uuid() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

function VoucherForm({ initial, onSubmit, onClose, title }) {
  const [name, setName] = useState(initial?.name || '');
  const [link, setLink] = useState(initial?.link || '');
  const [amount, setAmount] = useState(initial?.amount ? initial.amount.toString() : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !link.trim() || !amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) return;
    onSubmit({ name: name.trim(), link: link.trim(), amount: Number(amount) });
    setName('');
    setLink('');
    setAmount('');
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{title}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              מה שם השובר?
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="למשל: buyme לפנינה"
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              קישור שוברים:
              <input
                type="url"
                value={link}
                onChange={e => setLink(e.target.value)}
                required
                placeholder="https://example.com/voucher"
                style={{ direction: 'ltr' }}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              סכום:
              <input
                type="number"
                min={1}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="modal-actions">
            <button type="submit">שמור</button>
            <button type="button" onClick={onClose} className="secondary">
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VoucherRow({ voucher, onEdit, onEmpty, isArchive, onRestore, onDelete }) {
  const [restoreMode, setRestoreMode] = useState(false);
  const [restoreAmount, setRestoreAmount] = useState('');

  if (isArchive && restoreMode) {
    return (
      <form className="voucher-row" onSubmit={e => {
        e.preventDefault();
        if (!restoreAmount.trim() || isNaN(Number(restoreAmount)) || Number(restoreAmount) <= 0) return;
        onRestore({ ...voucher, amount: Number(restoreAmount) });
        setRestoreMode(false);
        setRestoreAmount('');
      }}>
        <a
          href={voucher.link}
          target="_blank"
          rel="noopener noreferrer"
          className="voucher-link-btn"
        >
          {voucher.name}
        </a>
        <input
          type="number"
          min={1}
          value={restoreAmount}
          onChange={e => setRestoreAmount(e.target.value)}
          placeholder="סכום"
          required
          className="voucher-amount-input"
        />
        <button type="submit" className="voucher-restore">החזר</button>
        <button type="button" className="secondary" onClick={() => setRestoreMode(false)}>ביטול</button>
        <button type="button" className="voucher-delete" onClick={() => onDelete(voucher.id)}>מחיקת שובר מארכיון</button>
      </form>
    );
  }

  return (
    <div className="voucher-row">
      <a
        href={voucher.link}
        target="_blank"
        rel="noopener noreferrer"
        className="voucher-link-btn"
      >
        {voucher.name}
      </a>
      <span className="voucher-amount">₪{voucher.amount}</span>
      {!isArchive && (
        <>
          <button className="voucher-edit" onClick={() => onEdit(voucher)}>
            ערוך
          </button>
          <button className="voucher-empty" onClick={() => onEmpty(voucher.id)}>
            השובר ריק
          </button>
        </>
      )}
      {isArchive && (
        <>
          <button className="voucher-restore" onClick={() => setRestoreMode(true)}>
            החזר
          </button>
          <button className="voucher-delete" onClick={() => onDelete(voucher.id)}>
            מחיקת שובר מארכיון
          </button>
        </>
      )}
    </div>
  );
}

function App() {
  const [wallet, setWallet] = useState([]);
  const [archive, setArchive] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editVoucher, setEditVoucher] = useState(null);

  // Real-time sync with Firestore
  useEffect(() => {
    const unsubWallet = onSnapshot(collection(db, "wallet"), (snapshot) => {
      setWallet(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubArchive = onSnapshot(collection(db, "archive"), (snapshot) => {
      setArchive(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => {
      unsubWallet();
      unsubArchive();
    };
  }, []);

  // Add or edit voucher
  const handleSaveVoucher = async (data) => {
    setShowForm(false); // <-- Close the modal immediately
    setEditVoucher(null);
    if (editVoucher) {
      await updateDoc(doc(db, "wallet", editVoucher.id), data);
    } else {
      await addDoc(collection(db, "wallet"), data);
    }
  };

  // Move voucher to archive
  const handleEmptyVoucher = async (id) => {
    const voucher = wallet.find(v => v.id === id);
    if (!voucher) return;
    // Add to archive first, and only if successful, delete from wallet
    const { id: _, ...voucherData } = voucher;
    try {
      await addDoc(collection(db, "archive"), { ...voucherData, amount: 0 });
      await deleteDoc(doc(db, "wallet", id));
    } catch (err) {
      alert("שגיאה בארכוב השובר. נסה שוב.");
      console.error(err);
    }
  };

  // Restore voucher from archive
  const handleRestoreVoucher = async (voucherWithAmount) => {
    const { id, ...rest } = voucherWithAmount;
    await addDoc(collection(db, "wallet"), rest);
    await deleteDoc(doc(db, "archive", id));
  };

  // Delete voucher from archive
  const handleDeleteArchiveVoucher = async (id) => {
    await deleteDoc(doc(db, "archive", id));
  };

  // Delete all vouchers from archive
  const handleDeleteAllArchive = async () => {
    const archiveDocs = await getDocs(collection(db, "archive"));
    const deletions = archiveDocs.docs.map(d => deleteDoc(doc(db, "archive", d.id)));
    await Promise.all(deletions);
  };

  const total = wallet.reduce((sum, v) => sum + v.amount, 0);

  return (
    <div className="app-bg" style={{ direction: 'rtl' }}>
      <div className="container">
        <div className="card">
          <img src={buymeLogo} alt="BUYME" className="buyme-logo" />
          <h2>ארנק שוברים</h2>
          <button className="add-btn" onClick={() => { setEditVoucher(null); setShowForm(true); }}>
            הוסף שובר חדש
          </button>
          <div className="voucher-list">
            {wallet.length === 0 && <div className="empty">אין שוברים</div>}
            {wallet.map(voucher => (
              <VoucherRow
                key={voucher.id}
                voucher={voucher}
                onEdit={v => { setEditVoucher(v); setShowForm(true); }}
                onEmpty={handleEmptyVoucher}
                isArchive={false}
              />
            ))}
          </div>
          <div className="total">סה"כ: <b>₪{total}</b></div>
        </div>
        <div className="card">
          <h2>ארכיון שוברים</h2>
          <button className="archive-delete-all" onClick={handleDeleteAllArchive}>
            מחיקת כל השוברים מהארכיון
          </button>
          <div className="voucher-list">
            {archive.length === 0 && <div className="empty">אין שוברים בארכיון</div>}
            {archive.map(voucher => (
              <VoucherRow
                key={voucher.id}
                voucher={voucher}
                isArchive={true}
                onRestore={handleRestoreVoucher}
                onDelete={handleDeleteArchiveVoucher}
              />
            ))}
          </div>
        </div>
      </div>
      {showForm && (
        <VoucherForm
          initial={editVoucher || undefined}
          onSubmit={handleSaveVoucher}
          onClose={() => setShowForm(false)}
          title={editVoucher ? 'ערוך שובר' : 'הוסף שובר חדש'}
        />
      )}
    </div>
  );
}

export default App;

