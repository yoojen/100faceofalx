import { redirect } from "next/navigation";
import { deleteTodo, getTodos, updateContentTodo, updateStatusTodo } from "../api/todos";
import Task from "../components/Task";

async function updateOrDelete(id: string, type: string, statusOrContent?: string) {
    "use server"
    if (type === 'Delete') {
        deleteTodo(id)
    } else if (type === 'update') {
        if (!statusOrContent) {
            return;
        }
        updateContentTodo(id, statusOrContent)
    } else {
        updateStatusTodo(id, statusOrContent);
    }
    redirect('/')
}
async function TaskTitle() {

    const todos = await getTodos();

    return (
        <div className="p-5 my-5 w-full">
            {
                // todos.filter(todo => todo.status === todoFilter).length < 1
                <div>
                    <div>Nothing to show</div>
                    <ul className="bg-slate-200 text-black p-2 shadow-sm rounded-sm space-y-2">
                        {
                            todos?.map((todo, i) =>
                                <Task
                                    key={todo?.id} index={i}
                                    content={todo?.content}
                                    status={todo?.status} id={todo.id}
                                    updateOrDelete={updateOrDelete}
                                />
                            )
                        }
                    </ul>
                </div>
            }
        </div>
    )
}

export default TaskTitle;