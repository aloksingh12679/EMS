
import api from './api';


export const authService = {
    login : async(email,password,employeeId , role) => {
        
      
            
            const response = await api.post('/auth/login', {
                email,
                password,
                employeeId,
                role
            });

            if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;

      
      
   },
   register: async (form) => {
  const response = await api.post('/auth/register', {form});

//   if (response.data.success) {
//     if (response.data.token) {
//       localStorage.setItem('token', response.data.token);
//     }
//     if (response.data.user) {
//       localStorage.setItem('user', JSON.stringify(response.data.user));
//     }
//   }

  return response.data;
},


    logout : () => {
        localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href= "/";
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