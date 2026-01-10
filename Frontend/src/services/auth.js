
import api from './api';


export const authService = {
    login : async(email,password,employeeId) => {
        
      
            
            const response = await api.post('/auth/login', {
                email,
                password,
                employeeId
            });

            if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;

      
      
   },

    logout : () => {
        localStorage.removeItem('token');
    localStorage.removeItem('user');
    },

    getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;

    },

    getToken : () => {
        return localStorage.getItem('token');
    },

    
};

export default authService;