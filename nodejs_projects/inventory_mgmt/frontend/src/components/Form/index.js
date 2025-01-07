import { useEffect, useState } from "react";
import { publicAxios } from "../../api/axios";
import useGetFetch from "../../hooks/useGetFetch";
import useProduct from "../../hooks/useProduct";
import useSupplier from "../../hooks/useSupplier";

const Form = ({ fields, where, transactions, setTransUrl, httpMethod }) => {
  const newObj = {};
  const [query, setQuery] = useState({
    ProductId: '',
    quantity: 0,
    year: 0,
    SupplierId: ''
  });
  const product = useProduct()
  const supplier = useSupplier()
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
    setTransUrl(`/transactions/q/search?${completeQuery}&pageSize=10&page=1`)
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
                  value={query['ProductId']}
                  onChange={(e) => { setQuery({ ...query, [field]: e.target.value }) }}
                  onClick={(e) => handleSubmit(e)}
                >
                  <option value=''>...</option>
                  {product.products.map((p) => <option value={p.id}>{p.name}</option>)}

                </select>
              ) : field === "SupplierId" ? (
                <select
                  name={field}
                  id={`id_${field}`}
                  className="border px-4 py-1 w-50 sm:w-1/2"
                  value={query['SupplierId']}
                  onChange={(e) => { setQuery({ ...query, [field]: e.target.value }) }}
                  onClick={(e) => handleSubmit(e)}
                >
                  <option value=''>...</option>
                  {supplier.suppliers.map((s) => <option value={s.id}>{s.name}</option>)}
                </select>
              ) : (
                <input
                  type="text"
                  className="border px-4 py-1 w-50 sm:w-1/2"
                  value={query[`${field}`]}
                  onChange={(e) => {
                    setQuery((prev) => ({ ...prev, [field]: e.target.value }))
                  }}
                  onKeyUp={(e) => handleSubmit(e)}
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
