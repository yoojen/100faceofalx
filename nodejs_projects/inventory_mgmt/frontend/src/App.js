import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import Stock from './pages/Stock';
import Customer from './pages/Customer';
import Report from './pages/Report';
import Layout from './components/Layout';
import Login from './pages/login';
import Signup from './pages/signup';
import Homepage from './pages/Homepage';
import { RequireAuth } from './components/RequireAuth';


function App() {
  return (
    <div className='font-reporting text-sm'>
      <Routes>
        <Route path='/auth/login' element={<Login />} />
        <Route path='/auth/register' element={<Signup />} />
        <Route path='/home' element={<Homepage />} />
        <Route path='/' element={<RequireAuth />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/stock' element={<Stock />} />
          <Route path='/customers' element={<Customer />} />
          <Route path='/reports' element={<Report />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;