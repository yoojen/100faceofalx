import {configureStore} from '@reduxjs/toolkit'
import AccordionSlice from './Accordion';
import SideNavSlice from './SideNav';
import AuthSlice from './Auth';

const store = configureStore({
    reducer: {
        auth: AuthSlice,
        accordion: AccordionSlice,
        sidenav: SideNavSlice
    }
})
export default store;