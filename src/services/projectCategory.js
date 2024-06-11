import { http } from './config';
export const projectCategory = {
  GetProjectCategory: () => {
    return http.get('/ProjectCategory');
  },
};
