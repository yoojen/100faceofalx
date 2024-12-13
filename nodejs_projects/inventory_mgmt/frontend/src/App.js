import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import Stock from './pages/Stock';
import Customer from './pages/Customer';
import Report from './pages/Report';
import Login from './pages/login';
import Signup from './pages/signup';
import Homepage from './pages/Homepage';
import { RequireAuth } from './components/RequireAuth';
import PersistAuth from './components/PersistAuth';


function App() {
  return (
    <div className='font-reporting text-sm'>
      <Routes>
        <Route path='/auth/login' element={<Login />} />
        <Route path='/auth/register' element={<Signup />} />
        <Route path='/home' element={<Homepage />} />

        <Route element={<PersistAuth />}>
          <Route element={<RequireAuth />}>
            <Route exact path='/dashboard' element={<Dashboard />} />
            <Route exact path='/stock' element={<Stock />} />
            <Route exact path='/customers' element={<Customer />} />
            <Route exact path='/reports' element={<Report />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;