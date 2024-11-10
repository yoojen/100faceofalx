import { useState } from 'react';
import SideNav from '../SideNav';
import NavBar from '../NavBar';

export default function Navigator() {
    return (
        <div className='w-full'>
            <div className='fixed top-0 lg:w-sidebar-width md:w-1/4'>
                <SideNav />
            </div>
            <div className='fixed top-0 z-20 w-full lg:w-navbar-width lg:ml-[18.5%] transition-all duration-300'>
                <NavBar />
            </div>
        </div>
    )
}
