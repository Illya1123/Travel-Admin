import { FaHome, FaUsers, FaCog, FaSignOutAlt, FaTicketAlt } from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'

const tabs = [
    { label: 'Dashboard', path: '/', icon: <FaHome /> },
    { label: 'Users', path: '/users', icon: <FaUsers /> },
    { label: 'Vouchers', path: '/vouchers', icon: <FaTicketAlt /> },
    { label: 'Settings', path: '/settings', icon: <FaCog /> },
]

const Sidebar = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const adminData = JSON.parse(localStorage.getItem('adminData')) || {}
    const name = adminData.name || 'Admin'
    const avatar = adminData.avatar || 'https://i.pravatar.cc/150?img=11'

    const handleLogout = () => {
        localStorage.removeItem('isLogin')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('adminData')
        dispatch(logout())
        navigate('/login')
    }

    return (
        <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-4 justify-between">
            <div>
                {/* Avatar & Name */}
                <div className="flex flex-col items-center mb-6">
                    <img
                        src={avatar}
                        alt="Avatar"
                        className="w-16 h-16 rounded-full object-cover border-2 border-white mb-2"
                    />
                    <div className="text-lg font-semibold text-center truncate max-w-[140px]">
                        {name}
                    </div>
                </div>

                {/* Navigation Tabs */}
                <nav className="flex flex-col space-y-4">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            className={`flex items-center gap-3 hover:text-blue-400 ${
                                location.pathname === tab.path ? 'text-blue-400 font-semibold' : ''
                            }`}
                        >
                            <span className="text-2xl">{tab.icon}</span>
                            <span className="text-base">{tab.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="flex items-center gap-3 mt-6 text-red-400 hover:text-red-300"
            >
                <FaSignOutAlt className="text-xl" />
                <span className="text-base">Đăng xuất</span>
            </button>
        </div>
    )
}

export default Sidebar
