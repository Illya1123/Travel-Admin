import React, { useEffect, useState, useMemo } from 'react'
import Swal from 'sweetalert2'
import { createTour, getAllTours, deleteTourById, updateTourById } from '../api/Tour'
import TableDisplay from '../components/TableDisplay'
import TourForm from '../components/TourForm'
import Modal from '../components/Modal'
import Loading from '../components/Loading'

const Tours = () => {
    const [tours, setTours] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editingTour, setEditingTour] = useState(null)
    const [searchKeyword, setSearchKeyword] = useState('')
    const [loading, setLoading] = useState(true)

    const filteredTours = useMemo(() => {
        if (!searchKeyword.trim()) return tours
        return tours.filter((tour) =>
            (tour.title + tour.country).toLowerCase().includes(searchKeyword.toLowerCase())
        )
    }, [searchKeyword, tours])

    const fetchTours = async () => {
        try {
            setLoading(true)
            const data = await getAllTours()
            setTours(data)
        } catch (err) {
            console.error('Lỗi khi tải tour:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async (values, resetForm) => {
        try {
            await createTour(values)
            Swal.fire('Tạo tour thành công!', '', 'success')
            resetForm()
            setShowForm(false)
            fetchTours()
        } catch (err) {
            Swal.fire('Lỗi khi tạo tour!', err.message, 'error')
        }
    }

    const handleUpdate = async (values, resetForm) => {
        try {
            await updateTourById(editingTour._id, values)
            Swal.fire('Cập nhật tour thành công!', '', 'success')
            resetForm()
            setEditingTour(null)
            setShowForm(false)
            fetchTours()
        } catch (err) {
            Swal.fire('Lỗi khi cập nhật tour!', err.message, 'error')
        }
    }

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: 'Xoá tour này sẽ không thể hoàn tác!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xoá',
            cancelButtonText: 'Huỷ',
        })

        if (confirm.isConfirmed) {
            try {
                await deleteTourById(id)
                Swal.fire('Đã xoá tour!', '', 'success')
                fetchTours()
            } catch (err) {
                Swal.fire('Lỗi khi xoá tour!', err.message, 'error')
            }
        }
    }

    const columns = useMemo(
        () => [
            {
                Header: 'Tiêu đề',
                accessor: 'title',
            },
            {
                Header: 'Quốc gia',
                accessor: 'country',
            },
            {
                Header: 'Loại tour',
                accessor: 'type',
            },
            {
                Header: 'Giá',
                accessor: 'price',
                Cell: ({ value }) =>
                    value?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
            },
            {
                Header: 'Điểm',
                accessor: 'score',
            },
            {
                Header: 'Hành động',
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            className="text-blue-600 font-medium"
                            onClick={() => {
                                setEditingTour(row.original)
                                setShowForm(true)
                            }}
                        >
                            Chỉnh sửa
                        </button>
                        <button
                            className="text-red-600 font-medium"
                            onClick={() => handleDelete(row.original._id)}
                        >
                            Xoá
                        </button>
                    </div>
                ),
            },
        ],
        []
    )

    useEffect(() => {
        fetchTours()
    }, [])

    if (loading) return <Loading />
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tiêu đề hoặc quốc gia..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="border px-4 py-2 rounded w-72 shadow-sm focus:outline-none focus:ring focus:ring-blue-300 mr-4"
                />
                <button
                    onClick={() => {
                        setShowForm(true)
                        setEditingTour(null)
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    + Thêm tour
                </button>
            </div>

            <TableDisplay title="Danh sách tour" data={filteredTours} columns={columns} />

            <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
                <TourForm
                    onSubmit={editingTour ? handleUpdate : handleCreate}
                    initialValues={editingTour || {}}
                    editingTourId={editingTour?._id}
                    onCancel={() => {
                        setEditingTour(null)
                        setShowForm(false)
                    }}
                />
            </Modal>
        </div>
    )
}

export default Tours
