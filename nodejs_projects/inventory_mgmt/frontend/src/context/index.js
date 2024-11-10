import {configureStore} from '@reduxjs/toolkit'
import AccordionSlice from './Accordion';
import SideNavSlice from './SideNav';

const store = configureStore({
    reducer: {
        accordion: AccordionSlice,
        sidenav: SideNavSlice
    }
})
export default store;