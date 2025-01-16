'use client'

import { SetStateAction } from "react";

interface Props {
    todoFilter: string,
    setTodoFilter: React.Dispatch<SetStateAction<string>>
}
function Controller({ todoFilter, setTodoFilter }: Props) {


    return (
        <div className="relative w-full md:w-auto md:absolute md:top-20 md:right-2 bg-white rounded-sm shadow-md p-3 [&>*]:cursor-pointer space-y-3 text-black">

            <select name="change_filter" id="change_filter" value={todoFilter} onChange={(e) => setTodoFilter(e.target.value)}>
                <option value='Pending'>🔁 Pending</option>
                <option value='Completed'>🏁 Completed</option>
                <option value='Archived'>📑 Archived</option>
            </select>
        </div>
    )
}

export default Controller;