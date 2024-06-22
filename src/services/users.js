import { http } from './config';

export const users = {
  dangNhap: data => {
    console.log(data);
    return http.post('/Users/signin', data);
  },
  dangKy: data => {
    console.log(data);
    return http.post('/Users/signup', data);
  },
  getUsers: () => {
    return http.get('/Users/getUser');
  },
  editUser: (data) => {
    return http.put(`/Users/editUser`, data);
  },
  deleteUser: id => {
    return http.delete(`/Users/deleteUser?id=${id}`);
  },
};
