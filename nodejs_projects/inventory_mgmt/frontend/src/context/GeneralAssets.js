const { createContext, useState, useEffect } = require("react");
import useGetFetch from "../hooks/useGetFetch";

export const categoryContext = createContext([]);
export const productContext = createContext([]);
export const supplierContext = createContext([]);
export const transactionContext = createContext([]);

export const CategoryProvider = ({ children }) => {
  const categories = useGetFetch({ url: "/categories" });
  const [reFetch, setReFetch] = useState(false);
  const changeReFetch = () => { setReFetch((prev) => !prev); };

  useEffect(() => {
    async function getData() {
      await categories.fetchData();
    }
    getData();
  }, [reFetch]);

  return (
    <categoryContext.Provider
      value={{
        categories:
          !categories.isLoading && !categories.error
            ? categories.data?.data
            : [],
        fetchAgain: changeReFetch,
      }}
    >
      {children}
    </categoryContext.Provider>
  );
};

export const ProductProvider = ({ children }) => {
  const products = useGetFetch({ url: "/products" });
  const [reFetch, setReFetch] = useState(false);
  const changeReFetch = () => { setReFetch((prev) => !prev); };

  useEffect(() => {
    async function getData() {
      await products.fetchData();
    }
    getData();
  }, [reFetch]);
  return (
    <productContext.Provider
      value={{
        products:
          !products.isLoading && !products.error ? products.data?.data : [],
        fetchAgain: changeReFetch,
      }}
    >
      {children}
    </productContext.Provider>
  );
};

export const SupplierProvider = ({ children }) => {
  const suppliers = useGetFetch({ url: "/suppliers" });
  const [reFetch, setReFetch] = useState(false);
  const changeReFetch = () => { setReFetch((prev) => !prev); };

  useEffect(() => {
    async function getData() {
      await suppliers.fetchData();
    }
    getData();
  }, [reFetch]);

  return (
    <supplierContext.Provider
      value={{
        suppliers:
          !suppliers.isLoading && !suppliers.error ? suppliers.data?.data : [],
        fetchAgain: changeReFetch,
      }}
    >
      {children}
    </supplierContext.Provider>
  );
};

export const TransactionProvider = ({ children }) => {
  const transactions = useGetFetch({ url: "/transactions" });
  const [reFetch, setReFetch] = useState(false);
  const changeReFetch = () => { setReFetch((prev) => !prev); };

  useEffect(() => {
    async function getData() {
      await transactions.fetchData();
    }
    getData();
  }, [reFetch]);

  return (
    <transactionContext.Provider
      value={{
        transactions: !transactions.isLoading
          ? !transactions.error
            ? transactions.data?.data
            : []
          : [],
        fetchAgain: changeReFetch,
      }}
    >
      {children}
    </transactionContext.Provider>
  );
};
