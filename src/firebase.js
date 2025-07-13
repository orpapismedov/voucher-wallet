import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_ASA3Sw6H-A-wrWQ6GaHar-2UYNzkolE",
  authDomain: "voucher-wallet-4241d.firebaseapp.com",
  projectId: "voucher-wallet-4241d",
  storageBucket: "voucher-wallet-4241d.firebasestorage.app",
  messagingSenderId: "1075290982175",
  appId: "1:1075290982175:web:c6cbfbb6e88ac78746122a",
  measurementId: "G-CT087LK06Z"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);