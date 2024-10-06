import { useState } from "react";
import { NavLink} from 'react-router-dom'
import {ToLoginOnly} from "../../components/Footer";

export default function Signup() {

    const [userCredentials, setUserCredentials] = useState({
        email: '',
        password: '',
        password2: ''
    });
    const [error, setError] = useState('')

    const handleSignup = (e) => {
        e.preventDefault()
            if (userCredentials.password !== userCredentials.password2) {
                setError("Match both password");
                return;
        }
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
            <div className="w-1/2 h-full flex flex-col items-center p-5 overflow-auto custom-scrollbar bg-white">
                <img src="/assets/logo_.png" alt="" width={100} height={100} />
                <h1 className="uppercase font-medium">iyandikishe muri system</h1>
                <small className="capitalize">ikaze nanone! injiza ibikuranga</small>
                <small className="italic">
                    kanda
                    <span className='text-blue-500'>
                        <NavLink to="/login"> hano </NavLink>
                    </span>
                    niba ufite konte
                </small>
                {error ? <small className="my-2 text-red-500 transition-all duration-300">{error}</small> : ''}

                <form action="" className="my-10 space-y-5 w-full" onSubmit={handleSignup}>
                    <div className="relative w-2/3 mx-auto">
                        <input
                            type="email"
                            id="id_email"
                            name="email"
                            className="peer/email w-full rounded-sm border border-sky-400 px-3 py-2"
                            onChange={(e) => setUserCredentials({...userCredentials, email: e.target.value })}
                            required
                        />
                        <label
                            htmlFor="id_email"
                            className={`absolute text-slate-300 transition-all duration-300 peer-focus/email:-top-5 peer-focus/email:text-sm ${userCredentials.email === '' ? 'top-2 left-3': '-top-5 left-0'}`}>
                            Email
                        </label>
                    </div>
                    <div className="relative w-2/3 mx-auto">
                        <input
                            type="password"
                            id="id_password"
                            name="password"
                            className="peer/password w-full rounded-sm border border-sky-400 px-3 py-2"
                            onChange={(e)=>setUserCredentials({...userCredentials, password: e.target.value})}
                            required
                        />
                        <label
                            htmlFor="id_password"
                            className={`absolute text-slate-300 transition-all duration-300 peer-focus/password:-top-5 peer-focus/password:text-sm ${userCredentials.password === '' ? 'top-2 left-3': '-top-5 left-0'}`}>
                            Password
                        </label>
                    </div>
                    <div className="relative w-2/3 mx-auto">
                        <input
                            type="password"
                            id="id_password2"
                            name="password_2"
                            className="peer/password2 w-full rounded-sm border border-sky-400 px-3 py-2"
                            onChange={(e)=>setUserCredentials({...userCredentials, password2: e.target.value})}
                            required
                        />
                        <label
                            htmlFor="id_password2"
                            className={`absolute text-slate-300 transition-all duration-300 peer-focus/password2:-top-5 peer-focus/password2:text-sm ${userCredentials.password === '' ? 'top-2 left-3': '-top-5 left-0'}`}>
                            Re-type Password
                        </label>
                    </div>
                    <div className="w-2/3 mx-auto space-x-2 flex items-center">
                        <input type="checkbox" name="accept-terms" id="accept-terms" className="w-5 h-5" required/>
                        <label htmlFor="accept-terms">Accept terms and condition</label>
                    </div>
                    <div className="w-1/4 mx-auto text-center">
                        <input
                            type="submit"
                            value="Register"
                            className="cursor-pointer bg-sky-500 px-10 py-3 rounded-sm text-white font-medium text-lg" 
                        />
                    </div>
                </form>
                <ToLoginOnly/>
            </div>
        </div>
    );
}