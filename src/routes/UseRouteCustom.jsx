// import React from 'react';
import { useRoutes } from 'react-router-dom';
import { path } from '../common/path';
import Login from '../pages/LoginAndRegister/Login';
import Register from '../pages/LoginAndRegister/Register';
import NotFound from '../pages/NotFound/NotFound';
import HomeTemplates from '../templates/HomeTemplates/HomeTemplates';
import ProjectManage from '../pages/AllProject/ProjectManage/ProjectManage';
import CreateManager from '../pages/AllProject/CreateManage/CreateManager';
import CreateTask from '../pages/CreateTask/CreateTask';
import ProjectDetail from '../pages/ProjectDetail/ProjectDetail';
// import EditProjectManager from '../pages/AllProject/EditProjectManager/EditProjectManager';
import UserManage from '../pages/AllProject/UserManage/UserManage';
import Profile from '../pages/Profile/Profile';

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
          element: <CreateManager />,
        },
        {
          path: `${path.account.createTask}/:projectId`,
          element: <CreateTask />,
        },
        // {
        //   path: path.account.createTask,
        //   element: <CreateTask />,
        // },
        {
          path: `${path.account.projectDetail}/:projectId`, // Update this line
          element: <ProjectDetail />,
        },
        {
          path: path.account.projectDetail, // Update this line
          element: <ProjectDetail />,
        },
        // {
        //   path: path.account.editTask,
        //   element: <EditProjectManager/>,
        // },
        {
          path: path.account.users,
          element: <UserManage />,
        },
        {
          path: path.account.profile,
          element: <Profile />,
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
