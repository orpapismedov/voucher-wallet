import React from 'react';

interface VoucherItemProps {
    link: string;
    amount: number;
    onEdit: () => void;
    onArchive: () => void;
}

const VoucherItem: React.FC<VoucherItemProps> = ({ link, amount, onEdit, onArchive }) => {
    return (
        <div className="voucher-item">
            <h3>{link}</h3>
            <p>Amount: ${amount}</p>
            <button onClick={onEdit}>Edit</button>
            <button onClick={onArchive} disabled={amount > 0}>Archive</button>
        </div>
    );
};

export default VoucherItem;