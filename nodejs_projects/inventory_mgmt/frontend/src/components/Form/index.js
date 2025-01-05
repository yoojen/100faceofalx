import { useState } from "react";
import { publicAxios } from "../../api/axios";
import useGetFetch from "../../hooks/useGetFetch";

const Form = ({ fields, where, transactions, setTransUrl, httpMethod }) => {
  const newObj = {};
  const [query, setQuery] = useState({
    ProductId: '',
    quantity: 0,
    year: 0,
    SupplierId: ''
  });
  // const transactions = useGetFetch({ url: transUrl });

  const buildQuery = (params) => {
    return Object.keys(params)
      .filter((k) => params[k])
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join('&')
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const completeQuery = buildQuery(query);
    setTransUrl(`/transactions/q/search?${completeQuery}&pageSize=10`)
    // transactions.fetchData()
    // console.log(transUrl, transactions)
  }



  return (
    <div>
      <p>Koresha iyi form ushaka Igicuruzwa cg transaction</p>
      <form
        className="sm:flex items-center justify-between bg-white rounded-sm shadow-sm p-4"
        onSubmit={handleSubmit}
      >
        {fields.map((field, index) => {
          return (
            <div key={index} className="flex flex-col  [&>*]:capitalize w-full">
              <label htmlFor={field}>{field}</label>
              {field === "ProductId" ? (
                <select
                  name={field}
                  id={`id_${field}`}
                  className="border px-4 py-1 w-50 sm:w-1/2"
                >
                  <option value="">----</option>
                  <option value="1">Amasaka</option>
                </select>
              ) : field === "supplier" ? (
                <select
                  name={field}
                  id={`id_${field}`}
                  className="border px-4 py-1 w-50 sm:w-1/2"
                >
                  <option value="">----</option>
                  <option value="1">John</option>
                </select>
              ) : (
                <input
                  type="text"
                  className="border px-4 py-1 w-50 sm:w-1/2"
                  value={query[`${field}`]}
                  onChange={(e) => {
                    console.log([field])
                    setQuery((prev) => ({ ...prev, [field]: e.target.value }))
                  }}
                />
              )}
            </div>
          );
        })}
        <div>
          <p className="italic text-sky-500">kanda hano</p>
          <button
            type="submit"
            className="px-5 py-1 bg-sky-500 border-0 text-white font-medium"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
