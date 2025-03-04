import {configureStore} from '@reduxjs/toolkit'
import SideNavSlice from './SideNav';

const store = configureStore({
    reducer: {
        sidenav: SideNavSlice
    }
})
export default store;