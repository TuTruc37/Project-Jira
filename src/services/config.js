import axios from 'axios';
export const http = axios.create({
  baseURL: 'https://jiranew.cybersoft.edu.vn/api',
  headers: {
    tokenCybersoft:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA2MSIsIkhldEhhblN0cmluZyI6IjAyLzEwLzIwMjQiLCJIZXRIYW5UaW1lIjoiMTcyNzgyNzIwMDAwMCIsIm5iZiI6MTY5ODUxMjQwMCwiZXhwIjoxNzI3OTc0ODAwfQ.s3A_pv48yJ4fiNIafAzdJdzYqv8m9mYw16Q6cq52xGg',
    Authorization:
      'Bearer ' +
      'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJ0dWFuc29mZWFyMDNAZ21haWwuY29tIiwibmJmIjoxNzE5NDEzMDM3LCJleHAiOjE3MTk0MTY2Mzd9.5BVcR1iTZsQcx2j9bxQRJNdq_8SSteCSB6fBJnQ9rQs',
  },
  timeout: 30000,
});
