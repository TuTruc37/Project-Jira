import React, { useEffect, useState } from 'react';
import { Layout, Menu, theme, Modal } from 'antd';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { path } from '../../common/path';
import { handleGetValueLocalStore } from '../../utils/utils';
import MenuProject from '../../components/MenuProject/MenuProject';

const { Content, Sider } = Layout;
const arrMenu = [
  {
    label: <NavLink to={path.account.createTask}>Create Task</NavLink>,
    icon: <i className="fa-solid fa-plus"></i>,
  },
  {
    label: <Link to={path.search}>Search</Link>,
    icon: <i className="fa-solid fa-magnifying-glass"></i>,
  },
];

const HomeTemplates = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [addDataUser, setAddDataUser] = useState(null);
  console.log(addDataUser);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [redirectPath, setRedirectPath] = useState('');

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const dataUser = handleGetValueLocalStore('dataUser');
    if (!dataUser) {
      setIsModalVisible(true);
    } else {
      setAddDataUser(dataUser);
    }
  }, []);

  useEffect(() => {
    if (redirectPath) {
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 1000); // Chờ 3 giây trước khi chuyển hướng
    }
  }, [redirectPath]);

  const handleOk = () => {
    setIsModalVisible(false);
    setRedirectPath(path.dangKy);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setRedirectPath(path.dangNhap);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
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
        <Content style={{ display: 'flex' }}>
          <div style={{ padding: 24, width: '17%' }}>
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
      <Modal
        className=""
        centered
        title="Vui lòng đăng nhập để trải nghiệm đầy đủ tính năng"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Đăng ký"
        cancelText="Đăng nhập"
      ></Modal>
    </Layout>
  );
};
export default HomeTemplates;
