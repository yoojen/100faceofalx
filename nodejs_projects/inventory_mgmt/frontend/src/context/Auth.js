// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { useNavigate, redirect } from "react-router-dom";


// axios.defaults.baseURL='http://localhost:5000'
// // export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
// //     try {
// //         const res = await axios.post('/users/auth/login',
// //             {email, password },
// //             {
// //             }
// //         );
// //         if (res.status == 200) {
// //             return res.data;
// //         }
// //     } catch (error) {
// //         console.log('error from thunk-->', error.response.data.message);
// //         rejectWithValue(error.response.data.message)
// //     }

// // });

// const AuthSlice = createSlice({
//     name: 'auth-slice',
//     initialState: {
//         user: null,
//         error: null,
//         loading: false
//     },
//     reducers: {
//         logoutUser: state => {
//             state.user = null;
//         },
//         fetchingStarted: state => {
//             state.loading = true;
//         },
//         loginSuccess: (state, action) => {
//             console.log('success');
//             const { data } = action.payload;
//             state.error = null;
//             state.user = data.user;
//             state.loading = false
//         },
//         loginFailure: (state, action) => {
//             state.loading = false
//             state.user = null;
//             state.error = action.payload;
//             console.log('rejected', action)
//         }
//     },
//     // extraReducers: (builder) => {
//     //     builder
//     //         .addCase(loginUser.pending, (state, action) => {
//     //             state.loading = true
//     //             state.error = null;
//     //             state.user = null;
//     //         })
//     //         .addCase(loginUser.fulfilled, (state, action) => {
//     //             console.log('fullfilled');
//     //             state.error = 'errorrr';
//     //             const { data } = action.payload;
//     //             state.user = data.user;
//     //             state.loading = false
//     //         })
//     //         .addCase(loginUser.rejected, (state, action) => {
//     //             state.loading = false
//     //             state.user = null;
//     //             state.error=action.error.response
//     //             console.log('rejected')
//     //         })
//     // }
// })


// export const { fetchingStarted, logoutUser, loginSuccess, loginFailure } = AuthSlice.actions;
// export default AuthSlice.reducer;