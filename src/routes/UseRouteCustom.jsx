import React from 'react';
import { useRoutes } from 'react-router-dom';
import { path } from '../common/path';
import Login from '../pages/LoginAndRegister/Login';
import Register from '../pages/LoginAndRegister/Register';
import NotFound from '../pages/NotFound/NotFound';
import HomeTemplates from '../templates/HomeTemplates/HomeTemplates';
import Projectmanage from '../pages/AllProject/Projectmanage/Projectmanage';
import CreateManager from '../pages/AllProject/CreateManage/CreateManager';
import CreateTask from '../pages/CreateTask/CreateTask';
import ProjectDetail from '../pages/ProjectDetail/ProjectDetail';
import EditProjectManager from '../pages/AllProject/EditProjectManager/EditProjectManager';
import UserManage from '../pages/AllProject/UserManage/UserManage';

const useRouteCustom = () => {
  const route = useRoutes([
    {
      path: path.account.trangChu,
      element: <HomeTemplates />,
      children: [
        {
          index: true,
          element: <Projectmanage />,
        },
        {
          path: path.account.createProject,
          element: <CreateManager />,
        },
        {
          path: path.account.createTask,
          element: <CreateTask />,
        },
        {
          path: `${path.account.projectDetail}/:projectId`, // Update this line
          element: <ProjectDetail />,
        },
        {
          path: path.account.projectDetail, // Update this line
          element: <ProjectDetail />,
        },
        {
          path: path.account.editTask,
          element: <EditProjectManager />,
        },
        {
          path: path.account.users,
          element: <UserManage />,
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
