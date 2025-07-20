import { FaHome, FaUsers, FaCog } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'

const tabs = [
    { label: 'Dashboard', path: '/', icon: <FaHome /> },
    { label: 'Users', path: '/users', icon: <FaUsers /> },
    { label: 'Settings', path: '/settings', icon: <FaCog /> },
]

const Sidebar = () => {
    const location = useLocation()

    return (
        <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-4">
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
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
    )
}

export default Sidebar
