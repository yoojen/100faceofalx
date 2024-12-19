import { publicAxios } from "../../api/axios";
import { useEffect, useRef, useState } from "react";
import useCategory from "../../hooks/useCategory";
import useProduct from "../../hooks/useProduct";
import useSupplier from '../../hooks/useSupplier';

const IS_SPECIAL = ["Yes", "No"];
function Modal({ products, setProducts, setTempProducts, type }) {
  // States
  const [productDetail, setProductDetail] = useState({ name: "", CategoryId: '', categoryName: '', description: '' });
  const [supplierDetails, setSupplierDetails] = useState({ name: "", isSpecial: "false", balance: 0, });
  const [transactionDetails, setTransactionDetails] = useState({
    SupplierId: '', ProductId: '', transaction_type: '',
    quantity: 0, buying_price: 0, selling_price: 0,
    total_amount: 0
  })
  const [message, setMessage] = useState({ category: "", message: "" });
  const [showMessage, setShowMessage] = useState(false);
  const [categoryType, setCategoryType] = useState(false);
  const category = useCategory();
  const product = useProduct()
  const supplier = useSupplier()
  console.log(product)

  transactionDetails.total_amount = transactionDetails.buying_price || transactionDetails.selling_price && transactionDetails?.quantity
    ? transactionDetails.buying_price || transactionDetails.selling_price * transactionDetails?.quantity : 0
  // Handlers
  const handleCreateSupplier = async (e) => {
    e.preventDefault();
    if (supplierDetails.name === "") {
      setMessage({ category: "red", message: "Fill all required info" });
      handleShowMessage();
      return;
    }
    try {
      const response = await publicAxios.post("/suppliers", {
        name: supplierDetails.name,
        isSpecial: supplierDetails.isSpecial === "true" ? true : false,
        balance: supplierDetails.balance,
      },
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      setSupplierDetails({ name: "", isSpecial: false, balance: 0 });
      setMessage({ category: "blue", message: data.message });
      handleShowMessage();
    } catch (error) {
      if (error.response?.data) {
        setMessage({ category: "red", message: error.response.data.error });
      }
      setMessage({ category: "red", message: "Something went wrong" });
      handleShowMessage();
      return;
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    console.log(productDetail)
    if (productDetail.name === "" || productDetail.category === "") {
      setMessage({ category: "red", message: "Please fill required info." });
      handleShowMessage();
      return;
    }
    try {
      const response = await publicAxios.post('/products', {
        name: productDetail.name, CategoryId: productDetail.CategoryId,
        categoryName: productDetail.categoryName
      }, {
        withCredentials: true
      })
      if (response.status = 200) {
        setMessage({ category: "blue", message: "Product successfully added!", });
        setProductDetail({ name: "", CategoryId: '', categoryName: '', description: '' });
        handleShowMessage();
      }
    } catch (error) {
      if (error.response?.data) {
        setMessage({ category: "red", message: error.response.data.error });
      }
      setMessage({ category: "red", message: "Something went wrong" });
      handleShowMessage();
      return;
    }
  };
  const handleAddTransaction = (e) => {
    e.preventDefault()
    console.log('Hey', productDetail)
  }

  const handleShowMessage = () => {
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, 4000);
  };

  const productTypeFormElements = (
    <div className="[&>*]:flex [&>*]:p-2 mt-5">
      <div className="space-x-3">
        <h3>New Category?</h3>
        <label htmlFor="categoryToggler_1">
          <input
            type="radio"
            value="Yes"
            name="categoryToggler"
            id="categoryToggler"
            className="h-4 w-4 mr-1"
            onChange={() => setCategoryType(true)}
          />
          Yes
        </label>
        <label htmlFor="categoryToggler_2">
          <input
            type="radio"
            value="No"
            name="categoryToggler"
            id="categoryToggler"
            className="h-4 w-4 mr-1"
            defaultChecked
            onChange={() => setCategoryType(false)}
          />
          No
        </label>
      </div>
      <hr />
      <div>
        <label htmlFor="name" className="basis-1/2">
          Izina{" "}
        </label>
        <input
          type="text"
          id="name"
          value={productDetail.name}
          autoComplete="quantity"
          className="border border-black px-4 py-1 basis-1/2"
          onChange={(e) => { setProductDetail({ ...productDetail, name: e.target.value }) }}
        />
      </div>
      <div>
        <label htmlFor="category" className="basis-1/2">
          Category
        </label>
        {!categoryType
          ? <select
            name='category'
            id="category"
            className="border border-black px-4 py-1 basis-1/2"
            onChange={(e) => setProductDetail({ ...productDetail, CategoryId: e.target.value })}
          >
            <option value="" className="text-slate-300">...</option>
            {category.categories.map((c) => {
              return (<option key={c.id} value={c.id}>{c.name}</option>)
            })}
          </select>
          : <input
            type="text"
            id="description"
            autoComplete="price"
            placeholder='Type something'
            aria-placeholder="type something"
            className="border border-black px-4 py-1 basis-1/2"
            value={productDetail.categoryName}
            onChange={(e) => setProductDetail({ ...productDetail, categoryName: e.target.value })}
          />
        }
      </div>
      <div>
        <label htmlFor="description" className="basis-1/2">
          description
        </label>
        <textarea
          name="description"
          id="description"
          value={productDetail.description}
          onChange={(e) => setProductDetail({ ...productDetail, description: e.target.value })}
          className="border border-black px-4 py-1 basis-1/2">
        </textarea>
      </div>
    </div>
  );

  const supplierTypeFormElements = (
    <div className="my-3 [&>*]:space-y-2">
      <div className="flex flex-col mb-4">
        <label htmlFor="name">Izina </label>
        <input
          type="text"
          id="name"
          value={supplierDetails.name}
          className="border px-4 py-1"
          onChange={(e) => { setSupplierDetails({ ...supplierDetails, name: e.target.value }); }}
          required
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="is_special">Is Special</label>
        <select
          name="is_special"
          id="is_special"
          className="border px-4 py-1 bg-white"
          value={supplierDetails.isSpecial}
          onChange={(e) => setSupplierDetails({ ...supplierDetails, isSpecial: e.target.value })}
        >
          <option value="true">{IS_SPECIAL[0]}</option>
          <option value="false">{IS_SPECIAL[1]}</option>
        </select>
      </div>
      {supplierDetails.isSpecial !== "false" && (
        <div className="flex flex-col">
          <label htmlFor="">Balance</label>
          <input
            type="number"
            value={supplierDetails.balance}
            className="border px-4 py-1 bg-white"
            required
            onChange={(e) => setSupplierDetails({ ...supplierDetails, balance: e.target.value })}
          />
        </div>
      )}
    </div>
  );

  const formElements = (
    <div className="[&>*]:flex [&>*]:flex-col [&>*]:justify-between [&>*]:p-2 mt-5">
      <div>
        <label htmlFor="customer_id">Umukiriya/Umugirisha</label>
        <select
          name="customer_id"
          id="customer_id"
          value={transactionDetails.SupplierId}
          className="border px-4 py-1"
          onChange={(e) => { setTransactionDetails({ ...transactionDetails, SupplierId: e.target.value }); }}
          required
        >
          <option value="">...</option>
          {supplier.suppliers.map((s) => <option key={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="product_id">Igicuruzwa</label>
        <select
          name="product_id"
          id="product_id"
          value={transactionDetails.ProductId}
          className="border px-4 py-1"
          onChange={(e) => { setTransactionDetails({ ...transactionDetails, ProductId: e.target.value }); }}
          required
        >
          <option value="" className="text-slate-300">...</option>
          {product.products.map((p) => <option value={p.id} key={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="transaction_type">transaction type</label>
        <select
          name="transaction_type"
          id="transaction_type"
          value={productDetail.transactionType}
          className="border px-4 py-1"
          onChange={(e) => { setTransactionDetails({ ...transactionDetails, transaction_type: e.target.value, }); }}
          required
        >
          <option value="" className="text-slate-300">
            ...
          </option>
          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
        </select>
      </div>
      <div>
        <label htmlFor="quantity">Ibiro waguze</label>
        <input
          type="text"
          id="quantity"
          value={transactionDetails.quantity}
          autoComplete="quantity"
          className="border px-4 py-1"
          onChange={(e) => { setTransactionDetails({ ...transactionDetails, quantity: e.target.value }) }}
          required
        />
      </div>
      <div>
        <label htmlFor="price">Igiciro</label>
        <input
          type="text"
          id="price"
          value={transactionDetails.buying_price || transactionDetails.selling_price}
          autoComplete="price"
          className="border px-4 py-1"
          onChange={(e) => {
            if (transactionDetails.transaction_type === 'IN') {
              setTransactionDetails({ ...transactionDetails, buying_price: e.target.value });
            } else {
              setTransactionDetails({ ...transactionDetails, selling_price: e.target.value });
            }
          }}
          required
        />
      </div>
      <div>
        <label htmlFor="price">Amafaranga yose hamwe</label>
        <input
          type="text"
          id="total_amount"
          value={transactionDetails.total_amount}
          className="border px-4 py-1"
          disabled
        />
      </div>
    </div>
  );

  return (
    <div className="fixed top-20 z-30 w-2/3 bg-white rounded-sm shadow-md p-5 left-1/2 -translate-x-1/2">
      <div className="flex justify-between">
        <h1 className="font-bold text-lg">New {type}</h1>
      </div>
      <hr />
      <div
        className={`text-${message.category}-500 text-center shadow-sm text-sm`}
      >
        {showMessage ? message.message : ""}
      </div>
      <form onSubmit={
        type === "transaction"
          ? handleAddTransaction
          : type === "supplier"
            ? handleCreateSupplier
            : handleAddProduct
      }>
        {type === "transaction"
          ? formElements
          : type === "supplier"
            ? supplierTypeFormElements
            : productTypeFormElements}
        <button
          className="mt-3 border-0 rounded-sm py-1 px-2 bg-blue-600 text-white"
          type="submit"
        >
          Add {type}
        </button>
      </form>
    </div>
  );
}

export default Modal;
