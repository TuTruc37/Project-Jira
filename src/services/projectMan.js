// projectMan.js
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
  updateProject: (projectId, projectDetails) => {
    console.log(projectId);
    console.log(projectDetails);
    // Loc nhung key can thiet
    let obj = {
      id: projectId,
      projectName: projectDetails.projectName,
      creator: projectDetails.creator,
      description: projectDetails.description,
      categoryId: projectDetails?.projectCategory?.key
        ? projectDetails?.projectCategory?.key
        : projectDetails?.projectCategory?.id,
    };
    return http.put(`/Project/updateProject?projectId=${projectId}`, obj);
  },
  getUserProjectId: projectId => {
    return http.get(`/Users/getUserByProjectId?idProject=${projectId}`);
  },
  getProjectCategory: () => {
    return http.get('/ProjectCategory');
  },
  removeUserFromProject: data => {
    return http.post('/Project/removeUserFromProject', data);
  },
  assignUserToProject: data => {
    return http.post('/Project/assignUserProject', data);
  },
  searchUser: keyword => {
    return http.get(`/Users/getUser?keyword=${keyword}`);
  },
  createProjectAuthorize: data => {
    return http.post('/Project/createProjectAuthorize', data);
  },
};
