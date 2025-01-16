'use client';

import { SetStateAction, useState } from "react";
import { todosObjects } from "../page";
import Button from "./Button";

interface Props {
    setTodos: React.Dispatch<SetStateAction<todosObjects[]>>
}

function Form({ setTodos }: Props) {
    const [newTodo, setNewTodo] = useState({ content: "", id: 0, status: "Pending", date: "" });

    const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newTodo.id || !newTodo.content || !newTodo.status || !newTodo.date) return;
        setTodos(prev => [...prev, newTodo]);
        setNewTodo({ id: 0, content: '', status: '', date: '' });
    }

    return (
        <div className="p-5 w-full">
            <form onSubmit={handleAdd} className="p-5 rounded-sm shadow-sm bg-slate-200 w-full">
                <input
                    type="text"
                    className="border px-5 py-1 outline-none text-black w-[90%]"
                    value={newTodo.content}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewTodo(prev => ({
                            ...prev,
                            id: Math.floor(Math.random() * 1000),
                            content: e.target.value,
                            status: "Pending",
                            date: new Date().toLocaleDateString()
                        }))} />
                <Button />
            </form>
        </div >
    )
}

export default Form;