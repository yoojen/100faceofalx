import { useRef, useState, useContext } from "react";
import { MdFilterList } from "react-icons/md";
import Footer from "../../components/Footer";
import Modal from "../../components/Modal";
import UpdateModal from "../../components/UpdateModal";
import Form from "../../components/Form";
import NavigationContext from "../../context/SideNav";


const UPDATE_MODAL_PLACEHOLDER = "updateModal";
const NORMAL_MODAL_PLACEHOLDER = "normalModal";

function Stock() {
    const [products, setProducts] = useState([]);
    const [tempProducts, setTempProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [type, setType] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const { isNavOpen, openNav, closeNav } = useContext(NavigationContext);
    const navRef = useRef(null);

    const handleModalOpen = (modal) => {
        let modalToUse, dispatchFn;
        if (modal === UPDATE_MODAL_PLACEHOLDER) {
            modalToUse = updateModalOpen;
            dispatchFn = setUpdateModalOpen;
        } else {
            modalToUse = modalOpen;
            dispatchFn = setModalOpen;
        }
        if (modalToUse) {
            if (!navRef.current) {
                dispatchFn((prev) => !prev);
                return;
            } else {
                dispatchFn((prev) => !prev);
                isNavOpen ? closeNav() : openNav();
                return;
            }
        }
        if (!modalToUse) {
            if (!isNavOpen) {
                navRef.current = false;
                dispatchFn((prev) => !prev);
                return;
            } else {
                navRef.current = true;
                isNavOpen ? closeNav() : openNav();
                dispatchFn((prev) => !prev);
                return;
            }
        }
    }
    const handleFilter = (e) => {
        const value = e.target.textContent;
        const filteredProducts = products.filter((product) => product.name === value)
        setTempProducts(filteredProducts);
    }

    const handleProductUpdate = (id, modal) => {
        const product = products.find((product) => product.id === id)
        setSelectedProduct(product);
        handleModalOpen(modal);
    }

    const handleDeleteProduct = (id) => {
        const isSure = window.confirm("Do you want to delete this product?");
        if (isSure) {
            const filteredProducts = products.filter((p) => p.id !== id);
            setProducts(filteredProducts);
            setTempProducts(filteredProducts);
        }
    }


    return (
        <div className="px-5 bg-slate-200">
            {modalOpen && (
                <div className="">
                    <div className="bg-black opacity-50 absolute top-0 left-0 z-30 h-screen w-full"
                        onClick={() => handleModalOpen(NORMAL_MODAL_PLACEHOLDER)}
                    ></div>
                    <Modal type={type} setProducts={setProducts} products={products} setTempProducts={setTempProducts} />
                </div>
            )}
            <Form fields={['product', 'quantity', 'amount', 'year', 'weeks', 'supplier']} />
            <h1 className="text-2xl font-medium text-blue-500 mt-4">STOCK TRANSACTIONS</h1>
            <div className="bg-white rounded-sm shadow-sm p-4 mb-5">
                <div className="flex justify-between">
                    <div className="basis-2/4 font-medium">Product</div>
                    <div className="space-x-4 flex basis-2/4">
                        <button className="basis-1/3 capitalize border-0 rounded-sm py-1 px-2 bg-blue-600 text-white"
                            onClick={() => {
                                setType('supplier');
                                handleModalOpen();
                            }}
                        >
                            add Supplier
                        </button>
                        <button className="basis-1/3 capitalize border-0 rounded-sm py-1 px-2 bg-blue-600 text-white"
                            onClick={() => {
                                setType('product');
                                handleModalOpen();
                            }}
                        >
                            add Product
                        </button>
                        <button className="basis-1/3 capitalize border-0 rounded-sm py-1 px-2 bg-blue-600 text-white"
                            onClick={() => {
                                setType('transaction');
                                handleModalOpen();
                            }}
                        >
                            add transaction
                        </button>
                        <div className="basis-2/3 relative flex items-center border rounded-sm justify-center cursor-pointer px-2 hover:text-white hover:bg-blue-600 transition-all duration-300"
                            onClick={() => setFilterOpen((prev) => !prev)}
                        >
                            <MdFilterList />
                            <span>Filter</span>
                            {
                                filterOpen ?
                                    <div className="absolute top-full w-full left-1/2 -translate-x-1/2 rounded-sm shadow-sm bg-slate-200 p-1 py-3 text-black">
                                        {products.map((p, i) => {
                                            return (
                                                <div className="hover:bg-blue-500 hover:text-white" key={i} onClick={handleFilter}>
                                                    {p.name}
                                                </div>
                                            )
                                        })}
                                        <div className="hover:bg-blue-500 hover:text-white" onClick={() => setTempProducts(products)}>
                                            Reset filter
                                        </div>
                                    </div>
                                    : ''
                            }
                            { }
                        </div>
                    </div>
                </div>
                <div className="my-2 font-light overflow-auto horizontal-custom-scrollbar">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="lg:text-left">Igicuruzwa</th>
                                <th className="lg:text-left">Umukiriya</th>
                                <th>Igiciro</th>
                                <th>Transaction</th>
                                <th>Ingano</th>
                                <th>Italiki</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tempProducts.map((product, index) => {
                                let totalPrice = parseFloat(product.quantity) * parseFloat(product.buyingPrice)
                                return (
                                    <tr key={index}>
                                        <td>{product.name}</td>
                                        <td>{product.customer}</td>
                                        <td>{product.buyingPrice} Frw</td>
                                        <td>{product.transactionType}</td>
                                        <td>{product.quantity} Kgs</td>
                                        <td>{product.date}</td>
                                        <td>{totalPrice.toLocaleString()} Frw</td>
                                        <td className="space-x-2 cursor-pointer">
                                            <span className="text-blue-500 underline decoration-blue-500" onClick={() => handleProductUpdate(product.id, 'updateModal')}>Edit</span>
                                            <span className="text-red-500 underline decoration-red-500" onClick={() => handleDeleteProduct(product.id)}>Delete</span>
                                        </td>
                                        {updateModalOpen && (
                                            <div className="">
                                                <div className="bg-black opacity-50 absolute -top-20 left-0 z-30 h-screen w-full"
                                                    onClick={() => handleProductUpdate(product.id, UPDATE_MODAL_PLACEHOLDER)}
                                                ></div>
                                                <UpdateModal product={selectedProduct} products={products} setTempProducts={setTempProducts} />
                                            </div>
                                        )}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Stock;