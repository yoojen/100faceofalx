import React from 'react';
import {
  BrowserRouter, Routes, Route
} from 'react-router-dom'
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className='font-reporting'>
      <BrowserRouter>
        <Routes>
          <Route exact path='/login' Component={Login}/>
          <Route exact path='/register' Component={Signup} />
          <Route exact path='/dashboard' Component={Dashboard} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;