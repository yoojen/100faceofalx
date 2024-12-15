import Footer from "../../components/Footer";
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import useGetFetch from "../../hooks/useGetFetch";
import { FaRankingStar } from "react-icons/fa6";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";


function Dashboard() {
    const [inUrl, setInUrl] = useState(null);
    const [outUrl, setOutUrl] = useState(null);
    // const [transactionSummary, setTransactionSummary] = useState();
    const [isLoading, setIsLoading] = useState(true)

    var transactionSummary = useGetFetch({ url: '/transactions/summary' });
    var inTransactions = useGetFetch({ url: inUrl });
    var outTransactions = useGetFetch({ url: outUrl });

    const handleInTransaction = (page) => {
        console.log('in-->', page)
        setInUrl(`/transactions/agg/quantity?transaction_type=IN&pageSize=1&page=${page}`);
    }
    const handleOutTransaction = (page) => {
        console.log(page)
        setOutUrl(`/transactions/agg/quantity?transaction_type=OUT&pageSize=1&page=${page}`);
    }
    return (
        <div className="px-5 bg-slate-200">
            <h1 className="text-2xl font-medium text-blue-500">AHABANZA</h1>
            <button onClick={() => handleInTransaction(1)}>Test Button</button>
            <button onClick={() => handleOutTransaction(1)}>Test 2 Button</button>
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
                            {!inTransactions.isLoading && inTransactions.data?.totalPages > 1
                                ? inTransactions.data?.currentPage != 1
                                    ? <button
                                        className="border rounded-sm px-5 py-1 hover:bg-sky-400"
                                        onClick={(e) => handleInTransaction(inTransactions.data?.currentPage - 1)}>
                                        Previous
                                    </button>
                                    : ''
                                :
                                ''
                            }
                            <button
                                className={`bg-blue-400 text-white font-medium border rounded-sm px-5 py-1 hover:bg-sky-400`}
                                onClick={(e) => handleInTransaction(inTransactions.data?.currentPage)}>
                                {inTransactions.data?.currentPage}
                            </button>
                            {!inTransactions.isLoading && inTransactions.data?.totalPages > 1
                                ? inTransactions.data?.currentPage != inTransactions.data?.totalPages
                                    ? <button
                                        className="border rounded-sm px-5 py-1 hover:bg-sky-400"
                                        onClick={(e) => handleInTransaction(inTransactions.data?.currentPage + 1)}>
                                        Next
                                    </button>
                                    : ''
                                :
                                ''
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
                                {!outTransactions.isLoading && outTransactions.data?.totalPages > 1
                                    ? outTransactions.data?.currentPage != 1
                                        ? <button
                                            className="border rounded-sm px-5 py-1 hover:bg-sky-400"
                                            onClick={(e) => handleOutTransaction(outTransactions.data?.currentPage - 1)}>
                                            Previous
                                        </button>
                                        : ''
                                    :
                                    ''
                                }
                                <button
                                    className={`bg-blue-400 text-white font-medium border rounded-sm px-5 py-1 hover:bg-sky-400`}
                                    onClick={(e) => handleOutTransaction(parseInt(e.target.textContent))}>
                                    {outTransactions.data?.currentPage}
                                </button>
                                {!outTransactions.isLoading && outTransactions.data?.totalPages > 1
                                    ? outTransactions.data?.currentPage != outTransactions.data?.totalPages
                                        ? <button
                                            className="border rounded-sm px-5 py-1 hover:bg-sky-400"
                                            onClick={(e) => handleOutTransaction(outTransactions.data?.currentPage + 1)}>
                                            Next
                                        </button>
                                        : ''
                                    :
                                    ''
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
                                        <tr>
                                            <td>Amasaka</td>
                                            <td>2000kgs</td>
                                        </tr>
                                        <tr>
                                            <td>Ibigori</td>
                                            <td>2000kgs</td>
                                        </tr>
                                        <tr>
                                            <td>Ingano</td>
                                            <td>2000kgs</td>
                                        </tr>
                                        <tr>
                                            <td>Uburo</td>
                                            <td>2000kgs</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="p-2">
                        <div>
                            <div className="font-medium text-blue-500">
                                <h1>Uko wacuruje (Ibyumweru 4)</h1>
                            </div>
                            <div className="px-3 overflow-auto flex [&>*]:shrink-0 horizontal-custom-scrollbar">
                                <BarChart
                                    xAxis={[
                                        {
                                            scaleType: 'band',
                                            data: [1, 2, 4],
                                            label: "Months",
                                            categoryGapRatio: 0.2,
                                            barGapRatio: 0.2
                                        }
                                    ]}
                                    series={[{ data: [4, 5, 3], label: "Sales" }, { data: [1, 3, 2], label: "Purchase" }]}
                                    barLabel={'value'}
                                    yAxis={[{ label: "Total (FRW) " }]}
                                    grid={{ vertical: false, horizontal: true }}
                                    borderRadius={10}
                                    slotProps={{ legend: { hidden: false } }}
                                    width={500}
                                    height={300}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Dashboard;