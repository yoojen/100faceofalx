import { useEffect, useState } from "react";

function CustomerModal({ customers, actionType }) {
  const REDUCE = "reduce";
  const [details, setDetails] = useState({ id: "", reduced: 0 });
  const [message, setMessage] = useState({ msg: "", category: "" });
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (details.id == "" || details.reduced == "") return;
    const customer = customers.find((c) => c.id == details.id);
    console.log(customer, details);

    if (actionType == REDUCE) {
      const remains = customer.amount - parseFloat(details.reduced);
      if (remains > 0) {
        // true
        customer.amount = remains;
        setShowMessage(true);
        setMessage({ msg: "Operation done successfully!😊", category: "blue" });
      } else {
        // false
        setShowMessage(true);
        setMessage({ msg: "Operation failed!😞", category: "red" });
      }
    } else {
      const balance = customer.amount + parseFloat(details.reduced);
      customer.amount = balance;
      setShowMessage(true);
      setMessage({ msg: "Operation done successfully!😊", category: "blue" });
    }
  };

  useEffect(() => {
    setTimeout(() => setShowMessage(false), 3000);
  }, [showMessage]);

  return (
    <div className="w-2/3 fixed top-10 z-30 bg-white rounded-sm shadow-md p-5 left-1/2 -translate-x-1/2">
      <div className="flex justify-between">
        <h1>Customer</h1>
      </div>
      <hr />
      <div
        className={`text-${message.category}-500 text-center shadow-sm text-lg`}
      >
        {showMessage ? message.msg : ""}
      </div>
      <form
        className="[&>*]:flex [&>*]:flex-col [&>*]:justify-between [&>*]:p-2 mt-5"
        onSubmit={handleSubmit}
      >
        <div>
          <select
            className="border px-4 py-2"
            onChange={(e) => setDetails({ ...details, id: e.target.value })}
          >
            <option value="">...</option>
            {customers.map((c, i) => {
              return (
                <option key={i} value={c.id}>
                  {c.name}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label htmlFor="amafaranga">Ayo umuhaye</label>
          <input
            type="text"
            id="amafaranga"
            value={details.reduced}
            autoComplete="amafaranga"
            className="border px-4 py-1"
            onChange={(e) =>
              setDetails({ ...details, reduced: e.target.value })
            }
          />
        </div>
        <button
          type="submit"
          className="mt-3 border-0 rounded-sm py-1 px-2 bg-blue-600 text-white"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}

export default CustomerModal;
