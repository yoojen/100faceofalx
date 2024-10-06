import { useState } from "react";
import {ToLoginOnly} from "../../components/Footer";
import { NavLink} from 'react-router-dom'
export default function Login() {

    const [userCredentials, setUserCredentials] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const [error, setError] = useState('')

    const handleLogin = (e) => {
        e.preventDefault()
        // while logging user
        setError('');
        console.log(userCredentials)
    }
    return (
        <div className="w-3/4 h-login-height mt-10 mx-auto flex rounded-sm shadow-lg overflow-hidden">
            <div className="w-1/2 h-full relative">
                <div className="absolute bg-slate-700 opacity-50 h-full w-full"></div>
                <div className="absolute -z-10 w-full h-full opacity-80">
                    <img src='/assets/login_photo.jpeg' alt="" className="object-cover w-full h-full" />
                </div>
                <div className="relative z-50 w-full h-full p-5 space-y-10 mt-10 flex flex-col items-center">
                    <div className="flex flex-col items-center font-extrabold">
                        <img src="/assets/logo_.png" alt="" width={100} height={100} />
                        <span className="text-xl text-white">STOCK YANJYE</span>
                    </div>
                    <p className="w-2/3 text-center font-medium text-lg italic bg-white p-2 rounded-sm shadow-md">
                        Ubu wabasha gukurikirana uko stock yawe ihinduka umunsi kuwundi.
                    </p>
                </div>
            </div>
            <div className="w-1/2 h-full flex flex-col items-center p-5 bg-white">
                <img src="/assets/logo_.png" alt="" width={100} height={100} />
                <h1 className="uppercase font-medium">injira muri system yawe</h1>
                <small className="capitalize">ikaze nanone! injizamo ibikuranga.</small>
                <small className="italic">
                    kanda
                    <span className='text-blue-500'>
                        <NavLink to="/register"> hano </NavLink>
                    </span>
                    niba udafite konte
                </small>
                {error ? <small className="my-2 text-red-500 transition-all duration-300">{error}</small> : ''}

                <form action="" className="my-10 space-y-5 w-full" onSubmit={handleLogin}>
                    <div className="relative w-2/3 mx-auto">
                        <input
                            type="email"
                            className="peer/email w-full rounded-sm border border-sky-400 px-3 py-2" id="email"
                            onChange={(e) => setUserCredentials({...userCredentials, email: e.target.value })}
                            required
                        />
                        <label
                            htmlFor="email"
                            className={`absolute text-slate-300 transition-all duration-300 peer-focus/email:-top-5 peer-focus/email:text-sm ${userCredentials.email === '' ? 'top-2 left-3': '-top-5 left-0'}`}>
                            Email
                        </label>
                    </div>
                    <div className="relative w-2/3 mx-auto">
                        <input
                            type="password"
                            id="password"
                            name="email"
                            className="peer/password w-full rounded-sm border border-sky-400 px-3 py-2"
                            onChange={(e)=>setUserCredentials({...userCredentials, password: e.target.value})}
                            required
                        />
                        <label
                            htmlFor="password"
                            className={`absolute text-slate-300 transition-all duration-300 peer-focus/password:-top-5 peer-focus/password:text-sm ${userCredentials.password === '' ? 'top-2 left-3': '-top-5 left-0'}`}>
                            Password
                        </label>
                    </div>
                    <div className="w-2/3 mx-auto flex items-center">
                        <input type="checkbox"
                            name="remember_me" id="remember_me"
                            className="w-5 h-5" required
                            onChange={(e) => setUserCredentials({ ...userCredentials, rememberMe: e.target.value })}
                            />
                        <label htmlFor="remember_me">Remember me</label>
                    </div>
                    <div className="w-1/4 mx-auto text-center">
                        <input
                            type="submit"
                            value="Login"
                            className="cursor-pointer bg-sky-500 px-10 py-3 rounded-sm text-white font-medium text-lg" 
                        />
                    </div>
                </form>
                <ToLoginOnly/>
            </div>
        </div>
    );
}