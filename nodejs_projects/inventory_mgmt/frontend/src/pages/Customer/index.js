import { useState, useContext } from 'react';
import NavigationContext from '../../context/SideNav';
import Footer from '../../components/Footer';
import CustomerModal from '../../components/CustomerModal';
import { toggleSideNav } from '../../context/SideNav';
import { useDispatch } from "react-redux";


const Customer = () => {
    const REDUCE = "reduce";
    const [modalOpen, setModalOpen] = useState(false);
    const [actionType, setActionType] = useState(REDUCE);
    const [customers, setCustomers] = useState([
        { id: 1, name: "Eugene", amount: 3500 },
        { id: 2, name: "Ncemeti", amount: 3400 }
    ]);
    const { isNavOpen, openNav, closeNav } = useContext(NavigationContext);

    const handleModalOpen = (type) => {
        setActionType(type);
        setModalOpen((prev) => !prev);
        isNavOpen ? closeNav : openNav;
    }
    return (
        <div>
            <div className="px-5 bg-slate-200">
                {modalOpen && (
                    <div className="">
                        <div className="bg-black opacity-50 absolute top-0 left-0 z-30 h-screen w-full"
                            onClick={handleModalOpen}
                        ></div>
                        <CustomerModal type='customer' customers={customers} actionType={actionType} />
                    </div>
                )}
                <h1 className="text-2xl font-medium text-blue-500">CUSTOMERS</h1>
                <div className='w-full bg-white p-4 mb-5 rounded-sm shadow-sm'>
                    <div className="flex justify-between">
                        <h1 className='hidden md:block font-medium'>Abakiriya</h1>
                        <div className='space-x-2 flex'>
                            <button className="capitalize border-0 rounded-sm px-2 py-1 bg-red-600 text-white"
                                onClick={() => handleModalOpen("reduce")}
                            >
                                kuraho amafaranga
                            </button>
                            <button className="capitalize border-0 rounded-sm px-2 py-1 bg-blue-600 text-white"
                                onClick={() => handleModalOpen("increase")}
                            >
                                Ongeraho amafaranga
                            </button>
                        </div>
                    </div>
                    <div className="my-2 font-light overflow-auto horizontal-custom-scrollbar border border-sky-700">
                        <div className="flex justify-between w-full text-blue-500 font-bold border-b border-sky-700 [&>*]:px-1 [&>*]:shrink-0">
                            <h1>Amazina</h1>
                            <h1>Balance</h1>
                        </div>
                        <div className="border-l border-r">
                            {customers.map((c, i) => {

                                return (
                                    <div className="flex justify-between w-full [&>*]:px-1 [&>*]:shrink-0" key={i}>
                                        <h1>{c.name}</h1>
                                        <h1>{(c.amount).toLocaleString()} Frw</h1>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Customer