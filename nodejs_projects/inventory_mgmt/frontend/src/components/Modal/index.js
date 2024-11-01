import { useState } from "react";

function Modal({ products, setProducts, setTempProducts, type }) {
    // States
    const [productDetail, setProductDetail] = useState({
        id: products.length,
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
        setTempProducts([...products, productDetail]);
        setProductDetail({id: products.length + 1, name: '', customer: '', buyingPrice: '', quantity: '', date: '' })
        setMessage({ category: 'blue', message: 'Product successfully added!' })
        handleShowMessage();
    };
  
    const handleShowMessage = () => {
        setShowMessage(true); // Show the message instantly 
        
        // Set the timer to hide the message after 3 seconds
        setTimeout(() => {
        setShowMessage(false);
        }, 4000); // 5000ms = 3 seconds
    };

    const formElements = (
        <div className="[&>*]:flex [&>*]:flex-col [&>*]:justify-between [&>*]:p-2 mt-5"> 
            <div>
                <label htmlFor="customer">Umukiriya</label>
                <select name="customer" id="customer" value={productDetail.customer} className="border px-4 py-1" onChange={(e)=>{setProductDetail({...productDetail, customer: e.target.value})}}>
                    <option value="" className="text-slate-300">...</option>
                    <option value="mutuye-140-650">mutuye-140-650</option>
                    <option value="ncemeti-145-720">ncemeti-145-720</option>
                </select>
            </div>    
            <div>
                <label htmlFor="customer">Igicuruzwa</label>
                <select name="customer" id="customer" value={productDetail.name} className="border px-4 py-1" onChange={(e)=>{setProductDetail({...productDetail, customer: e.target.value})}}>
                    <option value="" className="text-slate-300">...</option>
                    <option value="mutuye-140-650">mutuye-140-650</option>
                    <option value="ncemeti-145-720">ncemeti-145-720</option>
                </select>
            </div>    
            <div>
                <label htmlFor="price">Igiciro wakiguzeho</label>
                <input type="text" id="price" value={productDetail.buyingPrice} autoComplete="price" className="border px-4 py-1" onChange={(e)=>{setProductDetail({...productDetail, buyingPrice: e.target.value})}}/>  
            </div>
            <div>
                <label htmlFor="quantity">Ibiro waguze</label>
                <input type="text" id="quantity" value={productDetail.quantity} autoComplete="quantity" className="border px-4 py-1" onChange={(e)=>{setProductDetail({...productDetail, quantity: e.target.value})}}/>  
            </div>
            <div>
                <label htmlFor="date">Italiki wabiguriye</label>
                <input type="date" id="date" value={productDetail.date} autoComplete="date" className="border px-4 py-1" onChange={(e)=>{setProductDetail({...productDetail, date: e.target.value})}}/>  
            </div>
            <button className="mt-3 border-0 rounded-sm py-1 px-2 bg-blue-600 text-white"
                onClick={handleAddProduct}
            >
                Add Product
            </button>
        </div>
    )
  return (
    <div className='fixed top-10 z-30 w-2/3 bg-white rounded-sm shadow-md p-5 left-1/2 -translate-x-1/2'>
        <div className="flex justify-between">
            <h1>New product</h1>
        </div>
        <hr />
        <div className={`text-${message.category}-500 text-center shadow-sm text-lg`}>
            {showMessage ? message.message: ''}
        </div>
        {formElements}
    </div>
  )
}

export default Modal;