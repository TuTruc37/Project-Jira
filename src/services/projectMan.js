import { http } from './config';


export const projectMan = {
  getAllProject: () => {
    return http.get('/Project/getAllProject');
  },
  deleteProject: projectId => {
    return http.delete(`/Project/deleteProject?projectId=${projectId}`);
  },
  getProjectDetails: projectId => {
    return http.get(`/Project/getProjectDetail?id=${projectId}`);
  },
  updateProjectDetails: (projectId, projectDetails) => {
    return http.put(
      `/Project/updateProjectDetails?projectId=${projectId}`,
      projectDetails
    );
  },
  getUserProjectId: projectId => {
    return http.get(`/Users/getUserByProjectId?idProject=${projectId}`);
  },
  getProjectCategory: () => {
    return http.get('/ProjectCategory');
  },
  deletetUserFromProject: () => {
    return http.post('/Project/removeUserFromProject');
  },
  createProjectAuthorize: data => {
    return http.post('/Project/createProjectAuthorize', data);
  },
};
