import axios from 'axios';
import { handleGetValueLocalStore } from '../utils/utils';

const dataUser = handleGetValueLocalStore('dataUser');
// console.log(dataUser); // vấn đề là lúc đầu nó là null hoặc giữ lại data cũ mới đăng nhập trước đó thôi khi reset lại trang
let accessToken =
  'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJudWZhQG1haWxpbmF0b3IuY29tIiwibmJmIjoxNzIzMDQzMDY5LCJleHAiOjE3MjMwNDY2Njl9.EBivZelr82bDtwlmUY04HP8bggqxYRx4kJ5EHbf3jNg'; // Token mặc định
// console.log(accessToken, 'data cũ là tuấn'); // để duy trì các hoạt động của trang web

if (dataUser && dataUser.accessToken) {
  accessToken = dataUser.accessToken;
  // console.log(accessToken, 'data mới'); // token được tạo dự án theo tài khoản đã đăng nhập nhưng phải reset trang mới có dữ liệu
}

export const http = axios.create({
  baseURL: 'https://jiranew.cybersoft.edu.vn/api',
  headers: {
    tokenCybersoft:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA2MSIsIkhldEhhblN0cmluZyI6IjA3LzEwLzIwMjQiLCJIZXRIYW5UaW1lIjoiMTcyODI1OTIwMDAwMCIsIm5iZiI6MTY5ODUxMjQwMCwiZXhwIjoxNzI4NDA2ODAwfQ.SQTYsMRTWBFJDbt4U59qJzAJXaFEdPSIUv3dFj73h1M',
    Authorization: `Bearer ${accessToken}`,
  },
  timeout: 30000,
});
