import Navigator from "../../components/Navigator"
import Footer from "../../components/Footer";
import { MdFilterList } from "react-icons/md";
import Modal from "../../components/Modal";
import { useState } from "react";
import UpdateModal from "../../components/UpdateModal";

function Stock() {
    const [products, setProducts] = useState([]);
    const [tempProducts, setTempProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

    const handleFilter = (e) => {
        const value = e.target.textContent;
        const filteredProducts = products.filter((product) => product.name === value)
        setTempProducts(filteredProducts);
    }

    const handleProductUpdate = (id) => {
        const product = products.find((product) => product.id === id)
        setSelectedProduct(product);
        setUpdateModalOpen((prev) => !prev);
    }

    const handleDeleteProduct = () => {
        const isSure = window.confirm("Do you want to delete this product?");
        alert(isSure);
    }

    return (
        <div>
            <Navigator />
            {modalOpen && (
                <div className="relative">
                    <div className="bg-black opacity-50 absolute top-0 left-0 z-30 h-screen w-full"
                        onClick={()=>{setModalOpen((prev)=>!prev)}}
                    ></div>
                    <Modal setProducts={setProducts} products={products} setTempProducts={setTempProducts} />
                </div>
            )}
            <div className="relative top-20 px-5 lg:ml-[18.5%] bg-slate-200">
                <h1 className="text-2xl font-medium text-blue-500">STOCK</h1>
                <div className="bg-white rounded-sm shadow-sm w-full p-4 mb-5">
                    <div className="flex justify-between">
                        <div className="basis-2/3">Product</div>
                        <div className="space-x-4 flex basis-1/3">
                            <button className="basis-1/3 capitalize border-0 rounded-sm py-1 px-2 bg-blue-600 text-white"
                                onClick={()=>setModalOpen((prev)=>!prev)}
                            >
                                add product
                            </button>
                            <div className="basis-2/3 relative flex items-center border rounded-sm justify-center cursor-pointer px-2 hover:text-white hover:bg-blue-600 transition-all duration-300"
                                onClick={()=>setFilterOpen((prev)=>!prev)}
                            >
                                <MdFilterList/>
                                <span>Filter</span>
                                    {
                                        filterOpen ?
                                        <div className="absolute top-full w-full left-1/2 -translate-x-1/2 rounded-sm shadow-sm bg-white py-3 text-black">
                                            {products.map((p, i) => {
                                                return (
                                                    <div className="hover:bg-blue-500 hover:text-white" onClick={handleFilter}>
                                                        {p.name}
                                                    </div>
                                                )
                                            })}
                                            <div className="hover:bg-blue-500 hover:text-white" onClick={()=>setTempProducts(products)}>
                                                Reset filter
                                            </div>
                                        </div>
                                        : ''
                                    }
                                {}
                            </div>
                        </div>
                    </div>
                    <div className="my-2 font-light overflow-auto horizontal-custom-scrollbar">
                        <div className="flex w-full [&>*]:w-3/12 md:[&>*]:w-2/12 text-blue-500 font-bold border [&>*]:border-r [&>*]:px-1 [&>*]:shrink-0">
                            <h1 className="lg:text-left">Igicuruzwa</h1>
                            <h1 className="lg:text-left">Umukiriya</h1>
                            <h1>Igiciro waguzeho</h1>
                            <h1>Ingano waguze</h1>
                            <h1>Italiki (wabiguriye)</h1>
                            <h1>Total (ayo wabitanzeho)</h1>
                            <h1>Action</h1>
                        </div>
                        <div className="border-l border-r">
                            {tempProducts.map((product, index) => {
                                let totalPrice = parseFloat(product.quantity) * parseFloat(product.buyingPrice)
                                return (
                                    <div key={index} className="flex w-full [&>*]:w-3/12 md:[&>*]:w-2/12 [&>*]:px-1 [&>*]:shrink-0">
                                        <h1>{product.name}</h1>
                                        <h1>{product.customer}</h1>
                                        <h1>{product.buyingPrice} Frw</h1>
                                        <h1>{product.quantity} Kgs</h1>
                                        <h1>{product.date}</h1>
                                        <h1>{totalPrice.toLocaleString()} Frw</h1>
                                        <h1 className="space-x-2 cursor-pointer">
                                            <span className="text-blue-500 underline decoration-blue-500" onClick={()=>handleProductUpdate(product.id)}>Edit</span>
                                            <span className="text-red-500 underline decoration-red-500" onClick={()=>handleDeleteProduct(product.id)}>Delete</span>
                                        </h1>
                                        {updateModalOpen && (
                                            <div className="">
                                                <div className="bg-black opacity-50 absolute -top-20 left-0 z-30 h-screen w-full"
                                                    onClick={()=>{setUpdateModalOpen((prev)=>!prev)}}
                                                ></div>

                                                <UpdateModal product={selectedProduct} products={products} setTempProducts={setTempProducts} />
                                            </div>
                                        )}
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

export default Stock;