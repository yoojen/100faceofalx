import Footer from "../../components/Footer";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { BarChart } from "@mui/x-charts/BarChart";
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import { FaRankingStar } from "react-icons/fa6";
import { useEffect } from "react";


function Dashboard() {
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchUsers = async () => {
            const controller = new AbortController();
            try {
                const users = await axiosPrivate.get('/users', {
                    signal: controller.signal
                });
                console.log(users);
                return users;
            } catch (error) {
                console.log(error.toString());
                return;
            }
        }
        fetchUsers();
    }, []);

    return (
        <div className="px-5 bg-slate-200">
            <h1 className="text-2xl font-medium text-blue-500">AHABANZA</h1>
            <div className="md:flex md:basis-3/4 md:space-x-3 mb-4">
                <div className="md:w-2/4 [&>*]:bg-white [&>*]:rounded-sm [&>*]:shadow-md [&>*]:p-2 space-y-3">
                    <div>
                        <div className="px-2 text-blue-500 font-medium">
                            <h1>Incamake</h1>
                        </div>
                        <div className="flex justify-around [&>*]:flex [&>*]:flex-col [&>*]:justify-around [&>*]:items-center [&>*]:-space-y-2">
                            <div className="text-yellow-500 px-2">
                                <p className="space-x-3">
                                    &euro;
                                    <span>500</span>
                                </p>
                                <small>Ibyagurishijwe</small>
                            </div>
                            <div className="text-blue-500 px-2">
                                <p className="space-x-3">
                                    &euro;
                                    <span>500</span>
                                </p>
                                <small>ayinjiye</small>
                            </div>
                            <div className="text-red-600 px-2">
                                <p className="space-x-3">
                                    &euro;
                                    <span>500</span>
                                </p>
                                <small>Ibyasohotse</small>
                            </div>
                            <div className="text-green-500">
                                <p className="space-x-3">
                                    &euro;
                                    <span>500</span>
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
                                <tr>
                                    <td>amasaka</td>
                                    <td>200kgs</td>
                                    <td>frw 250, 500</td>
                                </tr>
                                <tr>
                                    <td>ibigori</td>
                                    <td>200kgs</td>
                                    <td>frw 250, 500</td>
                                </tr>
                                <tr>
                                    <td>ingano</td>
                                    <td>200kgs</td>
                                    <td>frw 250, 500</td>
                                </tr>
                                <tr>
                                    <td>uburo</td>
                                    <td>200kgs</td>
                                    <td>frw 250, 500</td>
                                </tr>
                                <tr>
                                    <td>amamera</td>
                                    <td>200kgs</td>
                                    <td>frw 250, 500</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <div className="text-blue-500 px-2 font-medium">
                            <FaRankingStar />
                            <h1 className="capitalize">uko ibicuruzwa byagurishijwe (top 5)</h1>
                        </div>
                        <div className="my-2">
                            <table className="w-full">
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