import React, { useState } from 'react';
import VoucherForm from './VoucherForm';
import VoucherItem from './VoucherItem';
import { Voucher } from '../types';

const VoucherWallet: React.FC = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);

    const addVoucher = (voucher: Voucher) => {
        setVouchers([...vouchers, voucher]);
    };

    const editVoucher = (id: number, updatedVoucher: Voucher) => {
        setVouchers(vouchers.map(voucher => (voucher.id === id ? updatedVoucher : voucher)));
    };

    const archiveVoucher = (id: number) => {
        setVouchers(vouchers.filter(voucher => voucher.id !== id));
    };

    return (
        <div className="voucher-wallet">
            <h1>Voucher Wallet</h1>
            <VoucherForm onAddVoucher={addVoucher} />
            <div className="voucher-list">
                {vouchers.map(voucher => (
                    <VoucherItem
                        key={voucher.id}
                        voucher={voucher}
                        onEditVoucher={editVoucher}
                        onArchiveVoucher={archiveVoucher}
                    />
                ))}
            </div>
        </div>
    );
};

export default VoucherWallet;