import { useContext } from "react";
import { productContext } from '../context/GeneralAssets';


export default function useProduct() {
    return useContext(productContext)
}