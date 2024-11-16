import React from 'react'
import { Link } from 'react-router-dom'

const DropDown = ({ type }) => {
    const CHOICE = ['Notification', 'Profile']
    return (
        <div>
        {type === CHOICE[0] ?
            <div className='p-2 max-h-96 overflow-y-auto custom-scrollbar'>
                <h1 className='font-medium'>Notification DropDown</h1>
                <hr />
                <div className='text-justify'>
                    <div className='mt-5 px-3'>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Aut corporis quo nesciunt quis culpa iure eaque est delectus provident veritatis.
                        </p>
                        <small>{new Date().toString()}</small>
                    </div>
                    <div className='mt-5 px-3'>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Aut corporis quo nesciunt quis culpa iure eaque est delectus provident veritatis.
                        </p>
                        <small>{new Date().toString()}</small>
                    </div>
                    <div className='mt-5 px-3'>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Aut corporis quo nesciunt quis culpa iure eaque est delectus provident veritatis.
                        </p>
                        <small>{new Date().toString()}</small>
                    </div>
                    <div className='mt-5 px-3'>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Aut corporis quo nesciunt quis culpa iure eaque est delectus provident veritatis.
                        </p>
                        <small>{new Date().toString()}</small>
                    </div>
                </div>
            </div>
        : 
            <div>
                <h1 className='font-medium'> Profile DropDown</h1>
                <hr />
                <div className='flex flex-col space-y-1 mt-5 text-sky-600'>
                    <Link exact to={'/account'}>Account</Link>
                    <Link exact to={'/setting'}>Setting</Link>
                    <Link exact to={'/logout'}>Logout</Link>
                </div>
            </div>
        }
    </div>
  )
}

export default DropDown;