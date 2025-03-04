import { useContext } from "react";
import { transactionContext } from "../context/GeneralAssets";


export default function useTransaction() {
    return useContext(transactionContext);
}