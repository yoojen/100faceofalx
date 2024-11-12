import { IoHomeOutline } from "react-icons/io5";
import { MdProductionQuantityLimits } from "react-icons/md";
import { BsFillPeopleFill } from "react-icons/bs";
import { BiSolidReport } from "react-icons/bi";


export const navLinks = [
    { id: 1, text: 'Ahabanza', rel: 'dashboard',icon: <IoHomeOutline className="h-5 w-5"/>},
    { id: 2, text: 'Stock', rel: 'stock',  icon: <MdProductionQuantityLimits className="h-5 w-5"/>},
    { id: 3, text:'Abakiriya', rel: 'customers', icon: <BsFillPeopleFill className="h-5 w-5"/>},
    { id: 4, text: 'Raporo', rel: 'reports', icon: <BiSolidReport className="h-5 w-5"/>}
];


export const personalInfo = {
    firstName: 'Eugene',
    lastName: 'MUTUYIMANA',
    email: 'eugeneemma7@gmail.com',
    country: 'Rwanda',
    continent: 'Africa',
}