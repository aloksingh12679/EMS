import api from './api';

export const employeeService = {
    getAllEmployees : async() => {
       try {
            const response = await api.get('/admin/employees');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}