import { createSlice } from "@reduxjs/toolkit";

const SideNavSlice = createSlice({
    name: 'sidenav',
    initialState: true,
    reducers: {
        toggleSideNav: state => {
            return !state;
        }
    }
})


export const { toggleSideNav } = SideNavSlice.actions;
export default SideNavSlice.reducer;