import React from 'react';
import { useRoutes } from 'react-router-dom';
import { path } from '../common/path';
const useRouteCustom = () => {
  const route = useRoutes([
    {
      path: path.trangChu,
    },
  ]);
  return route;
};

export default useRouteCustom;
