import React from 'react';
import {
  BrowserRouter, Routes, Route
} from 'react-router-dom'
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/Dashboard';
import Stock from './pages/Stock';
import Customer from './pages/Customer';
import Report from './pages/Report';
import Layout from './components/Layout';

function App() {
  return (
    <div className='font-reporting text-sm'>
        <BrowserRouter>
        <Layout>
          <Routes>
            <Route exact path='/login' Component={Login}/>
            <Route exact path='/register' Component={Signup} />
            <Route exact path='/dashboard' Component={Dashboard} />
            <Route exact path='/stock' Component={Stock} />
            <Route exact path='/customers' Component={Customer} />
            <Route exact path='/reports' Component={Report} />
          </Routes>
        </Layout>
        </BrowserRouter>
    </div>
  );
}

export default App;