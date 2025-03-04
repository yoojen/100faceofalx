import { redirect } from "next/navigation";
import TodosModel from "../db";
import Button from "./Button";

function Form() {
    const handleAddTodo = async (data: FormData) => {
        "use server";
        const todo = new TodosModel({ content: data.get('content')?.valueOf(), status: 'Pending' })
        await todo.save()
        redirect('/')
    }
    return (
        <div className="p-5 w-full">
            <form action={handleAddTodo} className="p-5 rounded-sm shadow-sm bg-slate-200 w-full">
                <input
                    type="text"
                    name="content"
                    className="border px-5 py-1 outline-none text-black w-[90%]"
                />
                <Button />
            </form>
        </div >
    )
}

export default Form;