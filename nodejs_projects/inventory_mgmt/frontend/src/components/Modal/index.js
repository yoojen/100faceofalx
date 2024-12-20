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
        if (
            (productDetail.id === '') || (productDetail.customer === '') || (productDetail.name === '') ||
            (productDetail.buyingPrice === '') || (productDetail.quantity === '')
        ) {
            setMessage({category: 'red', message: 'Please fill required info. Date is optional'});
            handleShowMessage();
            return;
        }
        setProducts([...products, productDetail]);
        setTempProducts([...products, productDetail]);
        setProductDetail({id: products.length + 1, name: '', customer: '', buyingPrice: '', quantity: '', date: '' })
        setMessage({ category: 'blue', message: 'Transaction successfully added!' })
        handleShowMessage();
    };
  
    const handleShowMessage = () => {
        setShowMessage(true);
        
        setTimeout(() => {
        setShowMessage(false);
        }, 4000);
    };
    
    const productTypeFormElements = (
        <div className="[&>*]:flex [&>*]:flex-col [&>*]:justify-between [&>*]:p-2 mt-5"> 
            <div>
                <label htmlFor="name">Izina </label>
                <input type="text" id="name" value={productDetail.quantity} autoComplete="quantity" className="border px-4 py-1" onChange={(e)=>{}}/>  
            </div>
            <div>
                <label htmlFor="category">Category</label>
                <select name="category" id="category" value='' className="border px-4 py-1" onChange={(e)=>{}}>
                    <option value="" className="text-slate-300">...</option>
                    <option value="">cat 1</option>
                    <option value="">cat 2</option>
                </select>
            </div>
            <div>
                <label htmlFor="description">description</label>
                <input type="text" id="description" value='' autoComplete="price" className="border px-4 py-1" onChange={(e)=>{}}/>  
            </div>
        </div>
    );

    const supplierTypeFormElements = (
        <div className="[&>*]:flex [&>*]:flex-col [&>*]:justify-between [&>*]:p-2 mt-5"> 
            <div>
                <label htmlFor="name">Izina </label>
                <input type="text" id="name" value={productDetail.quantity} autoComplete="quantity" className="border px-4 py-1" onChange={(e)=>{}}/>  
            </div>
            <div>
                <label htmlFor="is_special">Is Special</label>
                <select name="is_special" id="is_special" value='' className="border px-4 py-1" onChange={(e)=>{}}>
                    <option value="" className="text-slate-300">...</option>
                    <option value="">cat 1</option>
                    <option value="">cat 2</option>
                </select>
            </div>
        </div>
    );
    const formElements = (
        <div className="[&>*]:flex [&>*]:flex-col [&>*]:justify-between [&>*]:p-2 mt-5"> 
            <div>
                <label htmlFor="customer">Umukiriya/Umugirisha</label>
                <select name="customer" id="customer" value={productDetail.customer} className="border px-4 py-1" onChange={(e)=>{setProductDetail({...productDetail, customer: e.target.value})}}>
                    <option value="" className="text-slate-300">...</option>
                    <option value="Doe">Doe</option>
                    <option value="John">John</option>
                </select>
            </div>    
            <div>
                <label htmlFor="customer">Igicuruzwa</label>
                <select name="customer" id="customer" value={productDetail.name} className="border px-4 py-1" onChange={(e)=>{setProductDetail({...productDetail, name: e.target.value})}}>
                    <option value="" className="text-slate-300">...</option>
                    <option value="Sorghum">Sorghum</option>
                    <option value="Beans">Beans</option>
                </select>
            </div>    
            <div>
                <label htmlFor="quantity">transaction type</label>
                <select name="customer" id="customer" value='' className="border px-4 py-1" onChange={(e)=>{}}>
                    <option value="" className="text-slate-300">...</option>
                    <option value="IN">IN</option>
                    <option value="OUT">OUT</option>
                </select>
            </div>
            <div>
                <label htmlFor="quantity">Ibiro waguze</label>
                <input type="text" id="quantity" value={productDetail.quantity} autoComplete="quantity" className="border px-4 py-1" onChange={(e)=>{setProductDetail({...productDetail, quantity: e.target.value})}}/>  
            </div>
            <div>
                <label htmlFor="price">Igiciro</label>
                <input type="text" id="price" value={productDetail.buyingPrice} autoComplete="price" className="border px-4 py-1" onChange={(e)=>{setProductDetail({...productDetail, buyingPrice: e.target.value})}}/>  
            </div>
            <div>
                <label htmlFor="price">Amafaranga yose hamwe</label>
                <input type="text" id="total_amount" value='' className="border px-4 py-1" onChange={(e)=>{}}/>  
            </div>
            <div>
                <label htmlFor="date">Italiki wabiguriye</label>
                <input type="date" id="date" value={productDetail.date} autoComplete="date" className="border px-4 py-1" onChange={(e)=>{setProductDetail({...productDetail, date: e.target.value})}}/>  
            </div>
        </div>
    )
    if (type === 'transactions') {
        
    }
    return (
    <div className='fixed top-20 z-30 w-2/3 bg-white rounded-sm shadow-md p-5 left-1/2 -translate-x-1/2'>
        <div className="flex justify-between">
            <h1>New {type}</h1>
        </div>
        <hr />
        <div className={`text-${message.category}-500 text-center shadow-sm text-lg`}>
            {showMessage ? message.message: ''}
        </div>
        { type === 'transaction' ? (formElements) : type === 'supplier' ? (supplierTypeFormElements) : (productTypeFormElements) }
        <button className="mt-3 border-0 rounded-sm py-1 px-2 bg-blue-600 text-white"
            onClick={handleAddProduct}
        >
            Add { type }
        </button>
    </div>
  )
}

export default Modal;