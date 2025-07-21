import React from 'react'
import { useTable, useSortBy } from 'react-table'

const TableDisplay = ({ title, data, columns, exportExcel }) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        { columns, data },
        useSortBy
    )

    return (
        <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-md p-6 overflow-auto">
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

            <div className="overflow-x-auto max-h-[600px]">
                <table {...getTableProps()} className="w-full text-sm text-left border">
                    <thead className="sticky top-0 bg-gray-100 text-gray-700 z-10">
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className="border p-2 cursor-pointer select-none hover:bg-gray-200"
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
                        {rows.length > 0 ? (
                            rows.map((row) => {
                                prepareRow(row)
                                return (
                                    <tr {...row.getRowProps()} className="hover:bg-gray-50">
                                        {row.cells.map((cell) => (
                                            <td {...cell.getCellProps()} className="border p-2">
                                                {cell.render('Cell')}
                                            </td>
                                        ))}
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center p-4">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TableDisplay
