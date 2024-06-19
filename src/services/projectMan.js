import { http } from './config';

export const projectMan = {
  getAllProject: () => {
    return http.get('/Project/getAllProject');
  },
  deleteProject: (projectId) => {
    return http.delete(`/Project/deleteProject?projectId=${projectId}`);
  },
  getProjectDetails: (projectId) => {
    return http.get(`/Project/getProjectDetail?id=${projectId}`);
  },
  updateProject: (projectId, projectDetails) => {
    return http.put(`/Project/updateProject?projectId=${projectId}`, projectDetails);
  },
  getUserProjectId: (projectId) => {
    return http.get(`/Users/getUserByProjectId?idProject=${projectId}`);
  },
  getProjectCategory: () => {
    return http.get('/ProjectCategory');
  },
  removeUserFromProject: (data) => {
    return http.post('/Project/removeUserFromProject', data);
  },
  assignUserToProject: (data) => {
    return http.post('/Project/assignUserProject', data);
  },
  searchUser: (keyword) => {
    return http.get(`/Users/getUser?keyword=${keyword}`);
  },
};
