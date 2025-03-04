import mongoose from 'mongoose'

(async function () {
    try {
        await mongoose.connect('mongodb://localhost:27017/todos')
        console.log('connected');
    } catch (error) {
        throw Error(String(error))
    }
}())

const todosSchema = new mongoose.Schema({
    content: String,
    status: String,
})

const TodosModel = mongoose.models.todos || mongoose.model('todos', todosSchema);
export default TodosModel