import axios from 'axios';


export const publicAxios = axios.create({
    baseURL: 'http://localhost:5000',
});

