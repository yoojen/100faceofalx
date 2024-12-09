import React from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { GiHamburgerMenu } from "react-icons/gi";

import SideNav from '../SideNav';
import NavBar from '../NavBar';
import { toggleSideNav } from '../../redux/SideNav'
import { Routes, Route } from 'react-router-dom';
import Login from '../../pages/login';
import Signup from '../../pages/signup';

const Layout = ({ children }) => {
    const sideNav = useSelector((state) => state.sidenav)
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    return (
        <>
            {user ? (
                <div>
                    <div className='relative'>
                        <GiHamburgerMenu className="fixed top-5 left-2 z-50 bg-white cursor-pointer h-5 w-5 hover:text-blue-500 peer"
                            onClick={() => dispatch(toggleSideNav())}
                        />
                        <div className="absolute top-6 left-7 hidden text-sm text-white bg-gray-800 px-2 z-40 md:peer-hover:block">
                            Toggle navigation
                        </div>
                    </div>
                    <div className='w-full'>
                        <div className={`${sideNav ? 'h-screen w-2/4 shadow-md bg-white p-5 space-y-32 md:block md:w-sidebar-width md:shadow-none' : 'hidden'} fixed top-0 z-30`}>
                            <SideNav />
                        </div>
                    
                        <div className={`${sideNav ? 'w-full md:ml-[18%] md:w-navbar-width' : 'ml-0 w-full'} transition-all duration-300 fixed top-0 z-20`}>
                            <NavBar />
                        </div>
                    </div>
                    <div className={`${sideNav ? 'md:ml-[18%] top-16' : 'ml-0 top-16'} relative`}>{children}</div>
                </div>
            ) :
            (
                <Routes>
                    <Route exact path='/auth/login' Component={Login}/>
                    <Route exact path='/auth/register' Component={Signup} />   
                </Routes>
            )}
        </>
    )
}

export default Layout