import React from 'react';
import { NavLink } from 'react-router-dom';
import { path } from '../../common/path';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
const MenuProject = () => {
  return (
    <div>
      <div className="flex space-x-2">
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
        <ul className='space-y-3'>
          <li className="">
            <NavLink to={path.account.trangChu}>
              <div className=" font-semibold text-lg">
                <i className="fa-solid fa-list-check " /> Project Management
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to={path.account.projectDetail}>
              <div className=' text-lg font-semibold'>
                <i className="fa-solid fa-file-lines " />  Project DeTail
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to={path.account.createProject}>
              <div className="text-lg font-semibold">
            
                <i className="fa-solid fa-file-circle-plus " />  Create Project
              </div>
            </NavLink>
          </li>
          <li
            className={
              location.pathname === path.account.trangChu ? 'active' : ''
            }
          >
            <NavLink to={path.users} onClick={() => handleClick(path.users)}>
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
