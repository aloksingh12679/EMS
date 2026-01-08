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
    },

     getDetailsbyId : async(id) => {
        try{
const response = await api.get(`/admin/employee/${id}`);
return response.data;

        }catch(error){
         throw error;
        }
    },

    getLeavesdetails : async() => {
         try{
const response = await api.get(`/admin/leaves`);
return response.data;

        }catch(error){
         throw error;
        }
    },

    updateEmployee : async(id , updatedData) => {
               try{
const response = await api.put(`/admin/employee/${id}` , updatedData ,{
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

