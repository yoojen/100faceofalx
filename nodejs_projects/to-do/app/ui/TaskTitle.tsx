import React, { SetStateAction, useState } from "react";
import { todosObjects } from "../page";



interface Props {
    todos: todosObjects[],
    todoFilter: string,
    setTodos: React.Dispatch<SetStateAction<todosObjects[]>>
}

interface currentTodoType {
    id: number,
    content: string,
    status: string,
    date: string
}

function TaskTitle({ todos, todoFilter, setTodos }: Props) {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentTodo, setCurrentTodo] = useState<currentTodoType>({ id: 0, content: '', status: 'Pending', date: '' });

    const EditTodo = (todo: todosObjects) => {
        setIsEditing(true);
        setCurrentTodo({ id: todo.id, content: todo.content, status: todo.status, date: todo.date });
    }

    const handleUpdateTodo = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setTodos(todos.map((todo) => (
            todo.id === currentTodo.id ?
                { id: currentTodo.id, content: currentTodo.content, status: currentTodo.status, date: currentTodo.date }
                : todo
        )))
        setIsEditing(false);
        setCurrentTodo({ id: 0, content: '', status: '', date: '' });
    }


    const handleMarkCompeleteOrArchiveOrDelete = (todo: currentTodoType, type: string) => {
        setCurrentTodo({ id: todo.id, content: todo.content, status: todo.status, date: todo.date });

        if (type === 'Delete') {
            setTodos(todos.filter(t => t.id !== todo.id));
        } else {
            setTodos(todos.map((todo) => (
                todo.id === currentTodo.id ?
                    { id: currentTodo.id, content: currentTodo.content, status: type, date: currentTodo.date }
                    : todo
            )))

        }
    }
    return (
        <div className="p-5 my-5 w-full">
            {isEditing && (
                <div>
                    <div className="absolute bg-black opacity-40 h-screen w-full top-0 right-0" onClick={() => setIsEditing(false)}></div>
                    <div className="bg-white rounded-sm shadow-sm p-5 relative z-10 top-1/2 left-1/2 -translate-x-1/2">
                        <form onSubmit={handleUpdateTodo}>
                            <input
                                type="text"
                                value={currentTodo.content}
                                className="border px-5 py-1 outline-none text-black w-[80%]"
                                onChange={(e) => setCurrentTodo(prev => ({ ...prev, content: e.target.value }))}
                            />
                            <button type="submit" className="bg-sky-700 px-3 py-1 font-medium hover:opacity-80">Update</button>
                        </form>
                    </div>
                </div>
            )}
            {todoFilter === 'Pending'
                ? <h1 className="text-lg font-medium text-black">In Progress Tasks</h1>
                : todoFilter === 'Completed' ? <h1 className="text-lg font-medium text-black">Completed Tasks</h1>
                    : <h1 className="text-lg font-medium text-black">Archived Tasks</h1>
            }
            {
                todos.filter(todo => todo.status === todoFilter).length < 1
                    ? <div>Nothing to show</div>
                    : <ul className="bg-slate-200 text-black p-2 shadow-sm rounded-sm space-y-2">
                        {
                            todos.filter(todo => todo.status === todoFilter).map((todo, i) =>
                                <li key={todo.id} className="flex justify-between">
                                    <h3>
                                        <span className="text-green-400">{todo.status === 'Completed' ? '✔' : ''}</span>
                                        {i + 1}. {todo.content}
                                    </h3>
                                    <div className="flex justify-between [&>*]:cursor-pointer">
                                        <p
                                            className=" hover:text-sky-500 px-2 font-bold"
                                            onClick={() => EditTodo(todo)}
                                        >🖊 <span className=" text-xs">Edit</span></p>
                                        {
                                            todo.status !== 'Completed' && <p
                                                className=" hover:text-green-500 px-2 font-bold"
                                                onClick={() => handleMarkCompeleteOrArchiveOrDelete(todo, 'Completed')}
                                            >✅ <span className=" text-xs">Complete</span></p>
                                        }
                                        {
                                            todo.status !== 'Archived' && <p
                                                className=" hover:text-violet-500 px-2 font-bold"
                                                onClick={() => handleMarkCompeleteOrArchiveOrDelete(todo, 'Archived')}
                                            >📚 <span className=" text-xs"> Archive</span></p>
                                        }
                                        <p
                                            className=" hover:text-red-500 px-2 font-bold"
                                            onClick={() => handleMarkCompeleteOrArchiveOrDelete(todo, 'Delete')}
                                        >🧹 <span className=" text-xs"> Delete</span></p>
                                    </div>
                                </li>
                            )

                        }
                    </ul>
            }
        </div>
    )
}

export default TaskTitle;