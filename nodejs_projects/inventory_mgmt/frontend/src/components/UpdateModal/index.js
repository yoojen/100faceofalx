import { useState } from "react";

function UpdateModal({ product, products, setTempProducts }) {
    // States
    console.log(product.id, "from modal")
    const [productDetail, setProductDetail] = useState({
        id: product.id,
        name: product.name,
        customer: product.customer,
        buyingPrice: product.buyingPrice,
        quantity: product.quantity,
        date: product.date
    });
    const [message, setMessage] = useState({category: '', message: ''});
    const [showMessage, setShowMessage] = useState(false);
    
    // Handlers
    const handleUpdateProduct = () => {
        const product = products.find((product) => product.id === productDetail.id)
        if (product.name !== productDetail.name) product.name = productDetail.name;
        if (product.customer !== productDetail.customer) product.customer = productDetail.customer;
        if (product.buyingPrice !== productDetail.buyingPrice) product.buyingPrice = productDetail.buyingPrice;
        if (product.quantity !== productDetail.quantity) product.quantity = productDetail.quantity;
        if (product.date !== productDetail.date) product.date = productDetail.date;
        setMessage({category: 'blue', message: 'Product updated successfully!'})
        handleShowMessage();
        setProductDetail({
            id: '',
            name: '',
            customer: '',
            buyingPrice: '',
            quantity: '',
            date:''
        })
    };
  
    const handleShowMessage = () => {
        setShowMessage(true);
        
        setTimeout(() => {
        setShowMessage(false);
        }, 4000);
    };
  return (
    <div className='fixed top-10 z-30 w-full md:w-1/2 bg-white rounded-sm shadow-md p-5 left-1/2 -translate-x-1/2'>
        <div className="flex justify-between">
            <h1>Update product</h1>
        </div>
        <hr />
        <div className={`text-${message.category}-500 text-center shadow-sm text-lg`}>
            {showMessage ? message.message: ''}
        </div>
        <div className="[&>*]:flex [&>*]:flex-col [&>*]:justify-between [&>*]:p-2 mt-5"> 
            <div>
                <label htmlFor="name">Izina ry'igicuruzwa</label>
                <input type="text" id="name" value={productDetail.name} className="border px-4 py-1" onChange={(e)=>{setProductDetail({...productDetail, name: e.target.value})}}/>
            </div>
            <div>
                <label htmlFor="customer">Uwo uguze nawe</label>
                <select name="customer" id="customer" value={productDetail.customer} className="border px-4 py-1" onChange={(e)=>{setProductDetail({...productDetail, customer: e.target.value})}}>
                    <option value="">.....</option>
                    <option value="mutuye">Mutuye</option>
                    <option value="ncemeti">Ncemeti</option>
                </select>  
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
                onClick={handleUpdateProduct}
            >
                Update Product
            </button>
        </div>
    </div>
  )
}

export default UpdateModal;