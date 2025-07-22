import React from 'react'

const NoData = ({ message = 'Không nhận được dữ liệu từ máy chủ' }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center">
            <img
                src="https://media.tenor.com/dyx62cEFtb8AAAAi/doraemon-walking-across-screen.gif"
                alt="No data"
                className="w-80 h-80 mb-4 opacity-80 object-contain"
            />
            <h2 className="text-lg font-semibold text-gray-600">{message}</h2>
        </div>
    )
}

export default NoData
