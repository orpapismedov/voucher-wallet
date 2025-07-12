import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import VoucherWallet from './components/VoucherWallet';
import VoucherArchive from './components/VoucherArchive';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <h1>Voucher Wallet</h1>
        <Switch>
          <Route path="/" exact component={VoucherWallet} />
          <Route path="/archive" component={VoucherArchive} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;