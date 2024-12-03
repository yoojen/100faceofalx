import React from 'react'

const SideWindow = ({ }) => {
    const actionType = 'product';
  return (
    <div className="w-3/4 p-4 absolute z-30 right-0 top-0 h-screen border bg-white border-gray-300 rounded-sm shadow-lg">
        <button className="absolute -top-3 left-0 -ml-3 p-0 h-10 w-10 text-white font-bold text-xl bg-red-500 rounded-full">X</button>
        <h2 className="text-xl text-center font-bold mb-4">Supplier or Product Inspection</h2>
        <form className="mb-4">
            <div className="mb-4 flex justify-stretch flex-wrap p-2 bg-slate-200 [&>*]:mr-5">
                <label className="mb-2 flex items-center"> 
                    <input type="checkbox" className="mr-2 peer h-5 w-5" /> 
                    Category
                    <select name="" id="" className='hidden peer-checked:block border px-2 py-1 bg-slate-300 mx-2'>
                        <option value="">...</option>
                        <option value="">Category</option>
                    </select>
                </label>
                <label className="mb-2 flex items-center">
                    <input type="checkbox" className="mr-2 peer h-5 w-5" /> 
                      { actionType === 'product'? 'Supplier' : 'Quantity'}
                    <div className='hidden peer-checked:block border px-2 py-1 bg-slate-300 p-2 mx-2'>
                        {actionType === 'product' ? (
                            <select name='' id=''>
                                <option value="">...</option>
                                <option value="">Supplier</option>
                            </select>
                        ) : (<select name='' id=''>
                              <option value="">...</option>
                              <option value="">remaining qty for db</option>
                          </select>)}
                    </div>
                </label>
                <label className="mb-2 flex items-center"> 
                    <input type="checkbox" className="mr-2 peer h-5 w-5" />
                    Date
                    <div className='hidden peer-checked:block bg-slate-300 p-2 mx-2'>
                        <label htmlFor="">
                            Starting date
                            <input type="date" name="" id="" className='border px-2 py-1' />
                        </label>
                        <label htmlFor="" className='flex-end'>
                            Ending date
                            <input type="date" name="" id="" className='border px-2 py-1' />
                        </label>
                    </div>
                </label>
                <label className="mb-2 flex items-center">
                    <input type="checkbox" className="mr-2 peer h-5 w-5" />
                    Transaction Quantity
                    <div className='border px-2 py-1 hidden peer-checked:block bg-slate-300 mx-2'>
                        <input type="text" name="" id="" className='border px-2 py-1'/>
                    </div>
                </label>
            </div> 
            <div className="mb-4 bg-slate-200 p-4">
                <h1 className='font-bold text-sky-600 mb-2'>Niba ushaka gukoresha range koresha aha hasi</h1>
                <div className='flex'>
                    <label htmlFor="" className='mr-5 flex items-center'>
                        <input type="radio" name="range-search" id="" className='h-4 w-4'/>
                        Quantity
                    </label>
                    <label htmlFor="" className='flex items-center'>
                        <input type="radio" name="range-search" id="" className='h-4 w-4'/>
                        Amount
                    </label>
                </div>
                <div className='mt-4'>
                    <label className="block mb-2">
                        Less Option
                        <input type="text" name="" id="" className="block w-full p-2 mt-1 border border-gray-300 rounded-sm"/>
                    </label> 
                    <label className="block mb-2">
                        Greater Option
                        <input type="text" name="" id="" className="block w-full p-2 mt-1 border border-gray-300 rounded-sm"/>
                    </label>
                </div>
            </div> 
        </form> 
        <div className="grid grid-cols-2 gap-4"> 
            <div className="border border-gray-300 rounded-lg shadow-md p-4">
                <h1>TRANSACTIONS IN</h1>
            </div> 
            <div className="border border-gray-300 rounded-lg shadow-md p-4">
                <h1>TRANSACTION OUT</h1>
            </div>
            <div className="border border-gray-300 rounded-lg shadow-md p-4">
                {/* IF TYPE IF SUPPLIER */}
                <h1>PRODUCTS BY SUPPLIER (IF SUPPLIER)</h1>
                {/* ELSE PRODUCT */}
                <h1>Quantity in Stock</h1>
            </div>
            <div className="border border-gray-300 rounded-lg shadow-md p-4">
                <h1>TOTAL QUANTITY TRANSACTION</h1>
            </div>
        </div>
    </div>
  )
}

export default SideWindow;