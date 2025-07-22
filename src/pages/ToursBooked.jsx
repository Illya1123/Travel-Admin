import React, { useEffect, useMemo, useState } from 'react'
import TableDisplay from '../components/TableDisplay'
import Loading from '../components/Loading'
import { getAllOrder, updateOrderStatus } from '../api/tour_booked'
import moment from 'moment'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

const BookedManager = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        date: null,
    })

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true)
                const data = await getAllOrder()
                setOrders(data || [])
            } catch (err) {
                console.error('Lỗi khi load danh sách đặt tour:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [])

    const handleSearchChange = (e) => {
        setFilters({ ...filters, search: e.target.value })
    }

    const handleStatusChange = (e) => {
        setFilters({ ...filters, status: e.target.value })
    }

    const handleStatusUpdate = async (orderId, currentStatus) => {
        const { value: newStatus } = await Swal.fire({
            title: 'Cập nhật trạng thái',
            html: `
                <select id="swal-select" class="swal2-input !w-fit !max-w-[200px] !px-2 !py-1 !rounded-md !border !border-gray-300 text-sm">
                    <option value="Đã đặt" ${currentStatus === 'Đã đặt' ? 'selected' : ''}>Đã đặt</option>
                    <option value="Đã thanh toán" ${currentStatus === 'Đã thanh toán' ? 'selected' : ''}>Đã thanh toán</option>
                    <option value="Đã hủy" ${currentStatus === 'Đã hủy' ? 'selected' : ''}>Đã hủy</option>
                </select>
            `,
            focusConfirm: false,
            preConfirm: () => {
                const selectEl = document.getElementById('swal-select')
                return selectEl?.value
            },
            showCancelButton: true,
            confirmButtonText: 'Cập nhật',
            cancelButtonText: 'Hủy',
        })

        if (newStatus && newStatus !== currentStatus) {
            try {
                const updated = await updateOrderStatus(orderId, newStatus)
                setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)))
                Swal.fire('Thành công', 'Đã cập nhật trạng thái', 'success')
                const refreshedOrders = await getAllOrder()
                setOrders(refreshedOrders || [])
            } catch (error) {
                Swal.fire('Lỗi', 'Không thể cập nhật trạng thái', 'error')
            }
        }
    }

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const keyword = filters.search.toLowerCase()
            const matchesSearch =
                order.orderId?.toLowerCase().includes(keyword) ||
                order.userId?.name?.toLowerCase().includes(keyword) ||
                order.userId?.email?.toLowerCase().includes(keyword) ||
                order.tour?.[0]?.tourId?.title?.toLowerCase().includes(keyword) ||
                order.voucherCode?.toLowerCase().includes(keyword)

            const matchesStatus = filters.status ? order.status === filters.status : true

            const matchesDate = filters.date
                ? dayjs(order.createdAt).format('YYYY-MM-DD') === filters.date.format('YYYY-MM-DD')
                : true

            return matchesSearch && matchesStatus && matchesDate
        })
    }, [orders, filters])

    const columns = [
        { Header: 'Mã đơn hàng', accessor: 'orderId' },
        { Header: 'Người đặt', accessor: 'userId.name' },
        { Header: 'Email', accessor: 'userId.email' },
        {
            Header: 'Tên tour',
            accessor: (row) => row.tour[0]?.tourId?.title || '(Không có)',
        },
        {
            Header: 'Ngày khởi hành',
            accessor: (row) => moment(row.tour[0]?.date).format('DD/MM/YYYY') || 'Không rõ',
        },
        {
            Header: 'Số điện thoại',
            accessor: 'pickupPhone',
        },
        {
            Header: 'Địa điểm đón',
            accessor: 'pickupAddress',
        },
        {
            Header: 'Người lớn',
            accessor: (row) => row.tour[0]?.numberOfAdults || 0,
        },
        {
            Header: 'Trẻ em',
            accessor: (row) => row.tour[0]?.numberOfChildren || 0,
        },
        {
            Header: 'Giá gốc',
            accessor: 'originalPrice',
            Cell: ({ value }) => value?.toLocaleString('vi-VN') + ' ₫',
        },
        {
            Header: 'Giảm giá',
            accessor: 'discountAmount',
            Cell: ({ value }) => value?.toLocaleString('vi-VN') + ' ₫',
        },
        {
            Header: 'Tổng tiền',
            accessor: 'totalPrice',
            Cell: ({ value }) => value?.toLocaleString('vi-VN') + ' ₫',
        },
        {
            Header: 'Voucher',
            accessor: 'voucherCode',
            Cell: ({ value }) => value || 'Không dùng',
        },
        {
            Header: 'Thanh toán',
            accessor: 'paymentMethod',
        },
        {
            Header: 'Trạng thái',
            accessor: 'status',
            Cell: ({ value, row }) => {
                const order = row.original
                const color =
                    value === 'Đã thanh toán'
                        ? 'text-green-600'
                        : value === 'Đã hủy'
                          ? 'text-red-600'
                          : 'text-yellow-500'

                return (
                    <div className="flex items-center gap-2">
                        <span className={color}>{value}</span>
                        <button
                            onClick={() => handleStatusUpdate(order._id, value)}
                            className="text-blue-600 text-xs hover:underline"
                        >
                            Sửa
                        </button>
                    </div>
                )
            },
        },
        {
            Header: 'Ngày đặt',
            accessor: 'createdAt',
            Cell: ({ value }) => moment(value).format('DD/MM/YYYY HH:mm'),
        },
    ]

    const exportToExcel = () => {
        const dataToExport = filteredOrders.map((order, index) => ({
            STT: index + 1,
            'Mã đơn hàng': order.orderId,
            'Người đặt': order.userId?.name,
            Email: order.userId?.email,
            'Tên tour': order.tour?.[0]?.tourId?.title,
            'Ngày khởi hành': moment(order.tour?.[0]?.date).format('DD/MM/YYYY'),
            'Số điện thoại': order.pickupPhone,
            'Địa điểm đón': order.pickupAddress,
            'Người lớn': order.tour?.[0]?.numberOfAdults,
            'Trẻ em': order.tour?.[0]?.numberOfChildren,
            'Giá gốc': order.originalPrice,
            'Giảm giá': order.discountAmount,
            'Tổng tiền': order.totalPrice,
            Voucher: order.voucherCode || 'Không dùng',
            'Thanh toán': order.paymentMethod,
            'Trạng thái': order.status,
            'Ngày đặt': moment(order.createdAt).format('DD/MM/YYYY HH:mm'),
        }))

        const worksheet = XLSX.utils.json_to_sheet(dataToExport)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Đơn đặt tour')

        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        })

        const blob = new Blob([excelBuffer], {
            type: 'application/octet-stream',
        })

        saveAs(blob, `don_dat_tour_${moment().format('YYYYMMDD_HHmmss')}.xlsx`)
    }

    if (loading) return <Loading />

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm đơn hàng, tên tour, email, voucher..."
                    value={filters.search}
                    onChange={handleSearchChange}
                    className="px-4 py-2 border rounded-md w-full sm:w-[300px]"
                />
                <select
                    value={filters.status}
                    onChange={handleStatusChange}
                    className="!w-fit !px-4 !py-2 !border !rounded-md !border-gray-300 text-sm shadow-sm"
                >
                    <option value="">-- Tất cả trạng thái --</option>
                    <option value="Đã đặt">Đã đặt</option>
                    <option value="Đã thanh toán">Đã thanh toán</option>
                    <option value="Đã hủy">Đã hủy</option>
                </select>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={filters.date}
                        format="DD/MM/YYYY"
                        onChange={(date) => setFilters({ ...filters, date })}
                        slotProps={{
                            textField: {
                                size: 'small',
                                className:
                                    'bg-white border border-gray-300 rounded-md px-2 !min-w-[180px]',
                            },
                        }}
                    />
                </LocalizationProvider>

                {filters.date && (
                    <button
                        onClick={() => setFilters({ ...filters, date: null })}
                        className="text-sm text-red-500 hover:underline"
                    >
                        Xoá lọc ngày
                    </button>
                )}
            </div>

            <TableDisplay
                title="Danh sách đơn đặt tour"
                data={filteredOrders}
                columns={columns}
                exportExcel={exportToExcel}
            />
        </div>
    )
}

export default BookedManager
