import React, { useEffect, useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { path } from '../../common/path';
import { handleGetValueLocalStore } from '../../utils/utils';
import MenuProject from '../../components/MenuProject/MenuProject';
const { Content, Sider } = Layout;
const arrMenu = [
  {
    label: <Link>Create Task</Link>,
    icon: <i className="fa-solid fa-plus"></i>,
  },
  {
    label: <Link>Search</Link>,
    icon: <i className="fa-solid fa-magnifying-glass"></i>,
  },
];
const HomeTemplates = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // useEffect(() => {
  //   // lấy dữ liệu từ local lên để kiểm tra
  //   // Nếu như localStore không có dữ liệu ==> Đá mông người dùng đi mất
  //   // Nếu như có dữ liệu và maLoaiNguoiDung không đúng ==> Đá mông người dùng đi mất
  //   const dataUser = handleGetValueLocalStore('dataUser');
  //   if (!dataUser) {
  //     window.location.href = 'https://google.com';
  //   } else {
  //     if (dataUser.maLoaiNguoiDung !== 'QuanTri') {
  //       window.location.href = 'https://google.com';
  //     }
  //   }
  //   // return () => {

  //   // }
  // }, []);

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={value => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={arrMenu}
        />
      </Sider>
      <Layout>
        {/* header */}
        <Content
          style={{
            // margin: '0 16px',
            display: 'flex',
          }}
        >
          <div
            style={{
              padding: 24,
              width: '17%',
            }}
          >
            <MenuProject />
          </div>
          <div
            style={{
              padding: 24,
              width: '83%',
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomeTemplates;
