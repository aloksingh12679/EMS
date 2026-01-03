
import api from './api';


export const authService = {
    login : async(email,password) => {
        try{
       const response = await api.post('/auth/login', {
        email,
        password
       })

        console.log('Login response:', response.data);


       if(response.data.success) {
        localStorage.setItem('token' , response.data.token);
        localStorage.setItem('user' , JSON.parse(response.data.user));
       }

       return response.data;
        }catch(error){
        console.error('Login error:', error);
return {
    
        success: false,
        message:'Login failed. Please check your credentials.',
        error:error.message
     
}

        }
    },

    logout : () => {
        localStorage.removeItem('token');
    localStorage.removeItem('user');
    },

    getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;

    },

    isAuthenticated : () => {
        return !!localStorage.getItem('token');
    },

    getToken : () => {
        return localStorage.getItem('token');
    }
};

export default authService;