import React from 'react';
import { useRoutes } from 'react-router-dom';
import { path } from '../common/path';
import Login from '../pages/LoginAndRegister/Login';
import Register from '../pages/LoginAndRegister/Register';
import NotFound from '../pages/NotFound/NotFound';
import HomeTemplates from '../templates/HomeTemplates/HomeTemplates';

import Createmanager from '../pages/AllProject/CreateManage/CreateManager';
import ProjectManage from '../pages/AllProject/Projectmanage/Projectmanage';
import UserManage from '../pages/AllProject/UserManage/UserManage';
// import EditProjectManager from '../pages/AllProject/EditProjectManager/EditProjectManager';

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
          path: path.users,
          element: <UserManage />,
        },
      ],
    },
    // {
    //   path: path.edit(":projectId"),
    //   element: <EditProjectManager />,
    // },
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
