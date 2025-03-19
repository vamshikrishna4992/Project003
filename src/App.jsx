import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './Store';
import Layout from './Components/Layout';
import AppRoutes from './Route/Index';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <AppRoutes />
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;