import { useContext } from "react";
import { supplierContext } from '../context/GeneralAssets';

export default function useSupplier() {
    return useContext(supplierContext);
}
