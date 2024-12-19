import { useContext } from "react";
import { categoryContext } from '../context/GeneralAssets';


export default function useCategory() {
    return useContext(categoryContext)
}