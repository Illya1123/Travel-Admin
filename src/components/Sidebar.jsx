import { FaHome, FaUsers, FaCog } from "react-icons/fa"
import { Link } from "react-router-dom"

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col space-y-4">
        <Link to="/" className="flex items-center gap-2 hover:text-blue-400">
          <FaHome /> Dashboard
        </Link>
        <Link to="/users" className="flex items-center gap-2 hover:text-blue-400">
          <FaUsers /> Users
        </Link>
        <Link to="/settings" className="flex items-center gap-2 hover:text-blue-400">
          <FaCog /> Settings
        </Link>
      </nav>
    </div>
  )
}

export default Sidebar
