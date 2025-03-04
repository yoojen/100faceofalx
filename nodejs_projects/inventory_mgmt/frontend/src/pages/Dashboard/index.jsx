import Footer from "../../components/Footer";
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import useGetFetch from "../../hooks/useGetFetch";
import { FaRankingStar } from "react-icons/fa6";
import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Bar } from "react-chartjs-2";


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

function Dashboard() {
    const [inUrl, setInUrl] = useState('/transactions/agg/report?transaction_type=IN&pageSize=5&page=1');
    const [outUrl, setOutUrl] = useState('/transactions/agg/report?transaction_type=OUT&pageSize=5&page=1');
    const [stockSummaryUrl, setStockSummaryUrl] = useState('/products?pageSize=5&page=1');

    var transactionSummary = useGetFetch({ url: '/transactions/summary' });
    var inTransactions = useGetFetch({ url: inUrl });
    var outTransactions = useGetFetch({ url: outUrl });
    var products = useGetFetch({ url: stockSummaryUrl || '/products?pageSize=5&page=1' });
    var barData = useGetFetch({ url: '/transactions/bar?groupby=yearMonth' })


    useEffect(() => {
        const getData = async () => {
            await transactionSummary.fetchData();
            await barData.fetchData();
        }
        getData();
    }, []);
    useEffect(() => {
        const getData = async () => {
            stockSummaryUrl && await products.fetchData();
        }
        getData();
    }, [stockSummaryUrl]);

    useEffect(() => {
        const getData = async () => {
            inUrl && await inTransactions.fetchData();
        }
        getData();
    }, [inUrl]);

    useEffect(() => {
        const getData = async () => {
            outUrl && await outTransactions.fetchData();
        }
        getData();
    }, [outUrl]);

    const handleInTransaction = (page) => {
        setInUrl(`/transactions/agg/report?transaction_type=IN&pageSize=5&page=${page}`);
    }
    const handleOutTransaction = (page) => {
        setOutUrl(`/transactions/agg/report?transaction_type=OUT&pageSize=5&page=${page}`);
    }
    const handleStockSummary = (page) => {
        setStockSummaryUrl(`/products?pageSize=5&page=${page}`);
    }

    const options = {
        responsive: true,

        scales: {
            y: {
                ticks: {
                    callback: function (value, index, values) {
                        return value / 1000 + 'K';
                    }
                },
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Total Cost vs. Total Revenue Per Month',
            },
        },
    };

    const labels = !barData.isLoading && barData.data?.data?.map((m) => m.yearMonth);
    const costDataset = !barData.isLoading && barData.data?.data?.map((c) => c.totalCost);
    const revenueDataset = !barData.isLoading && barData.data?.data?.map((r) => r.totalRevenue);

    const data = {
        labels,
        datasets: [
            {
                label: 'Total Cost',
                data: costDataset,
                backgroundColor: 'rgba(200, 30, 50, 0.7)',
            },
            {
                label: 'Total Revenue',
                data: revenueDataset,
                backgroundColor: 'rgba(53, 162, 235, 0.9)',
            },
        ],
    };
    return (
        <div className="px-5 bg-slate-200" >
            <h1 className="text-2xl font-medium text-blue-500">AHABANZA</h1>
            <div className="md:flex md:basis-3/4 md:space-x-3 mb-4">
                <div className="md:w-2/4 [&>*]:bg-white [&>*]:rounded-sm [&>*]:shadow-md [&>*]:p-2 space-y-3">
                    <div>
                        <div className="px-2 text-blue-500 font-medium">
                            <h1>Incamake</h1>
                        </div>
                        <div className="flex justify-around [&>*]:flex [&>*]:flex-col [&>*]:justify-around [&>*]:items-center">
                            <div className="px-2">
                                <p className="space-x-3">
                                    RF&nbsp;
                                    <span>{!transactionSummary.isLoading && parseInt(transactionSummary.data.data?.revenue).toLocaleString()}</span>
                                </p>
                                <small>Ibyagurishijwe</small>
                            </div>
                            <div className="text-blue-500 px-2">
                                <p className="space-x-3">
                                    RF&nbsp;
                                    <span>{!transactionSummary.isLoading && parseInt(transactionSummary.data.data?.cost).toLocaleString()}</span>
                                </p>
                                <small>Ibyinjiye</small>
                            </div>
                            <div className="text-green-500">
                                <p className="space-x-3">
                                    RF&nbsp;
                                    <span>{!transactionSummary.isLoading && parseInt(transactionSummary.data.data?.profit).toLocaleString()}</span>
                                </p>
                                <small>Inyungu</small>
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="px-2 text-blue-500 font-medium mb-2">
                            <InventoryOutlinedIcon />
                            <h1>Ibyo waguze (per week)</h1>
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr className="text-left">
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Total Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!inTransactions.isLoading && (inTransactions.data?.data?.map((p, i) => {
                                    return <tr key={i}>
                                        <td>{p.Product.name}</td>
                                        <td>{parseInt(p.totalQuantity).toLocaleString()} Kgs</td>
                                        <td>RF {parseInt(p.totalAmount).toLocaleString()}</td>
                                    </tr>

                                }))}
                            </tbody>
                        </table>
                        <div className="my-2 flex space-x-2">
                            {
                                !inTransactions.isLoading
                                && inTransactions.data?.totalPages > 1
                                && inTransactions.data?.currentPage != 1
                                && <button
                                    className="border rounded-sm px-5 py-1 hover:bg-sky-400"
                                    onClick={(e) => handleInTransaction(inTransactions.data?.currentPage - 1)}>
                                    Previous
                                </button>
                            }
                            <button
                                className={`bg-blue-700 text-white font-medium border rounded-sm px-5 py-1 hover:bg-sky-400`}
                                onClick={(e) => handleInTransaction(inTransactions.data?.currentPage)}>
                                {inTransactions.data?.currentPage}
                            </button>
                            {
                                !inTransactions.isLoading
                                && inTransactions.data?.totalPages > 1
                                && inTransactions.data?.currentPage != inTransactions.data?.totalPages
                                && <button
                                    className="border rounded-sm px-5 py-1 hover:bg-sky-400"
                                    onClick={(e) => handleInTransaction(inTransactions.data?.currentPage + 1)}>
                                    Next
                                </button>
                            }
                        </div>
                    </div>
                    <div>
                        <div className="text-blue-500 px-2 font-medium">
                            <FaRankingStar />
                            <h1 className="capitalize">uko ibicuruzwa byagurishijwe (top 5)</h1>
                        </div>
                        <div className="my-2">
                            <table className="w-full">
                                <thead className="border-b-2">
                                    <tr className="text-left">
                                        <th>Product</th>
                                        <th>Qty</th>
                                        <th>Total Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!outTransactions.isLoading && (outTransactions.data?.data?.map((p, i) => {
                                        return <tr key={i}>
                                            <td>{p.Product.name}</td>
                                            <td>{parseInt(p.totalQuantity).toLocaleString()} Kgs</td>
                                            <td>RF {parseInt(p.totalAmount).toLocaleString()}</td>
                                        </tr>

                                    }))}
                                </tbody>
                            </table>
                            <div className="my-2 flex space-x-2">
                                {
                                    !outTransactions.isLoading
                                    && outTransactions.data?.totalPages > 1
                                    && outTransactions.data?.currentPage != 1
                                    && <button
                                        className="border rounded-sm px-5 py-1 hover:bg-sky-400"
                                        onClick={(e) => handleOutTransaction(outTransactions.data?.currentPage - 1)}>
                                        Previous
                                    </button>
                                }
                                <button
                                    className={`bg-blue-400 text-white font-medium border rounded-sm px-5 py-1 hover:bg-sky-400`}
                                    onClick={(e) => handleOutTransaction(parseInt(e.target.textContent))}>
                                    {outTransactions.data?.currentPage}
                                </button>
                                {
                                    !outTransactions.isLoading
                                    && outTransactions.data?.totalPages > 1
                                    && outTransactions.data?.currentPage != outTransactions.data?.totalPages
                                    && <button
                                        className="border rounded-sm px-5 py-1 hover:bg-sky-400"
                                        onClick={(e) => handleOutTransaction(outTransactions.data?.currentPage + 1)}>
                                        Next
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="md:basis-2/4 [&>*]:bg-white [&>*]:rounded-sm [&>*]:shadow-md space-y-3">
                    <div className="p-2">
                        <div>
                            <div className="font-medium text-blue-500">
                                <h1>Incamake ya stock (Ibisigaye)</h1>
                            </div>
                            <div>
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!products.isLoading && (products.data?.data?.map((p, i) => {
                                            return <tr key={i}>
                                                <td>{p.name}</td>
                                                <td>{parseInt(p.quantity_in_stock).toLocaleString()} Kgs</td>
                                            </tr>

                                        }))}
                                    </tbody>
                                </table>
                                <div className="my-2 flex space-x-2">
                                    {
                                        !products.isLoading
                                        && products.data?.totalPages > 1
                                        && products.data?.currentPage != 1
                                        && <button
                                            className="border rounded-sm px-5 py-1 hover:bg-sky-400"
                                            onClick={(e) => handleStockSummary(products.data?.currentPage - 1)}>
                                            Previous
                                        </button>
                                    }
                                    <button
                                        className={`bg-blue-400 text-white font-medium border rounded-sm px-5 py-1 hover:bg-sky-400`}
                                        onClick={(e) => handleStockSummary(parseInt(e.target.textContent))}>
                                        {products.data?.currentPage}
                                    </button>
                                    {
                                        !products.isLoading
                                        && products.data?.totalPages > 1
                                        && products.data?.currentPage != products.data?.totalPages
                                        && <button
                                            className="border rounded-sm px-5 py-1 hover:bg-sky-400"
                                            onClick={(e) => handleStockSummary(products.data?.currentPage + 1)}>
                                            Next
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-2">
                        <div>
                            <div className="font-medium text-blue-500">
                                <h1>Uko wacuruje (Ibyumweru 4)</h1>
                            </div>
                            <div className="px-3 mx-auto  overflow-auto horizontal-custom-scrollbar">
                                <Bar options={options} data={data} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div >
    )
}

export default Dashboard;