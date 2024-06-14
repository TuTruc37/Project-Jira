import React, { useEffect, useState } from 'react';
import { projectMan } from '../../../services/projectMan';
import { Table, Tag, Avatar, message, Modal, List } from 'antd';
// import { AntDesignOutlined, UserOutlined } from '@ant-design/icons';
import CustomProjectModal from '../../../components/CustomProjectModal/CustomProjectModal';

const ProjectManage = () => {
  const [arrProject, setArrProject] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [userList, setUserList] = useState([]);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);

  const showModal = projectId => {
    setIsModalVisible(true);
    setEditingProjectId(projectId);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProjectId(null);
    handleGetAllProject(); // Reload the project list after closing the modal
  };

  const handleGetAllProject = () => {
    projectMan
      .getAllProject()
      .then(res => {
        setArrProject(res.data.content);
      })
      .catch(err => {
        console.error('Error fetching project list:', err);
        message.error('Error fetching project list');
      });
  };

  useEffect(() => {
    handleGetAllProject();
  }, []);

  const handleDeleteProject = projectId => {
    projectMan
      .deleteProject(projectId)
      .then(res => {
        message.success('Successfully deleted');
        handleGetAllProject();
      })
      .catch(err => {
        console.error('Error deleting project:', err);
        message.error('Failed to delete');
      });
  };

  const handleGetUsersByProjectId = projectId => {
    projectMan
      .getUserProjectId(projectId)
      .then(res => {
        setUserList(res.data.content);
        setIsUserModalVisible(true);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        message.error('Error fetching users');
      });
  };

  const handleDeleteUserFromProject = (projectId, userId) => {
    projectMan
      .deletetUserFromProject({ projectId, userId })
      .then(res => {
        message.success('Xóa người dùng thành công');
        handleGetUsersByProjectId(projectId); // Refresh the user list
      })
      .catch(err => {
        console.error('Error removing user from project:', err);
        message.error('Không thể xóa người dùng');
      });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Project',
      dataIndex: 'projectName',
      sorter: (a, b) => a.projectName.localeCompare(b.projectName),
    },
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
    },
    {
      title: 'Creator',
      dataIndex: 'creator',
      render: creator => <Tag color="#87d068">{creator.name}</Tag>,
    },
    {
      title: 'Members',
      dataIndex: 'members',
      render: (members, record) => (
        <Avatar.Group className="flex items-center space-x-1">
          {members.map(member => (
            <Avatar
              key={member.userId}
              src={member.avatar}
              style={{ backgroundColor: '#f56a00', outline: 'none' }}
            >
              {member.name.charAt(0)}
            </Avatar>
          ))}
          <i
            className="fa-solid fa-plus text-white bg-gray-400 h-6 w-6 rounded-full flex justify-center items-center cursor-pointer"
            onClick={() => handleGetUsersByProjectId(record.id)}
          />
        </Avatar.Group>
      ),
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <div className="flex">
          <button
            onClick={() => showModal(record.id)}
            className="py-2 px-4 rounded text-white bg-yellow-300 mr-3"
          >
            <i className="fa-solid fa-pen"></i>
          </button>
          <button
            className="py-2 px-4 rounded text-white bg-red-500 mr-3"
            onClick={() => handleDeleteProject(record.id)}
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="text-2xl font-bold">Project Management</div>
      <Table columns={columns} dataSource={arrProject} rowKey="id" />
      <CustomProjectModal
        visible={isModalVisible}
        onCancel={handleCancel}
        projectId={editingProjectId}
      />
      <Modal
    
        title="Thành viên"
        visible={isUserModalVisible}
        onCancel={() => setIsUserModalVisible(false)}
        footer={null}
      >
        <List className=''
          dataSource={userList}
          renderItem={item => (
            <List.Item className='flex justify-center items-center'>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={item.name}
              />
              <i
                className="fa-solid fa-trash-can px-4 py-3 text-white bg-red-500 rounded-md cursor-pointer"
                onClick={() =>
                  handleDeleteUserFromProject(editingProjectId, item.userId)
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default ProjectManage;
