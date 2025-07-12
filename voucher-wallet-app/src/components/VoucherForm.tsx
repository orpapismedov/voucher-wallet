import React, { useState } from 'react';

const VoucherForm: React.FC<{ onSubmit: (data: { link: string; amount: number }) => void }> = ({ onSubmit }) => {
    const [link, setLink] = useState('');
    const [amount, setAmount] = useState<number | ''>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (link && amount) {
            onSubmit({ link, amount: Number(amount) });
            setLink('');
            setAmount('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="voucher-form">
            <div>
                <label htmlFor="link">Voucher Link:</label>
                <input
                    type="url"
                    id="link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="amount">Amount:</label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="0"
                />
            </div>
            <button type="submit">Add Voucher</button>
        </form>
    );
};

export default VoucherForm;