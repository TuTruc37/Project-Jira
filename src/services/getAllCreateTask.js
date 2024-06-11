import { http } from './config';
export const getAllCreateTask = {
  getAllStatus: () => {
    return http.get('/Status/getAll');
  },
  getAllPriority: priorityId => {
    console.log(priorityId);
    return http.get(`/Priority/getAll?id=${priorityId}`);
  },
};
