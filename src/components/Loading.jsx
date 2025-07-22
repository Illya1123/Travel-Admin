import React from 'react'

const Loading = () => {
    return (
        <div className="flex flex-col justify-center items-center h-[50vh]">
            <img
                src="https://res.cloudinary.com/dnroxsd4n/image/upload/v1753205512/lp-content-cat_fcjswx.gif"
                alt="Loading..."
                className="w-100 h-100 object-contain"
                loading="lazy"
                decoding="async"
            />
            <p className="mt-4 text-lg text-gray-700 font-medium">Đang tải dữ liệu...</p>
        </div>
    )
}

export default Loading
