import React, { useEffect } from 'react';
import { Routes, Route,} from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import Stock from './pages/Stock';
import Customer from './pages/Customer';
import Report from './pages/Report';
import Layout from './components/Layout';
import RequireLogin from './components/RequireLogin';
import Login from './pages/login';
import Signup from './pages/signup';


function App() {
  
  return (
    <div className='font-reporting text-sm'>
      <RequireLogin>
        <Layout>
          <Routes>
            <Route exact path='/auth/login' Component={Login}/>
            <Route exact path='/auth/register' Component={Signup} />  
            <Route exact path='/dashboard' Component={Dashboard} />
            <Route exact path='/stock' Component={Stock} />
            <Route exact path='/customers' Component={Customer} />
            <Route exact path='/reports' Component={Report} />
          </Routes>
        </Layout>
      </RequireLogin>
    </div>
  );
}

export default App;