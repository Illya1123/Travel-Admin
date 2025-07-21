import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar cố định, không cuộn */}
            <div className="w-64 bg-white border-r border-gray-200 fixed top-0 left-0 h-screen z-10">
                <Sidebar />
            </div>

            {/* Nội dung chính, có thể cuộn */}
            <div className="ml-64 flex-1 h-screen overflow-y-auto bg-gray-100 p-6">
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout
