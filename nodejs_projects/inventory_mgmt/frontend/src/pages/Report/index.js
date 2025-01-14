import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import SideWindow from "../../components/SideWindow";
import { LineOneOptions, LineTwoOptions, } from "../../utils/charts";
import { getRandomColor } from "../../utils/helpers";
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import useGetFetch from "../../hooks/useGetFetch";
import {
    Chart as ChartJS,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    LinearScale,
    CategoryScale,
    Legend,
    Tooltip,
    PointElement,
} from 'chart.js'

ChartJS.register(
    BarElement,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement,
    ArcElement,
    Title,
    Legend,
    Tooltip
)

function Report() {
    const [year, setYear] = useState(null);
    const [openSideWindow, setOpenSideWindow] = useState(false);
    const PURCHASE_UNIQUE_CATEGORIES = {};
    const SALES_UNIQUE_CATEGORIES = {};
    const CATEGORY_SALES_FREQUENCY = {};
    const PRODUCT_PURCHASE_FREQUENCY = {};
    const PRODUCT_SALES_FREQUENCY = {};


    const inventoryData = useGetFetch({ url: '/products/q/search?sort=quantity_in_stock' });
    const graphData = useGetFetch({ url: '/transactions/bar?groupby=yearMonth' });
    const purchaseData = useGetFetch({ url: '/transactions/agg/report?transaction_type=IN' });
    const salesPerCategory = useGetFetch({ url: '/transactions/agg/report?transaction_type=OUT' });
    const profitMargindata = useGetFetch({ url: '/transactions/agg/product/report' });
    const dailySalesFrequency = useGetFetch({ url: '/transactions/bar' })
    const salesFrequencyByCategory = useGetFetch({ url: '/transactions/agg/inventory/report?transaction_type=OUT' });
    const productPurchaseFrequency = useGetFetch({ url: '/transactions/agg/inventory/report?transaction_type=IN' });
    const productSalesFrequency = useGetFetch({ url: '/transactions/agg/inventory/report?transaction_type=OUT' });
    const purchaseVsSalesFrequency = useGetFetch({ url: '/transactions/agg/inventory/report' });


    useEffect(() => {
        const getData = async () => {
            await graphData.fetchData()
            await inventoryData.fetchData();
            await purchaseData.fetchData();
            await salesPerCategory.fetchData();
            await profitMargindata.fetchData();
            await dailySalesFrequency.fetchData();
            await salesFrequencyByCategory.fetchData();
            await productPurchaseFrequency.fetchData();
            await productSalesFrequency.fetchData();
            await purchaseVsSalesFrequency.fetchData();

        }
        getData();
        setYear(new Date().getFullYear())
    }, [])


    const sortedProfitMarginData = !profitMargindata.isLoading && profitMargindata.data?.data?.sort((a, b) => {
        const tA = (parseFloat(a.average_selling_price) - parseFloat(a.average_cost_price)) / parseFloat(a.average_selling_price)
        const tB = (parseFloat(b.average_selling_price) - parseFloat(b.average_cost_price)) / parseFloat(b.average_selling_price)

        if (tA > tB) return -1
        if (tB > tA) return 1
        return 0
    })

    !salesFrequencyByCategory.isLoading && salesFrequencyByCategory.data?.data?.forEach((p) => {
        if (Object.keys(CATEGORY_SALES_FREQUENCY).includes(p.Product.Category.name)) {
            CATEGORY_SALES_FREQUENCY[p.Product.Category.name] += parseFloat(p.totalTransactions);
        } else {
            CATEGORY_SALES_FREQUENCY[p.Product.Category.name] = parseFloat(p.totalTransactions);
        }
    })


    !productSalesFrequency.isLoading && productSalesFrequency.data?.data?.forEach((p) => {
        if (Object.keys(PRODUCT_SALES_FREQUENCY).includes(p.Product.Category.name)) {
            PRODUCT_SALES_FREQUENCY[p.Product.name] += parseFloat(p.totalTransactions);
        } else {
            PRODUCT_SALES_FREQUENCY[p.Product.name] = parseFloat(p.totalTransactions);
        }
    })

    !productPurchaseFrequency.isLoading && productPurchaseFrequency.data?.data?.forEach((p) => {
        if (Object.keys(PRODUCT_PURCHASE_FREQUENCY).includes(p.Product.Category.name)) {
            PRODUCT_PURCHASE_FREQUENCY[p.Product.name] += parseFloat(p.totalTransactions);
        } else {
            PRODUCT_PURCHASE_FREQUENCY[p.Product.name] = parseFloat(p.totalTransactions);
        }
    })

    purchaseData.data?.data?.forEach((p) => {
        if (Object.keys(PURCHASE_UNIQUE_CATEGORIES).includes(p.Product.Category.name)) {
            PURCHASE_UNIQUE_CATEGORIES[p.Product.Category.name] += parseFloat(p.totalAmount);
        } else {
            PURCHASE_UNIQUE_CATEGORIES[p.Product.Category.name] = parseFloat(p.totalAmount);
        }
    })

    !salesPerCategory.isLoading && salesPerCategory.data?.data?.forEach((p) => {
        if (Object.keys(SALES_UNIQUE_CATEGORIES).includes(p.Product.Category.name)) {
            SALES_UNIQUE_CATEGORIES[p.Product.Category.name] += parseFloat(p.totalAmount);
        } else {
            SALES_UNIQUE_CATEGORIES[p.Product.Category.name] = parseFloat(p.totalAmount);
        }
    })

    const LineOneDataset = {
        labels: !graphData.isLoading && graphData.data?.data?.map((d) => d.yearMonth),
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
        labels: !graphData.isLoading && graphData.data?.data?.map((d) => d.yearMonth),
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

    const HorzOneDataset = {
        labels: !purchaseData.isLoading && purchaseData.data?.data?.map((p) => p.Product.name),
        datasets: [
            {
                label: 'Product',
                data: !purchaseData.isLoading && purchaseData.data?.data?.map((p) => p.totalAmount),
                backgroundColor: 'rgba(75,192,192,1)',
            },
        ]
    }
    const DoghnutOneDataset = {
        labels: Object.keys(PURCHASE_UNIQUE_CATEGORIES),
        datasets: [
            {
                label: 'Category',
                data: Object.values(PURCHASE_UNIQUE_CATEGORIES),
                backgroundColor: Object.keys(PURCHASE_UNIQUE_CATEGORIES).map(() => getRandomColor())

            },
        ]
    }

    const HorzTwoDataset = {
        labels: !purchaseVsSalesFrequency.isLoading && Object.keys(purchaseVsSalesFrequency.data?.graphData),
        datasets: [
            {
                label: 'Purchase Frequency',
                data: !purchaseVsSalesFrequency.isLoading && Object.values(purchaseVsSalesFrequency.data?.graphData).map((v) => v.IN),
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
            },
            {
                label: 'Sales Frequency',
                data: !purchaseVsSalesFrequency.isLoading && Object.values(purchaseVsSalesFrequency.data?.graphData).map((v) => v.OUT),
                backgroundColor: 'rgba(75,192,192,1)',
            }
        ]
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
                                        {!dailySalesFrequency.isLoading && Object.entries(dailySalesFrequency.data?.data[0]).map((f, i) => {
                                            //ignoring transaction type from API
                                            if (f[0] !== 'transaction_type') {
                                                return (
                                                    <tr key={i} className="[&>*]:px-2">
                                                        <td className="capitalize">{(f[0])}</td>
                                                        <td className="text-right"> {parseFloat(f[1]).toLocaleString()} Frw</td>
                                                    </tr>
                                                )
                                            }
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
                                        {!salesPerCategory.isLoading && salesPerCategory.data?.data?.map((p, i) => {
                                            if (i < 3) return (
                                                <tr key={i} className="[&>*]:px-2">
                                                    <td>{p.Product.name}</td>
                                                    <td>{p.Product.Category.name}</td>
                                                    <td className="text-right">{parseFloat(p.totalAmount).toLocaleString()}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                            <h1 className="mx-2">Top 3 Performing Categories</h1>
                            <div className="my-2 font-light overflow-auto horizontal-custom-scrollbar">
                                <table className="table w-full text-left">
                                    <thead>
                                        <tr className="[&>*]:px-2">
                                            <th>Category</th>
                                            <th className="text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(SALES_UNIQUE_CATEGORIES).map((v, i) => {
                                            if (i < 3) {
                                                return <tr key={i} className="w-full">
                                                    <td className="w-1/3">{v[0]}</td>
                                                    <td className="w-1/3 text-right">{v[1].toLocaleString()}</td>
                                                </tr>
                                            }
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                            <h1 className="mx-2">Top 3 Profitable Products</h1>
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
                                        {!profitMargindata.isLoading && sortedProfitMarginData.slice(0, 3).map((t, i) => {
                                            return (
                                                <tr key={i} className="[&>*]:px-2">
                                                    <td>{t.Product.name}</td>
                                                    <td>{t.Product.Category.name}</td>
                                                    <td className="text-right">{
                                                        (((t.average_selling_price - t.average_cost_price) / t.average_selling_price) * 100).toFixed(1)
                                                    }% </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-2">
                    <h1 className="text-xl font-semibold p-2">Inventory Reports</h1>
                    <div className="grid grid-cols-2 gap-1">
                        <div>
                            <div className="flex flex-wrap justify-around mt-2 space-x-2">
                                <div className="basis-[45%]">
                                    <h1>Low Stock Alerts</h1>
                                    <div className="my-2 font-light overflow-auto horizontal-custom-scrollbar">
                                        <table className="table w-full text-left">
                                            <thead>
                                                <tr className="[&>*]:px-2">
                                                    <th>Product</th>
                                                    <th className="text-right">Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {inventoryData.data?.data?.slice(0, 3).map((product, index) => {
                                                    return (
                                                        <tr key={index} className="w-full">
                                                            <td className="w-1/3">{product.name}</td>
                                                            <td
                                                                className={`${parseFloat(product.quantity_in_stock) <= 10 ? 'text-red-500' : 'text-blue-500'} w-1/3 text-right`}>
                                                                {parseFloat(product.quantity_in_stock).toLocaleString()}
                                                            </td>
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
                                                    <th className="text-right">Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {inventoryData.data?.data?.slice(inventoryData.data?.data?.length - 3).reverse().map((product, index) => {
                                                    return (
                                                        <tr key={index} className="w-full">
                                                            <td className="w-1/3">{product.name}</td>
                                                            <td className={`${parseFloat(product.quantity_in_stock) > 200 ? 'text-orange-600' : 'text-blue-500'} w-1/3 text-right`}>{parseFloat(product.quantity_in_stock).toLocaleString()}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-around flex-wrap mt-2">
                                <div className="rounded-sm">
                                    <Doughnut data={DoghnutOneDataset} options={
                                        {
                                            responsive: true, aspectRatio: 1,
                                            plugins: {
                                                title: { display: true, text: 'Total Purchase/Category', font: { size: 16 } },
                                            }
                                        }} />
                                </div>
                                <div className="rounded-sm">
                                    <Bar data={HorzOneDataset} options={
                                        {
                                            responsive: true, aspectRatio: 1, indexAxis: 'y',
                                            scales: { y: { grid: { display: false }, ticks: { padding: 0 } } },
                                            plugins: { title: { display: true, text: 'Total Purchase/Product', font: { size: 16 } } }
                                        }} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-wrap justify-around mt-2 space-x-2">
                                <div className="basis-[45%]">
                                    <h1>Top Categories By Frequency - Sales</h1>
                                    <div className="my-2 font-light overflow-auto horizontal-custom-scrollbar">
                                        <table className="table w-full text-left">
                                            <thead>
                                                <tr className="[&>*]:px-2">
                                                    <th>Category</th>
                                                    <th className="text-right">Frequency</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(CATEGORY_SALES_FREQUENCY).slice(0, 3).map((c, i) => {
                                                    return (
                                                        <tr key={i} className="w-full">
                                                            <td>{c[0]}</td>
                                                            <td className="text-right">
                                                                {parseFloat(c[1]).toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="basis-[45%]">
                                    <h1>Top Products By Frequency - Purchase</h1>
                                    <div className="my-2 font-light overflow-auto horizontal-custom-scrollbar">
                                        <table className="table w-full text-left">
                                            <thead>
                                                <tr className="[&>*]:px-2">
                                                    <th>Product</th>
                                                    <th className="text-right">Frequncy</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(PRODUCT_PURCHASE_FREQUENCY).slice(0, 3).map((c, i) => {
                                                    return (
                                                        <tr key={i} className="w-full">
                                                            <td>{c[0]}</td>
                                                            <td className="text-right">
                                                                {parseFloat(c[1]).toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-sm flex justify-center mt-2">
                                <Bar data={HorzTwoDataset} options={
                                    {
                                        responsive: true,
                                        scales: { y: { grid: { display: false }, ticks: { padding: 0 } } },
                                        plugins: { title: { display: true, text: 'Product Purchase/Sales Frequency', font: { size: 16 } } }
                                    }} />
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