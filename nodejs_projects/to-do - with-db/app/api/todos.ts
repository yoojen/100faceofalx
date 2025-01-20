import TodosModel from "../db";

export function getTodos() {
    try {
        const todos = TodosModel.find({});
        return todos;
    } catch (error) {
        console.log(error);
        return;
    }
}

export async function updateContentTodo(id: string, content?: string) {
    try {
        const todo = await TodosModel.findByIdAndUpdate(id, { content }, { new: true });
        return todo;
    } catch (error) {
        console.log(`Error from delete ${String(error)}`)
        return;
    }
}

export async function updateStatusTodo(id: string, status?: string) {
    console.log(id, status)
    try {
        const todo = await TodosModel.findByIdAndUpdate(id, { status }, { new: true });
        console.log(todo)
        return todo;
    } catch (error) {
        console.log(`Error from delete ${String(error)}`)
        return;
    }
}
export async function deleteTodo(id: string) {
    try {
        await TodosModel.findByIdAndDelete(id);
    } catch (error) {
        console.log(`Error from delete ${String(error)}`)
    }
}