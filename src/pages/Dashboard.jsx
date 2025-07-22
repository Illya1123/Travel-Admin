import React, { useEffect, useState } from 'react'
import {
    FaUsers,
    FaRegChartBar,
    FaHotel,
    FaRegCalendarCheck,
    FaRegTimesCircle,
} from 'react-icons/fa'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import { getStats } from '../api/dashboard'

const Dashboard = () => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1

    const [year, setYear] = useState(currentYear)
    const [month, setMonth] = useState(currentMonth)
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const fetchStats = async (selectedYear, selectedMonth) => {
        try {
            setLoading(true)
            setError(false)
            const data = await getStats(selectedYear, selectedMonth)
            if (!data) setError(true)
            else setStats(data)
        } catch (err) {
            console.error('Lỗi khi lấy dữ liệu dashboard:', err)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats(year, month)
    }, [year, month])

    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i)
    const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)

    if (loading) return <p className="p-8 text-lg">Đang tải dữ liệu...</p>

    if (error || !stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8 text-center">
                <img
                    src="https://media.tenor.com/dyx62cEFtb8AAAAi/doraemon-walking-across-screen.gif"
                    alt="No data"
                    className="w-60 h-60 mb-4 opacity-80"
                />
                <h2 className="text-xl font-semibold text-gray-600">
                    Không nhận được dữ liệu từ máy chủ
                </h2>
            </div>
        )
    }

    const {
        totalUsers,
        totalTours,
        totalBookedTours,
        totalCanceledTours,
        monthlyRevenue,
        revenueChart,
    } = stats

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Thông tin tổng quan</h1>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label htmlFor="year" className="text-gray-700 font-medium">
                            Năm:
                        </label>
                        <select
                            id="year"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="border rounded-xl px-4 py-2 shadow-sm"
                        >
                            {yearOptions.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="month" className="text-gray-700 font-medium">
                            Tháng:
                        </label>
                        <select
                            id="month"
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
                            className="border rounded-xl px-4 py-2 shadow-sm"
                        >
                            {monthOptions.map((m) => (
                                <option key={m} value={m}>Tháng {m}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Thẻ thống kê */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
                <StatCard
                    icon={<FaUsers className="text-blue-500 text-3xl" />}
                    label="Tổng người dùng"
                    value={totalUsers}
                />
                <StatCard
                    icon={<FaHotel className="text-green-500 text-3xl" />}
                    label="Tổng số tour"
                    value={totalTours}
                />
                <StatCard
                    icon={<FaRegCalendarCheck className="text-orange-500 text-3xl" />}
                    label={`Tour đã đặt tháng ${month}`}
                    value={totalBookedTours}
                />
                <StatCard
                    icon={<FaRegTimesCircle className="text-red-500 text-3xl" />}
                    label={`Tour bị huỷ tháng ${month}`}
                    value={totalCanceledTours}
                />
                <StatCard
                    icon={<FaRegChartBar className="text-purple-500 text-3xl" />}
                    label={`Doanh thu tháng ${month}`}
                    value={monthlyRevenue.toLocaleString('vi-VN') + ' VNĐ'}
                />
            </div>

            {/* Biểu đồ doanh thu */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
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
                        <Tooltip formatter={(value) => `${value.toLocaleString('vi-VN')} VNĐ`} />
                        <Bar dataKey="doanhThu" fill="#8884d8" radius={[5, 5, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </main>
    )
}

const StatCard = ({ icon, label, value }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-4 hover:shadow-lg transition duration-200">
        {icon}
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xl font-semibold text-gray-800">{value}</p>
        </div>
    </div>
)

export default Dashboard
