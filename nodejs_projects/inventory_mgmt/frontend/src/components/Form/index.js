import React from 'react'

const Form = ({ fields }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("attempted to search");
    }
    
  return (
    <div>
        <p>Koresha iyi form ushaka Igicuruzwa cg transaction</p>
        <form className='sm:flex items-center justify-between bg-white rounded-sm shadow-sm p-4' onSubmit={handleSubmit}>
            {
                fields.map((field, index)=>{
                    return (
                        <div key={index} className='flex flex-col  [&>*]:capitalize w-full'>
                            <label htmlFor={field}>{field}</label>
                            {field === 'product' ? 
                                <select name={field} id={`id_${field}`} className='border px-4 py-1 w-50 sm:w-1/2'>
                                    <option value="">----</option>
                                    <option value="1">Amasaka</option>
                                </select>
                                : field === 'supplier' ? 
                                    <select name={field} id={`id_${field}`} className='border px-4 py-1 w-50 sm:w-1/2'>
                                        <option value="">----</option>
                                        <option value="1">John</option>
                                    </select>
                                : <input type="text" className='border px-4 py-1 w-50 sm:w-1/2' />}
                        </div>
                    )
                })
              }
              <div>
                  <p className='italic text-sky-500'>kanda hano</p>
                <button
                    type='submit'
                    className='px-5 py-1 bg-sky-500 border-0 text-white font-medium'
                >
                    Submit
                </button>
                </div>
        </form>
    </div>
  )
}

export default Form