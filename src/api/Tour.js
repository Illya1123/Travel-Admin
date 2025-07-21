import axios from 'axios'

const baseUrl = import.meta.env.VITE_BACKEND

export const getAllTours = async () => {
    try {
        const response = await axios.get(`${baseUrl}/api/tour/getAllTours`)
        return response.data
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tour:', error.response?.data || error.message)
        throw error
    }
}

export const createTour = async (data, token) => {
    try {
        const response = await axios.post(`${baseUrl}/api/tour/createTours`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error) {
        console.error('Lỗi khi tạo tour:', error.response?.data || error.message)
        throw error
    }
}

export const updateTourById = async (id, data) => {
    try {
        const token = localStorage.getItem('accessToken')
        const res = await axios.put(`${baseUrl}/api/tour/updateTours/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return res.data
    } catch (error) {
        console.error('Lỗi khi cập nhật tour:', error.response?.data || error.message)
        throw error
    }
}


export const deleteTourById = async (id) => {
    try {
        const token = localStorage.getItem('accessToken')
        const res = await axios.delete(`${baseUrl}/api/tour/deleteTours/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return res.data
    } catch (error) {
        console.error('Lỗi khi xoá tour:', error.response?.data || error.message)
        throw error
    }
}
