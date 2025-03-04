import { createContext, useState } from 'react';

const NavigationContext = createContext(true);

export const NavigationProvider = ({ children }) => {
    const [isNavOpen, setIsNavOpen] = useState(true);

    const closeNav = () => {
        setIsNavOpen(false);
    }

    const openNav = () => {
        setIsNavOpen(true);
    }

    return (
        <NavigationContext.Provider value={{ isNavOpen, openNav, closeNav }}>
            {children}
        </NavigationContext.Provider>
    )

}

export default NavigationContext;