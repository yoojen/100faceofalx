const { createContext, useState, useEffect } = require("react");
import useGetFetch from '../hooks/useGetFetch';


export const categoryContext = createContext([]);
export const productContext = createContext([]);
export const supplierContext = createContext([]);
const transactionContext = createContext([]);

export const CategoryProvider = ({ children }) => {
    const categories = useGetFetch({ url: '/categories' })

    useEffect(() => {
        async function getData() {
            await categories.fetchData();
        }
        getData();
    }, [])
    return <categoryContext.Provider value={{ categories: !categories.isLoading && categories.data?.data }}>
        {children}
    </categoryContext.Provider>

}

export const ProductProvider = ({ children }) => {
    const products = useGetFetch({ url: '/products' });
    useEffect(() => {
        async function getData() {
            await products.fetchData()
        }
        getData();
    }, [])
    return <productContext.Provider value={{ products: !products.isLoading && products.data?.data }}>
        {children}
    </productContext.Provider>
}

export const SupplierProvider = ({ children }) => {
    const suppliers = useGetFetch({ url: '/suppliers' });
    useEffect(() => {
        async function getData() {
            await suppliers.fetchData()
        }
        getData();
    }, [])
    return <supplierContext.Provider value={{ suppliers: !suppliers.isLoading && suppliers.data?.data }}>
        {children}
    </supplierContext.Provider>
}