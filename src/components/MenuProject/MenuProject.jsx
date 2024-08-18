import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { path } from '../../common/path';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space, Menu } from 'antd';
import './menuProject.scss';
import { add } from 'lodash';
const { SubMenu } = Menu;

const MenuProject = ({ addDataUserLocal }) => {
  const location = useLocation();
  console.log(addDataUserLocal);
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
              src={`https://ui-avatars.com/api/?name=${addDataUserLocal.name}`}
            />
          </Space>
        </Space>
        <div>
          <h2 className="font-semibold">{addDataUserLocal.name}</h2>
          <NavLink to={path.dangNhap}>
            <h3 onClick={handleRemoveUserFromLocalStorage}>Thoát tài khoản</h3>
          </NavLink>
        </div>
      </div>
      <div className="mt-14">
        <Menu
          className="menu-project "
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          selectedKeys={[location.pathname]}
          style={{ borderRight: 0, background: 'none', border: 'none' }}
        >
          <Menu.Item
            style={{ background: 'none' }}
            className=""
            key={path.account.profile}
          >
            <NavLink to={path.account.profile}>
              <span className="font-semibold text-lg">
                <i className="fa-solid fa-user"></i> Profile
              </span>
            </NavLink>
          </Menu.Item>
          {/* menu repositories */}
          <Menu.Item
            style={{ background: 'none' }}
            className=""
            key={path.account.repositories}
          >
            <NavLink to={path.account.repositories}>
              <div className=" font-semibold text-lg">
                <i className="fa-solid fa-clipboard-user"></i> Repositories
              </div>
            </NavLink>
          </Menu.Item>
          {/*  */}
          <Menu.Item key={path.account.trangChu}>
            <NavLink to={path.account.trangChu}>
              <span className="font-semibold   text-lg">
                <i className="fa-solid fa-list-check project-icon"></i> Project
                Management
              </span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key={path.account.createProject}>
            <NavLink to={path.account.createProject}>
              <span className="text-lg font-semibold">
                <i className="fa-solid fa-file-circle-plus"></i> Create Project
              </span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key={path.account.users}>
            <NavLink to={path.account.users}>
              <span className="text-lg font-semibold">
                <i className="fa-solid fa-users"></i> Users Management
              </span>
            </NavLink>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default MenuProject;
