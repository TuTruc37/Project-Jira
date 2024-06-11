import React from 'react';
import { NavLink } from 'react-router-dom';
import { path } from '../../common/path';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
const MenuProject = () => {
  return (
    <div>
      <div className="flex">
        <Space direction="vertical" size={16}>
          <Space wrap size={16}>
            <Avatar size="large" icon={<UserOutlined />} />
          </Space>
        </Space>
        <div>
          <h2>CyberLearn.vn</h2>
          <h3>Report bugs</h3>
        </div>
      </div>
      <div className="mt-14">
        <ul>
          <li>
            <NavLink to={path.account.trangChu}>
              <i className="fa-solid fa-gear"></i> Project management
            </NavLink>
          </li>
          <li>
            <NavLink to={path.account.createProject}>
              <i className="fa-solid fa-gear"></i> Create management
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MenuProject;
