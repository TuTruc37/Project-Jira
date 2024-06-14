import { http } from './config';
export const getAllCreateTask = {
  getAllStatus: () => {
    return http.get('/Status/getAll');
  },
  getAllPriority: () => {
    // console.log(priorityId);
    return http.get(`/Priority/getAll?id=0`);
  },
  getAllTaskType: () => {
    return http.get('/TaskType/getAll');
  },
  getAllUsers: () => {
    return http.get('/Users/getUser');
  },
  getAllProject: () => {
    return http.get('/Project/getAllProject');
  },
  postCreateTask: data => {
    return http.post('/Project/createTask', data);
  },
  postAssignUserTask: () => {
    return http.post('Project/assignUserProject');
  },
};
