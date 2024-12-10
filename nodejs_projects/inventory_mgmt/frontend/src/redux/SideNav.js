import { createContext, useState} from 'react';

const NavigationContext = createContext(true);

export const NavigationProvider = ({ children }) => {
    const [isNavOpen, setIsNavOpen] = useState(true);

    const closeNav = () => {
        console.log('attempt to close nav');
        setIsNavOpen(false);
    }

    const openNav = () => {
        console.log('attempt to open nav');
        setIsNavOpen(true);
    }

    return (
        <NavigationContext.Provider value={{ isNavOpen, openNav, closeNav}}>
            {children}
        </NavigationContext.Provider>
    )

}

export default NavigationContext;