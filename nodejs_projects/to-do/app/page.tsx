'use client';

import React, { useState } from "react";
import Controller from "./ui/Controller";
import Form from "./ui/Form";
import TaskTitle from "./ui/TaskTitle";

export interface todosObjects {
  id: number,
  content: string,
  status: string,
  date: string
}

function Home() {

  const [todos, setTodos] = useState<todosObjects[]>([])
  const [todoFilter, setTodoFilter] = useState<string>('Pending');

  return (
    <div className="bg-white rounded-sm shadow-md md:w-2/3 flex flex-col items-center justify-center">
      <Controller todoFilter={todoFilter} setTodoFilter={setTodoFilter} />
      <Form setTodos={setTodos} />
      <TaskTitle todos={todos} todoFilter={todoFilter} setTodos={setTodos} />
    </div>
  );
}


export default Home;