import { http } from './config';
export const projectMan = {
  getAllProject: () => {
    return http.get('/Project/getAllProject');
  },
};
