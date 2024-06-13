import { http } from './config';

export const projectMan = {
  getAllProject: () => {
    return http.get('/Project/getAllProject');
  },
  createProjectAuthorize: data => {
    console.log('API request data:', data);
    return http.post('/Project/createProjectAuthorize', data);
  },
};
