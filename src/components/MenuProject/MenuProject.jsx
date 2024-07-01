import React from 'react';
import { NavLink } from 'react-router-dom';
import { path } from '../../common/path';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
const MenuProject = addDataUserLocal => {
  // console.log(addDataUserLocal);
  const handleRemoveUserFromLocalStorage = () => {
    localStorage.removeItem('dataUser');
  };
  return (
    <div>
      <div className="flex space-x-2">
        <Space direction="vertical" size={16}>
          <Space wrap size={16}>
            <Avatar
              size="large"
              icon={<UserOutlined />}
              src={addDataUserLocal.addDataUserLocal.avatar}
            />
          </Space>
        </Space>
        <div>
          <h2>{addDataUserLocal.addDataUserLocal.name}</h2>
          <NavLink to={path.dangNhap}>
            <h3 onClick={handleRemoveUserFromLocalStorage}>Thoát tài khoản</h3>
          </NavLink>
        </div>
      </div>
      <div className="mt-14">
        <ul className="space-y-3">
          <li>
            <NavLink to={path.account.profile}>
              <div className=" font-semibold text-lg">
                <i className="fa-solid fa-user"></i> Profile
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to={path.account.trangChu}>
              <div className=" font-semibold text-lg">
                <i className="fa-solid fa-list-check " /> Project Management
              </div>
            </NavLink>
          </li>

          <li>
            <NavLink to={path.account.createProject}>
              <div className="text-lg font-semibold">
                <i className="fa-solid fa-file-circle-plus " /> Create Project
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to={path.account.users}>
              <div className="text-lg font-semibold">
                <i className="fa-solid fa-users"></i> Users Management
              </div>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MenuProject;
