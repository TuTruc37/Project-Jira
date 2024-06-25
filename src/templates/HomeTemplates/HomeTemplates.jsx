import React, { useEffect, useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { path } from '../../common/path';
import { handleGetValueLocalStore } from '../../utils/utils';
import MenuProject from '../../components/MenuProject/MenuProject';
const { Content, Sider } = Layout;
const arrMenu = [
  {
    label: (
      <NavLink NavLink path={path.account.createTask}>
        Create Task
      </NavLink>
    ),
    icon: <i className="fa-solid fa-plus"></i>,
  },
  {
    label: <Link>Search</Link>,
    icon: <i className="fa-solid fa-magnifying-glass"></i>,
  },
];
const HomeTemplates = () => {
  const [collapsed, setCollapsed] = useState(false);
  // Lấy dữ liệu ở dataUser lúc đăng ký và khi đăng nhập sẽ hiện lên
  const [addDataUser, setAddDataUser] = useState(null);
  // console.log(addDataUser.accessToken);
  //
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const dataUser = handleGetValueLocalStore('dataUser');
    console.log(dataUser);
    if (!dataUser) {
      window.location.href = path.dangNhap;
    } else {
      setAddDataUser(dataUser);
    }

    // return () => {

    // }
  }, []);

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
            {addDataUser && <MenuProject addDataUserLocal={addDataUser} />}
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
