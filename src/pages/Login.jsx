import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginSuccess } from '../store/slices/authSlice'
import { FaRegEye, FaRegEyeSlash, FaLock } from 'react-icons/fa'
import { MdAlternateEmail, MdAdminPanelSettings } from 'react-icons/md'
import { signinAdmin } from '../api'
import './auth.css'

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const togglePasswordView = () => setShowPassword(!showPassword)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('') // reset lỗi trước khi gửi

        try {
            const res = await signinAdmin({ email, password })
            const { accessToken, userData } = res

            if (userData?.role !== 'admin') {
                setError('Tài khoản này không có quyền truy cập trang admin.')
                return
            }

            // Lưu thông tin
            localStorage.setItem('isLogin', true)
            localStorage.setItem('adminEmail', userData.email)
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('adminData', JSON.stringify(userData))

            dispatch(loginSuccess({ email: userData.email })) // Redux
            navigate('/')
        } catch (err) {
            const msg =
                err?.response?.data?.mes ||
                err?.response?.data?.message ||
                'Đăng nhập thất bại. Vui lòng thử lại.'
            setError(msg)
        }
    }

    return (
        <section className="login relative h-screen w-full">
            <div className="overlay absolute left-0 top-0 z-10 h-full w-full bg-black/50"></div>
            <video
                src="https://res.cloudinary.com/dnroxsd4n/video/upload/f_auto,q_auto,vc_auto/v1753032082/admin_login_zn6wl0.mp4"
                type="video/mp4"
                loop
                autoPlay
                muted
                className="absolute left-0 top-0 z-0 h-full w-full object-cover"
            ></video>

            <div className="loginContent relative z-20 flex h-full w-full items-center justify-center">
                <div className="w-[90%] max-w-md rounded-2xl bg-gray-900/80 p-8 text-white shadow-2xl backdrop-blur-md md:max-w-lg">
                    <div className="mb-6 flex items-center justify-center gap-2 text-3xl font-bold text-blue-400">
                        <MdAdminPanelSettings />
                        <span>Admin Login</span>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Email input */}
                        <div className="flex items-center gap-3 rounded-xl bg-gray-800 p-3">
                            <MdAlternateEmail className="text-lg" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-transparent text-white outline-none placeholder-gray-400"
                            />
                        </div>

                        {/* Password input */}
                        <div className="flex items-center gap-3 rounded-xl bg-gray-800 p-3 pr-10 relative">
                            <FaLock className="text-lg" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-transparent text-white outline-none placeholder-gray-400"
                            />
                            {showPassword ? (
                                <FaRegEyeSlash
                                    className="absolute right-4 cursor-pointer text-lg text-gray-300"
                                    onClick={togglePasswordView}
                                />
                            ) : (
                                <FaRegEye
                                    className="absolute right-4 cursor-pointer text-lg text-gray-300"
                                    onClick={togglePasswordView}
                                />
                            )}
                        </div>

                        {error && <p className="text-sm text-red-400">{error}</p>}

                        <button
                            type="submit"
                            className="mt-2 w-full rounded-xl bg-blue-600 p-3 text-white transition hover:bg-blue-700"
                        >
                            Đăng nhập
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Login
