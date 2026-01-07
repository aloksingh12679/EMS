import api from './api';

export const employeeService = {
    getAllEmployees : async() => {
       try {
            const response = await api.get('/admin/employees');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    addEmployee : async(data) => {
        try{
const response = await api.post('/admin/employees' , data ,{
            headers: {
                'Content-Type': 'multipart/form-data'  // Override default
            }
        });
return response.data;

        }catch(error){
         throw error;
        }
    }
}

