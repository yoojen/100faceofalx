import {configureStore} from '@reduxjs/toolkit'
import AccordionSlice from './Accordion';

const store = configureStore({
    reducer: {
        accordion: AccordionSlice
    }
})
export default store;