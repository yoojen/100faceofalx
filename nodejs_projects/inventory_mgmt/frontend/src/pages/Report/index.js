import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import Form from '../../components/Form';
import Footer from "../../components/Footer";
import SideWindow from "../../components/SideWindow";

function Report() {
    const [year, setYear] = useState(null);
    const [openSideWindow, setOpenSideWindow] = useState(false);
    const [tempProducts, setTempProducts] = useState([
        {id:1, category: "amasaka", turnOver: 12000, rate: 10},
        {id:2, category: "amamera", turnOver: 23000, rate: 15},
    ])

    useEffect(() => {
        setYear(new Date().getFullYear())
    }, [])
    
    return (
        <div className="px-5 bg-slate-200">
            {openSideWindow && (<SideWindow />) }
            <Form fields={ ['amount', 'year', 'weeks']} />
            <h1 className="text-2xl font-medium text-blue-500 mt-5">RAPORO</h1>
            <div className="[&>*]:rounded-sm [&>*]:shadow-sm space-y-3 mb-5">
                <div className="flex justify-around">
                    <div className="basis-2/4 bg-white rounded-sm shadow-sm p-2 mr-2">
                        <h1>Overview</h1>
                        <div className="flex justify-between">
                            <div className="px-2 flex flex-col items-center">
                                <p className="space-x-3">
                                    &euro;
                                    <span>500</span>
                                </p>
                                <small>Purchases</small>
                            </div>
                            <div className="px-2 flex flex-col items-center">
                                <p className="space-x-3">
                                    &euro;
                                    <span>500</span>
                                </p>
                                <small>Sales</small>
                            </div>
                            <div className="px-2 flex flex-col items-center">
                                <p className="space-x-3">
                                    &euro;
                                    <span>500</span>
                                </p>
                                <small>COGS</small>
                            </div>
                            <div className="px-2 flex flex-col items-center">
                                <p className="space-x-3">
                                    &euro;
                                    <span>500</span>
                                </p>
                                <small>Other expenses</small>
                            </div>

                            <div className="px-2 flex flex-col items-center">
                                <p className="space-x-3">
                                    &euro;
                                    <span>500</span>
                                </p>
                                <small>Net profit</small>
                            </div>
                        </div>
                    </div>
                    <div className="basis-2/4 bg-white rounded-sm shadow-sm p-2">
                        <h1>Best selling category</h1>
                        <div className="my-2 font-light overflow-auto horizontal-custom-scrollbar">
                            <table className="table w-full text-left">
                                <thead>
                                    <tr className="[&>*]:px-2">
                                        <th>Category</th>
                                        <th>Turn Over</th>
                                        <th>Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tempProducts.map((product, index) => {
                                        return (
                                            <tr key={index} className="[&>*]:px-2">
                                                <td>{product.category}</td>
                                                <td>{product.turnOver.toLocaleString()} Frw</td>
                                                <td>{product.rate}%</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-2">
                    <div><h1>Profit & Revenue</h1></div>
                    <div className="w-full flex [&>*]:shrink-0 overflow-auto [&>*]:w-full horizontal-custom-scrollbar">
                        <LineChart 
                            xAxis={[
                                { data: [1, 2, 3, 4, 5, 6, 7], id: 1, label: "X label"},
                                { data: [3, 1, 6, 4.3, 6, 4, 8], id: 2, }
                            ]}
                            series={[
                                { data: [1, 2, 3, 4, 5, 6, 7], label:"First One" },
                                { data: [1, 3, 2, 4, 3, 5, 6], label: "Second one"}
                            ]}
                            grid={{ vertical: false, horizontal: true }}
                            width={1000}
                            height={300}
                        />
                    </div>
                </div>
                <div className="bg-white p-2">
                    <div><h1>Best selling price</h1></div>
                    <div className="overflow-auto">
                        <table className="table w-full text-left">
                            <thead>
                                <tr className="[&>*]:px-2">
                                    <th>Product Id</th>
                                    <th>Product</th>
                                    <th>Remaining Qty</th>
                                    <th>Sold Qty</th>
                                    <th>Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tempProducts.map((product, index) => {
                                    return (
                                        <tr key={index} className="[&>*]:px-2">
                                            <td>{product.category}</td>
                                            <td>{product.turnOver.toLocaleString()} Frw</td>
                                            <td>{product.rate}%</td>
                                            <td>{product.rate}%</td>
                                            <td>{product.rate}%</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Report;