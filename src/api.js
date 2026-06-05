import axios from "axios";


const api = axios.create({
	baseURL: import.meta.env.ECOMMERCE_WORKFLOW_MANAGEMENT_API
});

api.interceptors.request.use((config) => {

	const token = localStorage.getItem("token");

	if (token) {

		config.headers.Authorization = `Bearer ${token}`;
	}

	return config
});

api.orders = {
  all: async () => {
    const { data } = await api.get('/orders/all-orders')
    return data.orders ?? []
  },
  my: async () => {
    const { data } = await api.get('/orders/my-orders')
    return data.orders ?? []
  },
  updateStatus: async (id, status) => {
    const { data } = await api.patch(`/orders/${id}/status`, { status })
    return data
  }
}
export default api;