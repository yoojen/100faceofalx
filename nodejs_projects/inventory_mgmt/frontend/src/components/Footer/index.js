import {NavLink} from 'react-router-dom'
const appNav = (
    <div>
        <img src="/assets/logo_.png" alt="" height={50} width={50} />
        <span className="capitalize">Stock yanjye</span>
    </div>
)

const footerList = (
    <ul className="">
        <li className='hover:text-blue-500'>
            <NavLink to={'/dashboard'}>Ahabanza</NavLink>
        </li>
        <li className='hover:text-blue-500'>
            <NavLink to={'/stock'}>Stock</NavLink>
        </li>
        <li className='hover:text-blue-500'>
            <NavLink to={'/reports'}>Uko wacuruje</NavLink>
        </li>
    </ul>
)

const copyRight = (
    <small className="space-x-6 italic">
        <span>&copy; Eugene Mutuyimana</span>
        <span>-</span>
        <span>eugeneemma7@gmail.com</span>
    </small>
)

const contacts = (
    <ul>
        <li>Mutuyimana Eugene</li>
        <li>eugeneemma7@gmail.com</li>
        <li>Africa.Rwanda.North</li>
    </ul>
)
export const ToLoginOnly = () => {
    return(
        <div>
            {copyRight}
        </div>
    )   
}

export default function Footer(){
    return (
        <div className="flex justify-between px-5 bg-white p-3 italic">
            <div>
                {appNav}
            </div>
            <div>
                {footerList}
            </div>
            <div>
                {contacts}
            </div>
        </div>
    )
}