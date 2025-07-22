import React, { useEffect, useState } from 'react'
import {
    FaUsers,
    FaRegChartBar,
    FaHotel,
    FaRegCalendarCheck,
    FaRegTimesCircle,
} from 'react-icons/fa'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getStats } from '../api/dashboard'
import NoData from '../components/NoData'
import Loading from '../components/Loading'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
dayjs.locale('vi')

const Dashboard = () => {
    const [selectedDate, setSelectedDate] = useState(dayjs())
    const [year, setYear] = useState(selectedDate.year())
    const [month, setMonth] = useState(selectedDate.month() + 1)
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const selectedYear = selectedDate.year()
        const selectedMonth = selectedDate.month() + 1
        setYear(selectedYear)
        setMonth(selectedMonth)
    }, [selectedDate])

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true)
                setError(false)
                const data = await getStats(year, month, selectedDate.date())
                setStats(data)
            } catch (err) {
                console.error('Lỗi khi lấy dữ liệu dashboard:', err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [year, month, selectedDate])

    const StatCard = ({ icon, label, value, color }) => (
        <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-4 hover:shadow-lg transition duration-200">
            <div className={`text-3xl ${color}`}>{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-xl font-semibold text-gray-800">{value}</p>
            </div>
        </div>
    )

    if (loading) return <Loading />
    if (error || !stats) return <NoData />

    const {
        totalUsers,
        totalTours,
        totalBookedTours,
        totalCanceledTours,
        monthlyRevenue,
        todayRevenue,
        revenueChart,
        dailyRevenue,
    } = stats

    return (
        <main className="min-h-screen bg-gray-100 p-6 sm:p-8 space-y-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Thông tin tổng quan</h1>
                    <p className="text-gray-500 mt-1">
                        Chọn ngày bất kỳ để xem thống kê tháng tương ứng
                    </p>
                </div>
            </div>

            {/* Thẻ thống kê */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                <StatCard
                    icon={<FaUsers />}
                    label="Tổng người dùng"
                    value={totalUsers}
                    color="text-blue-500"
                />
                <StatCard
                    icon={<FaHotel />}
                    label="Tổng số tour"
                    value={totalTours}
                    color="text-green-500"
                />
                <StatCard
                    icon={<FaRegCalendarCheck />}
                    label={`Tour đã đặt T${month}`}
                    value={totalBookedTours}
                    color="text-orange-500"
                />
                <StatCard
                    icon={<FaRegTimesCircle />}
                    label={`Tour bị huỷ T${month}`}
                    value={totalCanceledTours}
                    color="text-red-500"
                />
                <StatCard
                    icon={<FaRegChartBar />}
                    label={`Doanh thu ngày ${selectedDate.date()}/${month}`}
                    value={stats.selectedDayRevenue.toLocaleString('vi-VN') + ' VNĐ'}
                    color="text-cyan-500"
                />

                <StatCard
                    icon={<FaRegChartBar />}
                    label={`Doanh thu T${month}`}
                    value={monthlyRevenue.toLocaleString('vi-VN') + ' VNĐ'}
                    color="text-purple-500"
                />
                <StatCard
                    icon={<FaRegChartBar />}
                    label="Doanh thu hôm nay"
                    value={todayRevenue.toLocaleString('vi-VN') + ' VNĐ'}
                    color="text-pink-500"
                />
            </div>

            {/* Biểu đồ doanh thu theo tháng */}
            {/* Doanh thu theo tháng + Lịch chọn ngày */}
            <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col xl:flex-row gap-8">
                <div className="flex-1">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">
                        Doanh thu theo tháng - {year}
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={revenueChart}
                            margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                            barSize={40}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="thang" />
                            <YAxis
                                tickFormatter={(value) => value.toLocaleString('vi-VN')}
                                width={80}
                            />
                            <Tooltip
                                formatter={(value) => `${value.toLocaleString('vi-VN')} VNĐ`}
                            />
                            <Bar dataKey="doanhThu" fill="#8884d8" radius={[5, 5, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Lịch chọn ngày */}
                <div className="w-full xl:w-[300px]">
                    <p className="text-gray-700 font-medium mb-2">Chọn ngày:</p>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
                        <DateCalendar
                            value={selectedDate}
                            onChange={(newValue) => setSelectedDate(newValue)}
                        />
                    </LocalizationProvider>
                </div>
            </div>

            {/* Biểu đồ doanh thu theo ngày */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Doanh thu theo ngày - Tháng {month}/{year}
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={dailyRevenue}
                        margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                        barSize={20}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="ngay"
                            angle={-45}
                            textAnchor="end"
                            height={70}
                            interval={0}
                        />
                        <YAxis
                            tickFormatter={(value) => value.toLocaleString('vi-VN')}
                            width={80}
                        />
                        <Tooltip formatter={(value) => `${value.toLocaleString('vi-VN')} VNĐ`} />
                        <Bar dataKey="doanhThu" fill="#82ca9d" radius={[5, 5, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </main>
    )
}

export default Dashboard
