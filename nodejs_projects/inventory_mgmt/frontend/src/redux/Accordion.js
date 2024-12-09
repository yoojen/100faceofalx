import { createSlice } from "@reduxjs/toolkit";


const AccordionSlice = createSlice({
    name: 'accordion',
    initialState: {open: false},
    reducers: {
        changeAccordion:  (state) =>{ state.open === false ? state.open = true : state.open = false } 
    }
})


export const { changeAccordion } = AccordionSlice.actions;
export default AccordionSlice.reducer