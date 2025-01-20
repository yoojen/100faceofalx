"use client";

import { useState } from "react";

interface Props {
    content: string,
    status: string,
    index: number,
    key: number,
    id: string,
    updateOrDelete: (id: string, type: string, statusOrContent?: string) => void,
}

export default function Task({ content, status, index, id, updateOrDelete }: Props) {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentTodo, setCurrentTodo] = useState({ content: content });

    return (
        <li className="flex justify-between" >
            {isEditing && (
                <div>
                    <div className="bg-black opacity-40 h-screen fixed w-full top-0 left-0" onClick={() => setIsEditing(false)}></div>
                    <div className="bg-white rounded-sm shadow-sm p-10 w-1/2 absolute z-10 top-1/3 left-1/2 -translate-x-1/2">
                        <h1 className="mb-2">Update Todo</h1>
                        <form onSubmit={() => {
                            setCurrentTodo({ content: '' });
                            return updateOrDelete(id, 'update', currentTodo.content)
                        }
                        }>
                            <input
                                type="text"
                                value={currentTodo.content}
                                className="border px-5 py-1 outline-none text-black w-[85%]"
                                onChange={(e) => setCurrentTodo(prev => ({ ...prev, content: e.target.value }))}
                            />
                            <button type="submit" className="bg-sky-700 text-white px-3 py-1 font-medium hover:opacity-80">Update</button>
                        </form>
                    </div>
                </div>
            )}
            <h3>
                <span className="text-green-400" > {status === 'Completed' ? '✔' : ''} </span>
                {index + 1}. {content}
            </h3>
            <div className="flex justify-between [&>*]:cursor-pointer">
                <p
                    className=" hover:text-sky-500 px-2 font-bold"
                    onClick={() => setIsEditing(prev => !prev)}
                >🖊 <span className=" text-xs">Edit</span></p>
                {
                    status !== 'Completed' && <p
                        className=" hover:text-green-500 px-2 font-bold"
                        onClick={() => updateOrDelete(id, 'status', 'Completed')}
                    >✅ <span className=" text-xs">Complete</span></p>
                }
                {
                    status !== 'Archived' && <p
                        className=" hover:text-violet-500 px-2 font-bold"
                        onClick={() => updateOrDelete(id, 'status', 'Archived')}
                    >📚 <span className=" text-xs"> Archive</span></p>
                }
                <p
                    className=" hover:text-red-500 px-2 font-bold"
                    onClick={() => updateOrDelete(id, 'Delete')}
                >🧹 <span className=" text-xs"> Delete</span></p>
            </div>
        </li>
    )
}