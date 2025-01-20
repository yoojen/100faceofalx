import TodosModel from "./db";
import Controller from "./ui/Controller";
import Form from "./ui/Form";
import TaskTitle from "./ui/TaskTitle";

export interface todosObjects {
  id: number,
  content: string,
  status: string,
  date: string
}


async function Home() {


  return (
    <div className="bg-white rounded-sm shadow-md md:w-2/3 flex flex-col items-center justify-center">
      <Controller />
      <Form />
      <TaskTitle />
    </div>
  );
}


export default Home;