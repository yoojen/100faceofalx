import { useState } from "react";

function Modal({ products, setProducts }) {
    // States
    const [productDetail, setProductDetail] = useState({
        name: '',
        customer: '',
        buyingPrice: '',
        quantity: '',
        date: ''
    });
    const [message, setMessage] = useState({category: '', message: ''});
    const [showMessage, setShowMessage] = useState(false);

    // Handlers
    const handleAddProduct = () => {
        setProducts([...products, productDetail]);
        console.log("product being added...");
        setProductDetail({ name: '', customer: '', buyingPrice: '', quantity: '', date: '' })
        setMessage({ category: 'blue', message: 'Product successfully added!' })
        handleShowMessage();
    };
  
    const handleShowMessage = () => {
        setShowMessage(true); // Show the message instantly
        
        // Set the timer to hide the message after 3 seconds
        setTimeout(() => {
        setShowMessage(false);
        }, 5000); // 5000ms = 3 seconds
    };
  return (
    <div className='fixed top-20 z-30 w-full bg-white rounded-sm shadow-md p-5 md:left-1/3 md:w-2/3 lg:left-1/3 lg:w-1/3'>
        <div className="flex justify-between">
            <h1>New product</h1>
        </div>
        <hr />
        <div className={`text-${message.category}-500 text-center shadow-sm text-lg`}>
            {showMessage ? message.message: ''}
        </div>
        <div className="[&>*]:flex [&>*]:justify-between [&>*]:p-2 mt-5"> 
            <div>
                <label htmlFor="name">Izina ry'igicuruzwa</label>
                <input type="text" id="name" value={productDetail.name} className="border px-4 py-1" onChange={(e)=>{setProductDetail({...productDetail, name: e.target.value})}}/>
            </div>
            <div>
                <label htmlFor="customer">Uwo uguze nawe</label>
                <input type="text" id="customer" value={productDetail.customer} className="border px-4 py-1" onChange={(e)=>{setProductDetail({...productDetail, customer: e.target.value})}}/>  
            </div>
            <div>
                <label htmlFor="price">Igiciro wakiguzeho</label>
                <input type="text" id="price" value={productDetail.buyingPrice} className="border px-4 py-1" onChange={(e)=>{setProductDetail({...productDetail, buyingPrice: e.target.value})}}/>  
            </div>
            <div>
                <label htmlFor="quantity">Ibiro waguze</label>
                <input type="text" id="quantity" value={productDetail.quantity} className="border px-4 py-1" onChange={(e)=>{setProductDetail({...productDetail, quantity: e.target.value})}}/>  
            </div>
            <div>
                <label htmlFor="date">Italiki wabiguriye</label>
                <input type="date" id="date" value={productDetail.date} className="border px-4 py-1" onChange={(e)=>{setProductDetail({...productDetail, date: e.target.value})}}/>  
            </div>
            <button className="mt-3 border-0 rounded-sm py-1 px-2 bg-blue-600 text-white"
                onClick={handleAddProduct}
            >
                Add Product
            </button>
        </div>
    </div>
  )
}

export default Modal;