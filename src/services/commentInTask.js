import { http } from './config';
export const commentInTasks = {
  getAll: comment => {
    return http.get(`/Comment/getAll?taskId=${comment}`);
  },
  postInsertComment: () => {
    return http.post('/Comment/insertComment');
  },
  putComment: comment => {
    return http.put(
      `/Comment/updateComment?id=11169&contentComment=${comment}`
    );
  },
  deleteComment: deleteComment => {
    return http.delete(`/Comment/deleteComment?idComment=${deleteComment}`);
  },
};
