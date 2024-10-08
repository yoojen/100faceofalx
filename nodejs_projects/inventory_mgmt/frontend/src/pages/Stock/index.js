import Navigator from "../../components/Navigator"
import Footer from "../../components/Footer";
import { MdFilterList } from "react-icons/md";
import Modal from "../../components/Modal";
import { useState } from "react";

function Stock() {
    const [products, setProducts] = useState([]);
    const [modalOpen, setModalOpen] = useState(true);
    const handleFilter = () => {
        alert("Attempted to filter");
    }

    return (
        <div>
            <Navigator />
            {modalOpen ?
                <>
                    <div className="relative">
                        <div className="bg-black opacity-50 absolute top-0 left-0 z-30 h-screen w-full"
                            onClick={()=>{setModalOpen((prev)=>!prev)}}
                        ></div>
                        <Modal setProducts={setProducts} products={products}/>
                    </div>
                </>
                : null
            }
            <div className="relative top-20 px-5 lg:ml-[18.5%] bg-slate-200">
                <h1 className="text-2xl font-medium text-blue-500">STOCK</h1>
                <div className="bg-white rounded-sm shadow-sm w-full p-4 mb-5">
                    <div className="flex justify-between">
                        <div>Product</div>
                        <div className="space-x-4 flex">
                            <button className="capitalize border-0 rounded-sm py-1 px-2 bg-blue-600 text-white"
                                onClick={()=>setModalOpen((prev)=>!prev)}
                            >
                                add product
                            </button>
                            <div className="flex items-center border rounded-sm justify-center cursor-pointer px-2 hover:text-white hover:bg-blue-600 transition-all duration-300"
                                onClick={handleFilter}
                            >
                                <MdFilterList />
                                <span>Filter</span>
                            </div>
                        </div>
                    </div>
                    <div className="my-2 font-light">
                        <table className="w-full text-right text-black border-collapse border-e border-s border-t">
                            <thead className="text-slate-400">
                                <tr className="border-b">
                                    <th className="text-left">Igicuruzwa</th>
                                    <th>Umukiriya</th>
                                    <th>Igiciro waguzeho</th>
                                    <th>Ingano waguze</th>
                                    <th>Italiki (wabiguriye)</th>
                                    <th>Total (ayo wabitanzeho)</th>
                                </tr>
                            </thead>
                            <tbody className="[&>*]:py-5">
                                {products.map((product, index) => {
                                    let totalPrice = parseFloat(product.quantity) * parseFloat(product.buyingPrice)
                                    return (
                                        <tr key={index}>
                                            <td className="text-left">{product.name}</td>
                                            <td>{product.customer}</td>
                                            <td>{product.buyingPrice} Frw</td>
                                            <td>{product.quantity} Kgs</td>
                                            <td>{product.date}</td>
                                            <td>{totalPrice.toLocaleString()} Frw</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Stock;