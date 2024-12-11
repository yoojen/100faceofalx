import { createContext, useState } from 'react';



const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    return (
        <AuthContext.Provider value={{ auth, setAuth, isLoading, setIsLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;