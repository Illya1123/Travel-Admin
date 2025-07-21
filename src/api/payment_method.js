import axios from 'axios'

const baseUrl = import.meta.env.VITE_BACKEND


export const getAllPaymentMethods = async () => {
    const response = await axios.get(`${baseUrl}/api/payment-method`)
    return response.data
}

export const updatePaymentMethodStatus = async (name, disabled) => {
    const token = localStorage.getItem('accessToken')
    const response = await axios.put(
        `${baseUrl}/api/payment-method/${name}`,
        { disabled },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
    return response.data
}