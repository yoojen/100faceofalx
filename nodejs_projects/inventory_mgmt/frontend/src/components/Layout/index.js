import React from 'react'
import Navigator from '../Navigator'
import { useSelector } from 'react-redux'

const Layout = ({ children }) => {
    const sideNav = useSelector((state) => state.sidenav)
    
    return (
        <div className='flex'>
            <div className={`${sideNav ? 'block' : 'hidden'}`}><Navigator /></div>
            <div className={`${sideNav ?  'md:ml-[18%] top-16' : 'ml-0 top-0'} w-full relative`}>{children}</div>
        </div>
    )
}

export default Layout