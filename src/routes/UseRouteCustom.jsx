import React from 'react';
import { useRoutes } from 'react-router-dom';
import { path } from '../common/path';
import Login from '../pages/LoginAndRegister/Login';
import Register from '../pages/LoginAndRegister/Register';
import NotFound from '../pages/NotFound/NotFound';
import HomeTemplates from '../templates/HomeTemplates/HomeTemplates';
import ProjectManage from '../pages/AllProject/ProjectManage/ProjectManage';
import Createmanager from '../pages/AllProject/CreateManage/CreateManager';
import CreateTask from '../pages/CreateTask/CreateTask';
import ProjectDetail from '../pages/ProjectDetail/ProjectDetail';

const useRouteCustom = () => {
  const route = useRoutes([
    {
      path: path.account.trangChu,
      element: <HomeTemplates />,
      children: [
        {
          index: true,
          element: <ProjectManage />,
        },
        {
          path: path.account.createProject,
          element: <Createmanager />,
        },
        {
          path: path.account.createTask,
          element: <CreateTask />,
        },
        {
          path: path.account.projectdetail,
          element: <ProjectDetail />,
        },
      ],
    },

    {
      path: path.dangNhap,
      element: <Login />,
    },
    {
      path: path.dangKy,
      element: <Register />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);
  return route;
};

export default useRouteCustom;
