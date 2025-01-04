import { useEffect, useState } from "react";
import useSupplier from "../../hooks/useSupplier";
import useProduct from "../../hooks/useProduct";
import { publicAxios } from "../../api/axios";

function UpdateModal({ transaction, setTempProducts, type }) {
    const [trans, setTrans] = useState({
        name: transaction?.Product?.name,
        customer: transaction?.Supplier?.name,
        price: transaction.buying_price || transaction.selling_price,
        transaction_type: transaction.transaction_type,
        quantity: transaction.quantity,
        date: new Date(transaction.updatedAt).toDateString(),
        total_amount: function () {
            return parseFloat(this.price) * parseFloat(this.quantity)
        }
    });
    const [message, setMessage] = useState({ category: "", message: "" });
    const [showMessage, setShowMessage] = useState(false);
    const supplier = useSupplier();
    const product = useProduct();

    // Handlers
    const handleUpdateProduct = () => {
        if (!trans.name || !trans.customer || trans.transaction_type || !trans.price || !trans.quantity || trans.total_amount()) {
            setMessage({ category: 'red', message: 'Fill all required info' });
            handleShowMessage();
            return;
        }

        //Make actual update
        //publicAxios.post('/transactions', {})
        setMessage({ category: "blue", message: "Product updated successfully!" });
        handleShowMessage();
        setTrans({
            name: "",
            customer: "",
            transaction_type: "",
            price: "",
            quantity: "",
            date: "",
        });
    };


    const handleShowMessage = () => {
        setShowMessage(true);

        setTimeout(() => {
            setShowMessage(false);
        }, 4000);
    };
    return (
        <div className="fixed top-20 z-30 w-full md:w-1/2 bg-white rounded-sm shadow-md p-5 left-1/2 -translate-x-1/2">
            <div className="flex justify-between">
                <h1 className="text-xl text-sky-500">Update {type}</h1>
            </div>
            <hr />
            <div
                className={`text-${message.category}-500 text-center shadow-sm text-lg`}
            >
                {showMessage ? message.message : ""}
            </div>
            <div className="[&>*]:flex [&>*]:flex-col [&>*]:justify-between [&>*]:p-2 mt-5">
                <div>
                    <label htmlFor="name">Izina ry'igicuruzwa</label>
                    <select
                        id="name"
                        value={trans.name}
                        className="border px-4 py-1"
                        onChange={(e) => {
                            setTrans({ ...trans, name: e.target.value });
                        }}
                        required
                    >
                        <option value={transaction.Product.name}>
                            {transaction.Product.name}
                        </option>
                        {product?.products?.map((p) => (
                            <option value={p.name} key={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="customer">Uwo uguze nawe</label>
                    <select
                        name="customer"
                        id="customer"
                        value={trans.customer}
                        className="border px-4 py-1"
                        onChange={(e) => {
                            setTrans({ ...trans, customer: e.target.value });
                        }}
                        required
                    >
                        <option value={transaction?.supplier?.name}>
                            {transaction?.Supplier?.name}
                        </option>
                        {supplier?.suppliers.map((t) => (
                            <option value={t.name} key={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="transaction_type">Transaction type</label>
                    <select
                        name="transaction_type"
                        id="id_transaction_type"
                        className="border px-4 py-1"
                        value={trans.transaction_type}
                        onChange={(e) => { setTrans({ ...trans, transaction_type: e.target.value }) }}
                    >
                        <option value={trans.transaction_type}>
                            {transaction.transaction_type}
                        </option>
                        {transaction.transaction_type === "IN" ? (
                            <option value="OUT">OUT</option>
                        ) : (
                            <option value="IN">IN</option>
                        )}
                    </select>
                </div>
                <div>
                    <label htmlFor="price">
                        {transaction.transaction_type === "IN"
                            ? "Igiciro wakiguzeho"
                            : "Igiciro wagurishijeho"}
                    </label>
                    <input
                        type="text"
                        id="price"
                        value={trans.price}
                        className="border px-4 py-1"
                        onChange={(e) => { setTrans({ ...trans, price: e.target.value, }); }}
                    />
                </div>
                <div>
                    <label htmlFor="quantity">Ibiro waguze</label>
                    <input
                        type="text"
                        id="quantity"
                        value={trans.quantity}
                        className="border px-4 py-1"
                        onChange={(e) => {
                            setTrans({ ...trans, quantity: e.target.value });
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="price">Amafaranga yose hamwe</label>
                    <input
                        type="text"
                        id="total_amount"
                        value={trans.total_amount() || transaction.total_amount}
                        className="border px-4 py-1"
                        disabled
                    />
                </div>
                <div>
                    <label htmlFor="date">Italiki wabiguriye</label>
                    <input
                        type="date"
                        id="date"
                        value={trans.date || new Date(transaction.date).toDateString()}
                        className="border px-4 py-1"
                        onChange={(e) => {
                            setTrans({ ...trans, date: e.target.value });
                        }}
                    />
                </div>
                <button
                    className="mt-3 border-0 rounded-sm py-1 px-2 bg-blue-600 text-white"
                    onClick={handleUpdateProduct}
                >
                    Update {type}
                </button>
            </div>
        </div>
    );
}

export default UpdateModal;
