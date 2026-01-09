import api from './api';

export const salaryService = {
    getEmployeesSalary : async() => {
      try {
                  const response = await api.get('/admin/employees/salary');
                  return response.data;
              } catch (error) {
                  throw error;
              }
    }





}
