import React from 'react';
import { Voucher } from '../types';
import VoucherItem from './VoucherItem';

interface VoucherArchiveProps {
    archivedVouchers: Voucher[];
    restoreVoucher: (id: string, amount: number) => void;
}

const VoucherArchive: React.FC<VoucherArchiveProps> = ({ archivedVouchers, restoreVoucher }) => {
    return (
        <div className="voucher-archive">
            <h2>Archived Vouchers</h2>
            {archivedVouchers.length === 0 ? (
                <p>No archived vouchers available.</p>
            ) : (
                <ul>
                    {archivedVouchers.map(voucher => (
                        <VoucherItem 
                            key={voucher.id} 
                            voucher={voucher} 
                            onRestore={restoreVoucher} 
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default VoucherArchive;