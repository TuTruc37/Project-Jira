import { http } from './config';

export const getAllCreateTask = {
  getAllStatus: () => {
    return http.get('/Status/getAll');
  },
  getAllPriority: () => {
    return http.get('/Priority/getAll?id=0');
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
  postAssignUserTask: data => {
    return http.post('/Project/assignUserTask', data);
  },
  getUserByProject: projectId => {
    return http.get(`/Users/getUserByProject/${projectId}`);
  },
  getTaskDetails: taskId => {
    return http.get(`/Project/getTaskDetail?taskId=${taskId}`);
  },
  postUpdateTask: data => {
    return http.post(`/Project/updateTask/${data.taskId}`, data);
  },
  getProjectDetails: projectId => {
    return http.get(`Project/getProjectDetail?id=${projectId}`);
  },
  deleteTask: taskId => {
    return http.delete(`Project/removeTask?taskId=${taskId}`);
  }

  // Other methods as per your requirements
};
