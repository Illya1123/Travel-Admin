import axios from 'axios'

const baseUrl = import.meta.env.VITE_BACKEND

export const getStats = async (year, month) => {
    const token = localStorage.getItem('accessToken')
    const response = await axios.get(`${baseUrl}/api/dashboard/stats`, {
            params: { year, month },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    return response.data
}