import React, { useEffect, useState } from 'react';
import { projectMan } from '../../../services/projectMan';
import { Table, Tag, Avatar, message } from 'antd';
import CustomProjectModal from '../../../components/CustomProjectModal/CustomProjectModal';

const ProjectManage = () => {
  const [arrProject, setArrProject] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);

  const showModal = projectId => {
    console.log('show modal', projectId);
    setIsModalVisible(true);
    setEditingProjectId(projectId);
  };

  const handleCancel = () => {
    console.log('Cancel modal');
    setIsModalVisible(false);
    setEditingProjectId(null);
  };

  const handleGetAllProject = () => {
    projectMan
      .getAllProject()
      .then(res => {
        console.log('Projects fetched:', res.data.content);
        setArrProject(res.data.content);
      })
      .catch(err => {
        console.log('Error fetching projects:', err);
      });
  };

  useEffect(() => {
    handleGetAllProject();
  }, []);

  const handleDeleteProject = projectId => {
    projectMan
      .deleteProject(projectId)
      .then(res => {
        message.success('Xóa thành công');
        handleGetAllProject();
      })
      .catch(err => {
        console.log('Error deleting project:', err);
        message.error('Xóa không thành công !');
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
      render: members => (
        <Avatar.Group>
          {members.map(member => (
            <Avatar
              key={member.userId}
              src={member.avatar}
              style={{ backgroundColor: '#f56a00' }}
            >
              {member.name.charAt(0)}
            </Avatar>
          ))}
        </Avatar.Group>
      ),
    },
    {
      title: 'Chức năng',
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
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="text-2xl font-bold">Project management</div>
      <Table columns={columns} dataSource={arrProject} rowKey="id" />
      <CustomProjectModal
        visible={isModalVisible}
        onCancel={handleCancel}
        projectId={editingProjectId}
      />
    </div>
  );
};

export default ProjectManage;
