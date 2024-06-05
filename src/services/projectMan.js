import { http } from './config';
export const projectMan = {
  getAllProject: () => {
    return http.get('/Project/getAllProject');
  },
  deleteProject: projectId => {
    return http.delete(`/api/Project/deleteProject?projectId=${projectId}`);
  },
  getProjectDetails: projectId => {
    return http.get(`/api/Project/getProjectDetails?projectId=${projectId}`);
  },
  updateProjectDetails: projectId => {
    return http.put(`/api/Project/updateProjectDetails?projectId=${projectId}`);
  },
};
