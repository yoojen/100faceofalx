import { useRef, useState, useContext, useEffect } from "react";
import { MdFilterList } from "react-icons/md";
import Footer from "../../components/Footer";
import Modal from "../../components/Modal";
import UpdateModal from "../../components/UpdateModal";
import Form from "../../components/Form";
import NavigationContext from "../../context/SideNav";
import useGetFetch from "../../hooks/useGetFetch";
import useTransaction from "../../hooks/useTransaction";
import { publicAxios } from "../../api/axios";

const UPDATE_MODAL_PLACEHOLDER = "updateModal";
const NORMAL_MODAL_PLACEHOLDER = "normalModal";

function Stock() {
  const [products, setProducts] = useState([]);
  const [tempProducts, setTempProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [type, setType] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const { isNavOpen, openNav, closeNav } = useContext(NavigationContext);
  const [message, setMessage] = useState({ category: "", message: "" });
  const [showMessage, setShowMessage] = useState(false);

  const navRef = useRef(null);
  const transactions = useTransaction();

  const handleShowMessage = () => {
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, 4000);
  };

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
  };
  const handleFilter = (e) => {
    const value = e.target.textContent;
    const filteredProducts = transactions.transactions.filter(
      (t) => t.transaction_type === value
    );
    setTempProducts(filteredProducts);
  };

  const handleProductUpdate = (id, modal) => {
    const transaction = transactions?.transactions?.find((t) => t.id === id);
    console.log("Attempted to update the transaction", transaction, id, modal);
    setSelectedProduct(transaction);
    handleModalOpen(modal);
  };

  const handleDeleteProduct = async (id) => {
    const isSure = window.confirm("Do you want to delete this product?");
    if (!isSure) {
      return;
    }
    try {
      const response = await publicAxios.delete(`transactions/erase/${id}`);
      if (response.status === 204) {
        setMessage({
          category: "blue",
          message: "Transaction deleted successfully",
        });
        handleShowMessage();
      }
    } catch (error) {
      setMessage({ category: "red", message: String(error) });
      handleShowMessage();
      console.log(error);
    } finally {
      transactions.fetchAgain();
    }
  };

  return (
    <div
      className={`${updateModalOpen || modalOpen ? "h-screen overflow-hidden" : ""
        } px-5 bg-slate-200`}
    >
      {modalOpen && (
        <div className="">
          <div
            className="bg-black opacity-50 absolute top-0 left-0 z-30 h-screen w-full"
            onClick={() => handleModalOpen(NORMAL_MODAL_PLACEHOLDER)}
          ></div>
          <Modal
            type={type}
            setProducts={setProducts}
            products={products}
            setTempProducts={setTempProducts}
          />
        </div>
      )}
      {updateModalOpen && (
        <span className="">
          <span
            className="bg-black opacity-50 absolute top-0 left-0 z-30 h-screen w-full"
            onClick={() => handleModalOpen(UPDATE_MODAL_PLACEHOLDER)}
          ></span>
          <UpdateModal transaction={selectedProduct} transactions={transactions} type="Transaction" />
        </span>
      )}
      <Form
        fields={["product", "quantity", "amount", "year", "weeks", "supplier"]}
      />
      <h1 className="text-2xl font-medium text-blue-500 mt-4">
        STOCK TRANSACTIONS
      </h1>
      <div className="bg-white rounded-sm shadow-sm p-4 mb-5">
        <div className="flex justify-end">
          <div className="space-x-4 flex basis-2//3">
            <button
              className="border-0 rounded-sm py-1 px-2 bg-sky-600 text-white font-medium capitalize"
              onClick={() => {
                setType("supplier");
                handleModalOpen();
              }}
            >
              add Supplier
            </button>
            <button
              className="border-0 rounded-sm py-1 px-2 bg-sky-600 text-white font-medium capitalize"
              onClick={() => {
                setType("product");
                handleModalOpen();
              }}
            >
              add Product
            </button>
            <button
              className="border-0 rounded-sm py-1 px-2 bg-sky-600 text-white font-medium capitalize"
              onClick={() => {
                setType("transaction");
                handleModalOpen();
              }}
            >
              add transaction
            </button>
            <div
              className="relative flex items-center border rounded-sm justify-center cursor-pointer px-2 hover:text-white hover:bg-blue-600 transition-all duration-300"
              onClick={() => setFilterOpen((prev) => !prev)}
            >
              <MdFilterList />
              <span>Filter</span>
              {filterOpen ? (
                <div className="absolute top-full w-full left-1/2 -translate-x-1/2 rounded-sm shadow-sm bg-slate-200 space-y-3 mt-1 text-black">
                  <div
                    className="hover:bg-blue-500 hover:text-white"
                    onClick={handleFilter}
                  >
                    IN
                  </div>
                  <div
                    className="hover:bg-blue-500 hover:text-white"
                    onClick={handleFilter}
                  >
                    OUT
                  </div>
                  <div
                    className="hover:bg-blue-500 hover:text-white"
                    onClick={() => setTempProducts([])}
                  >
                    Reset filter
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="my-2 font-light overflow-auto horizontal-custom-scrollbar">
          <h4 className={`text-${message.category}-500 text-lg`}>
            {showMessage && message.message}
          </h4>
          <table className="w-full">
            <thead>
              <tr className="uppercase">
                <th>Igicuruzwa</th>
                <th>vendor/customer</th>
                <th>Igiciro</th>
                <th>Transaction</th>
                <th>Ingano</th>
                <th>Italiki</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.transactions?.map((t) => (
                <tr key={t.id}>
                  <td>{t?.Product?.name}</td>
                  <td>{t?.Supplier?.name}</td>
                  <td>
                    RF{" "}
                    {parseFloat(
                      t.buying_price || t.selling_price
                    ).toLocaleString()}
                  </td>
                  <td>{t.transaction_type}</td>
                  <td>{parseFloat(t.quantity).toLocaleString()}</td>
                  <td>{new Date(t.updatedAt).toLocaleDateString()}</td>
                  <td>RF {parseFloat(t.total_amount).toLocaleString()}</td>
                  <td className="space-x-2 cursor-pointer">
                    <span
                      className="text-blue-500 underline decoration-blue-500"
                      onClick={() => handleProductUpdate(t.id, "updateModal")}
                    >
                      Edit
                    </span>
                    <span
                      className="text-red-500 underline decoration-red-500"
                      onClick={() => handleDeleteProduct(t.id)}
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Stock;
