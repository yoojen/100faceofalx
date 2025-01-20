import TodosModel from "../db";


async function Controller() {

    const categories: string[] = await TodosModel.distinct('status');

    return (
        <div className="relative w-full md:w-auto md:absolute md:top-20 md:right-2 bg-white rounded-sm shadow-md p-3 [&>*]:cursor-pointer space-y-3 text-black">

            <select name="change_filter" id="change_filter">
                {
                    categories.map((c, i) => <option key={i} value={c}>hey</option>)
                }

            </select>
        </div>
    )
}

export default Controller;