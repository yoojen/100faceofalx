import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import SideWindow from "../../components/SideWindow";
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    Title,
    LinearScale,
    CategoryScale,
    Legend,
    Tooltip,
    PointElement,
} from 'chart.js'
import useGetFetch from "../../hooks/useGetFetch";

ChartJS.register(
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement,
    Title,
    Legend,
    Tooltip
)

function Report() {
    const [year, setYear] = useState(null);
    const [openSideWindow, setOpenSideWindow] = useState(false);
    const FREQUENCY = ['Daily', 'Weekly', 'Monthly']

    const graphData = useGetFetch({ url: '/transactions/bar' });
    useEffect(() => {
        const getData = async () => {
            await graphData.fetchData()
        }
        getData();
        setYear(new Date().getFullYear())
    }, [])

    const LineOneDataset = {
        labels: !graphData.isLoading && graphData.data?.data?.map((d) => d.month),
        datasets: [
            {
                label: 'Revenue',
                data: !graphData.isLoading && graphData.data?.data?.map((d) => d.totalRevenue),
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,100,192,1)',
                tension: 0.4,
                segment: {
                    borderColor: (context) => {
                        return context.p1.parsed.y > 0 ? 'rgba(75,100,192,1)' : 'red';
                    }
                }
            },
            {
                label: 'Cost',
                data: !graphData.isLoading && graphData.data?.data?.map((d) => d.totalCost),
                fill: false,
                backgroundColor: 'rgba(150,100,192,0.2)',
                borderColor: 'rgba(200,100,60,1)',
                tension: 0.4,
                segment: {
                    borderColor: (context) => {
                        return context.p1.parsed.y > 0 ? 'rgba(200,100,60,1)' : 'red';
                    }
                }
            },
        ]
    }

    const LineTwoDataset = {
        labels: !graphData.isLoading && graphData.data?.data?.map((d) => d.month),
        datasets: [
            {
                label: 'Revenue',
                data: !graphData.isLoading && graphData.data?.data?.map((d) => d.totalRevenue),
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,100,192,1)',
                tension: 0.4,
                segment: {
                    borderColor: (context) => {
                        return context.p1.parsed.y > 0 ? 'rgba(75,100,192,1)' : 'red';
                    }
                }
            },
            {
                label: 'Profit',
                data: !graphData.isLoading && graphData.data?.data?.map((d) => {
                    return d.totalRevenue - d.totalCost
                }),
                fill: false,
                backgroundColor: 'rgba(150,100,192,0.2)',
                borderColor: 'rgba(90,100,60,1)',
                tension: 0.4,
                segment: {
                    borderColor: (context) => {
                        return context.p1.parsed.y > 0 ? 'rgba(90,100,60,1)' : 'red';
                    }
                }
            }
        ]
    }
    const LineOneOptions = {
        responsive: true,
        mantainAspectRatio: false,
        scales: {
            y: {
                title: {
                    text: 'Amount in Frw',
                    display: true,
                },
                beginAtZero: true,
                ticks: {
                    stepSize: 100000,
                },
                border: {
                    color: 'rgba(0, 0, 0, 1)',
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                }
            },
            x: {
                border: {
                    color: 'rgba(0, 0, 0, 1)',
                },
                grid: {
                    display: false
                }
            }
        },

        plugins: {
            title: {
                display: true,
                text: 'Revenue Vs. Cost',
                font: {
                    size: 20
                }
            },
            legend: {
                display: true,
                position: 'right'
            }
        }
    }

    const LineTwoOptions = {
        responsive: true,
        mantainAspectRatio: false,
        scales: {
            y: {
                title: {
                    text: 'Amount in Frw',
                    display: true,
                },
                beginAtZero: true,
                ticks: {
                    stepSize: 100000,
                },
                border: {
                    color: 'rgba(0, 0, 0, 1)',
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                }
            },
            x: {
                border: {
                    color: 'rgba(0, 0, 0, 1)',
                },
                grid: {
                    display: false
                }
            }
        },

        plugins: {
            title: {
                display: true,
                text: 'Revenue Vs. Profit',
                font: {
                    size: 20
                }
            },
            legend: {
                display: true,
                position: 'right'
            }
        }
    }
    return (
        <div className="px-5 bg-slate-200" >
            {openSideWindow && (<SideWindow />)}
            < h1 className="text-2xl font-medium text-blue-500 mt-5" > RAPORO</h1>
            <div className="[&>*]:rounded-sm [&>*]:shadow-sm space-y-3 mb-5">
                <div className="bg-white">
                    <h1 className="text-xl font-semibold p-2">Sales Report</h1>
                    <div className="flex flex-wrap justify-around mt-2 [&>*]:basis-[24%] space-x-1 mx-2">
                        <div>
                            <h1 className="mx-2">Average Sales</h1>
                            <div className="my-2 overflow-auto horizontal-custom-scrollbar">
                                <table className="table w-full text-left">
                                    <thead>
                                        <tr className="[&>*]:px-2">
                                            <th>Frequency</th>
                                            <th className="text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {FREQUENCY.map((f, i) => {
                                            return (
                                                <tr key={i} className="[&>*]:px-2">
                                                    <td>{f}</td>
                                                    <td className="text-right"> Frw</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                            <h1 className="mx-2">Top-Selling Products</h1>
                            <div className="my-2 font-light overflow-auto horizontal-custom-scrollbar">
                                <table className="table w-full text-left">
                                    <thead>
                                        <tr className="[&>*]:px-2">
                                            <th>Product</th>
                                            <th>Category</th>
                                            <th className="text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[1, 2, 3].map((product, index) => {
                                            return (
                                                <tr key={index} className="[&>*]:px-2">
                                                    <td>Umuceri</td>
                                                    <td>Food</td>
                                                    <td className="text-right">50,000</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                            <h1 className="mx-2">Sales by Category</h1>
                            <div className="my-2 font-light overflow-auto horizontal-custom-scrollbar">
                                <table className="table w-full text-left">
                                    <thead>
                                        <tr className="[&>*]:px-2">
                                            <th>Category</th>
                                            <th className="text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[1, 2, 3].map((product, index) => {
                                            return (
                                                <tr key={index} className="w-full">
                                                    <td className="w-1/3">Food</td>
                                                    <td className="w-1/3 text-right">50,000</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                            <h1 className="mx-2">Profit Margins</h1>
                            <div className="my-2 font-light overflow-auto horizontal-custom-scrollbar">
                                <table className="table w-full text-left">
                                    <thead>
                                        <tr className="[&>*]:px-2">
                                            <th>Product</th>
                                            <th>Category</th>
                                            <th className="text-right">Profit Margin</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[1, 2, 3].map((product, index) => {
                                            return (
                                                <tr key={index} className="[&>*]:px-2">
                                                    <td>Umuntu</td>
                                                    <td>Boutique</td>
                                                    <td className="text-right">2.5%</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex [&>*]:bg-white [&>*]:rounded-sm space-x-2">
                    <div className="basis-1/2">
                        <h1 className="text-xl font-semibold p-2">Inventory Reports</h1>
                        <div className="flex flex-wrap justify-around mt-2 space-x-2">
                            <div className="basis-[45%]">
                                <h1>Low Stock Alerts</h1>
                                <div className="my-2 font-light overflow-auto horizontal-custom-scrollbar">
                                    <table className="table w-full text-left">
                                        <thead>
                                            <tr className="[&>*]:px-2">
                                                <th>Category</th>
                                                <th className="text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[1, 2, 3].map((product, index) => {
                                                return (
                                                    <tr key={index} className="w-full">
                                                        <td className="w-1/3">Food</td>
                                                        <td className="w-1/3 text-right">50,000</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="basis-[45%]">
                                <h1>Overstocked Items</h1>
                                <div className="my-2 font-light overflow-auto horizontal-custom-scrollbar">
                                    <table className="table w-full text-left">
                                        <thead>
                                            <tr className="[&>*]:px-2">
                                                <th>Product</th>
                                                <th>Category</th>
                                                <th className="text-right">Profit Margin</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[1, 2, 3].map((product, index) => {
                                                return (
                                                    <tr key={index} className="[&>*]:px-2">
                                                        <td>Umuntu</td>
                                                        <td>Boutique</td>
                                                        <td className="text-right">2.5%</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="basis-1/2">
                        <h1 className="text-xl font-semibold p-2">Purchase Reports</h1>
                        <div className="flex flex-wrap justify-around mt-2">
                            <div className="basis-[45%]">
                                <h1>Low Stock Alerts</h1>
                                <div className="my-2 font-light overflow-auto horizontal-custom-scrollbar">
                                    <table className="table w-full text-left">
                                        <thead>
                                            <tr className="[&>*]:px-2">
                                                <th>Category</th>
                                                <th className="text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[1, 2, 3].map((product, index) => {
                                                return (
                                                    <tr key={index} className="w-full">
                                                        <td className="w-1/3">Food</td>
                                                        <td className="w-1/3 text-right">50,000</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="basis-[45%]">
                                <h1>Overstocked Items</h1>
                                <div className="my-2 font-light overflow-auto horizontal-custom-scrollbar">
                                    <table className="table w-full text-left">
                                        <thead>
                                            <tr className="[&>*]:px-2">
                                                <th>Product</th>
                                                <th>Category</th>
                                                <th className="text-right">Profit Margin</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[1, 2, 3].map((product, index) => {
                                                return (
                                                    <tr key={index} className="[&>*]:px-2">
                                                        <td>Umuntu</td>
                                                        <td>Boutique</td>
                                                        <td className="text-right">2.5%</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-2">
                    <h1 className="font-bold text-lg">Revenue Vs. Cost Vs. Profit </h1>
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <Line options={LineOneOptions} data={LineOneDataset} />
                        </div>
                        <div className="w-1/2">
                            <Line options={LineTwoOptions} data={LineTwoDataset} />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div >
    )
}

export default Report;