import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { ToLoginOnly } from "../../components/Footer";
import { publicAxios } from "../../api/axios";
import useAuth from '../../hooks/useAuth';

export default function Login() {
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState(null);
  const { auth, setAuth, isLoading, setIsLoading } = useAuth();

  const location = useLocation()
  const navigate = useNavigate();
  const from = location?.state?.from?.pathname || '/dashboard';
  useEffect(() => {
    setError(null);
  }, [
    userCredentials.email,
    userCredentials.password,
    userCredentials.rememberMe,
  ]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await publicAxios.post(
        "/users/auth/login",
        {
          email: userCredentials.email,
          password: userCredentials.password,
        },
        {
          withCredentials: true,
        }
      );
      setAuth({
        user: response.data.data.email,
        accessToken: response.data.data.accessToken,
      });
      setError(null);
      setIsLoading(false);

      navigate(from, { replace: true });
    } catch (error) {
      setError(error?.response?.data.message || "Login failed");
      console.error(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-3/4 md:2/4 ml-[50%] -translate-x-[50%] mt-[7%] h-login-height flex rounded-sm shadow-lg border overflow-hidden">
      <div className="w-1/2 h-full relative">
        <div className="absolute bg-slate-700 opacity-50 h-full w-full"></div>
        <div className="absolute -z-10 w-full h-full opacity-80">
          <img
            src="/assets/login_photo.jpeg"
            alt=""
            className="object-cover w-full h-full"
          />
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
          <span className="text-blue-500">
            <NavLink to="/auth/register"> hano </NavLink>
          </span>
          niba udafite konte
        </small>
        {error ? (
          <small className="mt-5 mb-2 text-red-500 transition-all duration-300">
            {error}
          </small>
        ) : (
          ""
        )}

        <form
          action=""
          className="mt-5 mb-10 space-y-5 w-full"
          onSubmit={handleLogin}
        >
          <div className="relative w-2/3 mx-auto">
            <input
              type="email"
              name="email"
              className="peer/email w-full rounded-sm border border-sky-400 px-3 py-2"
              id="email"
              onChange={(e) =>
                setUserCredentials({
                  ...userCredentials,
                  email: e.target.value,
                })
              }
              required
            />
            <label
              htmlFor="email"
              className={`absolute text-slate-300 transition-all duration-300 peer-focus/email:-top-5 peer-focus/email:text-sm ${userCredentials.email === "" ? "top-2 left-3" : "-top-5 left-0"
                }`}
            >
              Email
            </label>
          </div>
          <div className="relative w-2/3 mx-auto">
            <input
              type="password"
              id="password"
              name="password"
              className="peer/password w-full rounded-sm border border-sky-400 px-3 py-2"
              onChange={(e) =>
                setUserCredentials({
                  ...userCredentials,
                  password: e.target.value,
                })
              }
              required
            />
            <label
              htmlFor="password"
              className={`absolute text-slate-300 transition-all duration-300 peer-focus/password:-top-5 peer-focus/password:text-sm ${userCredentials.password === ""
                ? "top-2 left-3"
                : "-top-5 left-0"
                }`}
            >
              Password
            </label>
          </div>
          <div className="w-2/3 mx-auto flex items-center">
            <input
              type="checkbox"
              name="remember_me"
              id="remember_me"
              className="w-5 h-5"
              onChange={(e) =>
                setUserCredentials({
                  ...userCredentials,
                  rememberMe: e.target.checked,
                })
              }
            />
            <label htmlFor="remember_me">Remember me</label>
          </div>
          <div className="w-1/4 mx-auto text-center">
            <input
              type="submit"
              value={`${isLoading ? "loading..." : "Login"}`}
              className="cursor-pointer bg-sky-500 px-10 py-2 rounded-sm text-white font-bold text-md"
            />
          </div>
        </form>
        <ToLoginOnly />
      </div>
    </div>
  );
}
