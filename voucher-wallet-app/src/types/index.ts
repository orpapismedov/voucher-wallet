export interface Voucher {
    id: string;
    link: string;
    amount: number;
    archived: boolean;
}

export interface VoucherFormData {
    link: string;
    amount: number;
}