import React from 'react'
import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
    const navigate = useNavigate()

    return (
        <div className="flex min-h-[calc(100vh-100px)] items-center justify-center bg-white px-4 py-12">
            <div className="w-full max-w-md text-center">
                <h1 className="text-7xl font-bold leading-none text-indigo-600">404</h1>
                <div className="relative my-6 h-40 w-full">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                "url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')",
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-gray-800">Oops! Page Not Found</h2>
                <p className="mb-6 text-gray-600">
                    Trang bạn đang tìm không tồn tại hoặc đã bị chuyển đến route khác
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="w-full rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white transition duration-200 hover:bg-indigo-700"
                >
                    Quay về trang chủ
                </button>
            </div>
        </div>
    )
}

export default NotFoundPage