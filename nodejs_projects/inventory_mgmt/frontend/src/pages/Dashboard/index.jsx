import { FcSalesPerformance } from "react-icons/fc";
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import { GiExpense } from "react-icons/gi";
import { GiProfit } from "react-icons/gi";
import { FaRankingStar } from "react-icons/fa6";
import Navigator from "../../components/Navigator"
import Footer from "../../components/Footer";


function Dashboard() {
    return (
        <div>
            <Navigator/>
            <div className="relative top-20 px-5 lg:ml-[18.5%] bg-slate-200">
                <h1 className="text-2xl font-medium text-blue-500">AHABANZA</h1>
                <div className="flex basis-3/4 space-x-3">
                    <div className="w-2/3 [&>*]:bg-white [&>*]:rounded-sm [&>*]:shadow-md [&>*]:p-2 space-y-3">
                        <div>
                            <div className="px-2 text-blue-500 font-medium">
                                <SummarizeOutlinedIcon/>
                                <h1>Incamake</h1>
                            </div>
                            <div className="flex justify-around [&>*]:flex [&>*]:flex-col [&>*]:justify-around [&>*]:items-center [&>*]:-space-y-2">
                                <div className="text-yellow-500 px-2">
                                    <FcSalesPerformance className="w-10 h-10"/>
                                    <p className="space-x-3">
                                        &euro;
                                        <span>500</span>
                                    </p>
                                    <small>Ibyagurishijwe</small>
                                </div>
                                <div className="text-blue-500 px-2">
                                    <PaidOutlinedIcon className="w-10 h-10"/>
                                    <p className="space-x-3">
                                        &euro;
                                        <span>500</span>
                                    </p>
                                    <small>Amafaranga yinjiye</small>
                                </div>
                                <div className="text-red-600 px-2">
                                    <GiExpense  className="w-10 h-10"/>
                                    <p className="space-x-3">
                                        &euro;
                                        <span>500</span>
                                    </p>
                                    <small>Ibyasohotse</small>
                                </div>
                                <div className="text-green-500">
                                    <GiProfit className="w-10 h-10"/>
                                    <p className="space-x-3">
                                        &euro;
                                        <span>500</span>
                                    </p>
                                    <small>Inyungu</small>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="px-2 text-blue-500 font-medium mb-2">
                                <InventoryOutlinedIcon/>
                                <h1>Ibyo waguze (per week)</h1>
                            </div>
                            <div className="flex justify-around px-2 [&>*:not(:last-child)]:border-r-2 [&>*]:px-2 [&>*]:capitalize mb-2">
                                <div>
                                    <h3>amasaka</h3>
                                    <p>200kgs</p>
                                    <p>frw 250, 500</p>
                                </div>
                                <div>
                                    <h3>ibigori</h3>
                                    <p>200kgs</p>
                                    <p>frw 250, 500</p>
                                </div>
                                <div>
                                    <h3>ingano</h3>
                                    <p>200kgs</p>
                                    <p>frw 250, 500</p>
                                </div>
                                <div>
                                    <h3>uburo</h3>
                                    <p>200kgs</p>
                                    <p>frw 250, 500</p>
                                </div>
                                <div>
                                    <h3>amamera</h3>
                                    <p>200kgs</p>
                                    <p>frw 250, 500</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ marginBottom: "20px" }}>
                            <div className="text-blue-500 px-2 font-medium">
                                <FaRankingStar />
                                <h1 className="capitalize">uko ibicuruzwa byagurishijwe (top 5)</h1>
                            </div>
                            <div className="px-3 my-2">
                                <table className="w-full text-left border-collapse">
                                    <thead className="border-b-2">
                                        <tr>
                                            <th>igicuruzwa</th>
                                            <th>Kgs</th>
                                            <th>Ibisigaye</th>
                                            <th>Igiciro</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>The Sliding Mr. Bones</td>
                                            <td>Malcolm Lockyer</td>
                                            <td>1961</td>
                                            <td>1961</td>
                                        </tr>
                                        <tr>
                                            <td>Witchy Woman</td>
                                            <td>The Eagles</td>
                                            <td>1972</td>
                                            <td>1972</td>
                                        </tr>
                                        <tr>
                                            <td>Shining Star</td>
                                            <td>Earth, Wind, and Fire</td>
                                            <td>1975</td>
                                            <td>1975</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="basis-1/3 [&>*]:bg-white [&>*]:rounded-sm [&>*]:shadow-md [&>*]:p-2 space-y-3">
                        <div>
                            <div>
                                <div className="font-medium text-blue-500">
                                    <h1>Incamake ya stock (Ibisigaye)</h1>
                                </div>
                                <div className="[&>*]:flex [&>*]:justify-between px-4 space-y-2">
                                    <div>
                                        <p>Amasaka</p>
                                        <p>2000kgs</p>
                                    </div>
                                    <div>
                                        <p>Ibigori</p>
                                        <p>2000kgs</p>
                                    </div>
                                    <div>
                                        <p>Ingano</p>
                                        <p>2000kgs</p>
                                    </div>
                                    <div>
                                        <p>Uburo</p>
                                        <p>2000kgs</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div className="font-medium text-blue-500">
                                    <h1>Uko wacuruje (Ibyumweru 4)</h1>
                                </div>
                                <div className="px-3">
                                    Graph
                                </div>
                            </div>
                        </div>
                        <div>FOUR</div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Dashboard;