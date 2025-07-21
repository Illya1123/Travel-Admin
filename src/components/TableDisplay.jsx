import React, { useMemo, useState } from 'react'
import { useTable, useSortBy } from 'react-table'

const PAGE_SIZE = 20

const TableDisplay = ({ title, data, columns, exportExcel }) => {
    const [currentPage, setCurrentPage] = useState(1)

    const columnsWithIndex = useMemo(() => {
        return [
            {
                Header: 'STT',
                Cell: ({ row }) => (currentPage - 1) * PAGE_SIZE + row.index + 1,
            },
            ...columns,
        ]
    }, [columns, currentPage])

    // Sử dụng toàn bộ `data` cho useTable
    const tableInstance = useTable(
        { columns: columnsWithIndex, data },
        useSortBy
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance

    const pageCount = Math.ceil(rows.length / PAGE_SIZE)
    const paginatedRows = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE
        return rows.slice(start, start + PAGE_SIZE)
    }, [rows, currentPage])

    return (
        <div className="w-full bg-white rounded-xl shadow-md p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-green-600">{title}</h2>
                {exportExcel && (
                    <button
                        onClick={exportExcel}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-sm"
                    >
                        ⬇ Tải Excel
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table
                    {...getTableProps()}
                    className="w-full min-w-[1000px] text-sm text-left border"
                >
                    <thead className="sticky top-0 bg-gray-100 text-gray-700 z-10">
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps?.())}
                                        className="border p-2 cursor-pointer select-none hover:bg-gray-200 whitespace-nowrap"
                                    >
                                        {column.render('Header')}
                                        <span className="ml-1">
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? ' 🔽'
                                                    : ' 🔼'
                                                : ''}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {paginatedRows.length > 0 ? (
                            paginatedRows.map((row) => {
                                prepareRow(row)
                                return (
                                    <tr {...row.getRowProps()} className="hover:bg-gray-50">
                                        {row.cells.map((cell) => (
                                            <td
                                                {...cell.getCellProps()}
                                                className="border p-2 whitespace-nowrap"
                                            >
                                                {cell.render('Cell')}
                                            </td>
                                        ))}
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={columnsWithIndex.length} className="text-center p-4">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {rows.length > PAGE_SIZE && (
                <div className="flex justify-center mt-4 items-center gap-4 text-sm">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    >
                        ◀ Trước
                    </button>
                    <span>
                        Trang <strong>{currentPage}</strong> / {pageCount}
                    </span>
                    <button
                        disabled={currentPage === pageCount}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    >
                        Sau ▶
                    </button>
                </div>
            )}
        </div>
    )
}

export default TableDisplay
