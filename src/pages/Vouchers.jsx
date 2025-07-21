import React, { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import { FaEdit, FaTrash } from 'react-icons/fa'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import {
    createVoucherCode,
    getAllVoucher,
    updateVoucherById,
    deleteVoucherById,
} from '../api/voucher'
import VoucherForm from '../components/VoucherForm'
import TableDisplay from '../components/TableDisplay'

const Voucher = () => {
    const [vouchers, setVouchers] = useState([])
    const [editingVoucherId, setEditingVoucherId] = useState(null)
    const [initialFormValues, setInitialFormValues] = useState(null)

    const fetchVouchers = async () => {
        try {
            const res = await getAllVoucher()
            setVouchers(res || [])
        } catch (error) {
            console.error('Lỗi lấy danh sách voucher:', error)
        }
    }

    useEffect(() => {
        fetchVouchers()
    }, [])

    const handleSubmit = async (values, resetForm) => {
        try {
            if (editingVoucherId) {
                await updateVoucherById(editingVoucherId, values)
                Swal.fire('Đã cập nhật voucher', '', 'success')
            } else {
                await createVoucherCode(values)
                Swal.fire('Tạo voucher thành công', '', 'success')
            }
            resetForm()
            setEditingVoucherId(null)
            setInitialFormValues(null)
            fetchVouchers()
        } catch (error) {
            Swal.fire('Lỗi', error.response?.data?.message || 'Thất bại', 'error')
        }
    }

    const handleEdit = (voucher) => {
        setInitialFormValues({
            code: voucher.code,
            quantity: voucher.quantity,
            type: voucher.type,
            discountValue: voucher.discountValue,
            maxDiscount: voucher.maxDiscount || '',
            minOrderValue: voucher.minOrderValue,
            expiryDate: voucher.expiryDate.split('T')[0],
            isActive: voucher.isActive,
        })
        setEditingVoucherId(voucher._id)
    }

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Bạn chắc chắn?',
            text: 'Thao tác này không thể hoàn tác!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xoá',
            cancelButtonText: 'Huỷ',
        })

        if (confirm.isConfirmed) {
            try {
                await deleteVoucherById(id)
                fetchVouchers()
                Swal.fire('Đã xoá voucher!', '', 'success')
            } catch (error) {
                Swal.fire('Lỗi xoá voucher!', '', 'error')
            }
        }
    }

    const exportToExcel = () => {
        const data = vouchers.map((v) => ({
            'Mã Voucher': v.code,
            Loại: v.type === 'fixed' ? 'Số tiền (VNĐ)' : 'Phần trăm (%)',
            'Giá trị giảm':
                v.type === 'percentage'
                    ? `${v.discountValue}%`
                    : `${v.discountValue.toLocaleString()} VNĐ`,
            'Tối đa': v.maxDiscount ? `${v.maxDiscount.toLocaleString()} VNĐ` : '',
            'Số lượng': v.quantity,
            'Ngày hết hạn': new Date(v.expiryDate).toLocaleDateString('vi-VN'),
            'Đơn hàng tối thiểu': `${v.minOrderValue.toLocaleString()} VNĐ`,
            'Trạng thái': v.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động',
        }))
        const ws = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Vouchers')
        const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const blob = new Blob([buffer], { type: 'application/octet-stream' })
        saveAs(blob, 'vouchers.xlsx')
    }

    const columns = useMemo(
        () => [
            { Header: 'Mã', accessor: 'code' },
            {
                Header: 'Loại',
                accessor: 'type',
                Cell: ({ value }) => (value === 'fixed' ? 'Số tiền (VNĐ)' : 'Phần trăm (%)'),
            },
            {
                Header: 'Giá trị',
                accessor: 'discountValue',
                Cell: ({ row }) =>
                    row.original.type === 'percentage'
                        ? `${row.original.discountValue}%`
                        : `${row.original.discountValue.toLocaleString()}₫`,
            },
            {
                Header: 'Tối đa',
                accessor: 'maxDiscount',
                Cell: ({ value }) => (value ? `${value.toLocaleString()}₫` : '—'),
            },
            { Header: 'SL', accessor: 'quantity' },
            {
                Header: 'HSD',
                accessor: 'expiryDate',
                Cell: ({ value }) => new Date(value).toLocaleDateString('vi-VN'),
            },
            {
                Header: 'Đơn hàng tối thiểu',
                accessor: 'minOrderValue',
                Cell: ({ value }) => `${value.toLocaleString()}₫`,
            },
            {
                Header: 'Trạng thái',
                accessor: 'isActive',
                Cell: ({ value }) => (
                    <span
                        className={`px-2 py-1 text-xs rounded ${
                            value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                    >
                        {value ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                    </span>
                ),
            },
            {
                Header: 'Thao tác',
                Cell: ({ row }) => (
                    <div className="flex gap-3">
                        <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleEdit(row.original)}
                            title="Sửa"
                        >
                            <FaEdit size={18} />
                        </button>
                        <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(row.original._id)}
                            title="Xoá"
                        >
                            <FaTrash size={18} />
                        </button>
                    </div>
                ),
            },
        ],
        [vouchers]
    )

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-6">
            <VoucherForm
                onSubmit={handleSubmit}
                editingVoucherId={editingVoucherId}
                initialValues={initialFormValues}
                onCancel={() => {
                    setEditingVoucherId(null)
                    setInitialFormValues(null)
                }}
            />
            <TableDisplay
                title="Danh sách voucher"
                data={vouchers}
                columns={columns}
                exportExcel={exportToExcel}
            />
        </div>
    )
}

export default Voucher
