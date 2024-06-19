import React, { useEffect, useState, useCallback } from 'react';
import { Input, List, Avatar, Button, message, Modal, Table, Tag } from 'antd';
import { projectMan } from '../../../services/projectMan';
import CustomProjectModal from '../../../components/CustomProjectModal/CustomProjectModal';
import { debounce } from 'lodash';

const ProjectManage = () => {
  const [arrProject, setArrProject] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [userList, setUserList] = useState([]);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

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
    setIsUserModalVisible(true);
    setEditingProjectId(projectId); // Ensure editingProjectId is set
    setUserList([]);

    projectMan
      .getUserProjectId(projectId)
      .then(res => {
        if (res.data && res.data.content) {
          setUserList(res.data.content);
        } else {
          console.error('Unexpected response format:', res);
          message.error('Unexpected response format');
        }
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        // message.error('Error fetching users');
      });
  };

  const handleDeleteUserFromProject = (projectId, userId) => {
    projectMan
      .removeUserFromProject({ projectId, userId })
      .then(res => {
        message.success('Xóa người dùng thành công');
        handleGetUsersByProjectId(projectId); // Refresh the user list

        // Update arrProject to reflect updated members list
        const updatedArrProject = arrProject.map(project => {
          if (project.id === projectId) {
            // Filter out the deleted user from members list
            const updatedMembers = project.members.filter(
              member => member.userId !== userId
            );
            return {
              ...project,
              members: updatedMembers,
            };
          }
          return project;
        });

        setArrProject(updatedArrProject);
      })
      .catch(err => {
        console.error('Error removing user from project:', err);
        message.error('Không thể xóa người dùng');
      });
  };

  const handleSearchUser = searchKeyword => {
    projectMan
      .searchUser(searchKeyword)
      .then(res => {
        setSearchResult(res.data.content);
      })
      .catch(err => {
        console.error('Error searching users:', err);
        message.error('Error searching users');
      });
  };

  const debouncedSearchUser = useCallback(debounce(handleSearchUser, 300), []);

  const handleSearchChange = e => {
    const { value } = e.target;
    setSearchKeyword(value);
    debouncedSearchUser(value);
  };

  const handleAddUserToProject = userId => {
    if (!editingProjectId) {
      message.error('No project selected for adding user.');
      return;
    }

    projectMan
      .assignUserToProject({ projectId: editingProjectId, userId })
      .then(res => {
        message.success('Thêm người dùng thành công');
        handleGetUsersByProjectId(editingProjectId); // Refresh user list after adding user

        // Update arrProject to reflect updated members list
        const updatedArrProject = arrProject.map(project => {
          if (project.id === editingProjectId) {
            // Check if user already exists in members list
            const existingUser = project.members.find(
              member => member.userId === userId
            );
            if (existingUser) {
              return project; // User already exists, no need to update
            }

            // Add new user to the members list
            return {
              ...project,
              members: [
                ...project.members,
                { userId, name: 'New Member', avatar: '' },
              ], // Replace with actual member details if available
            };
          }
          return project;
        });

        setArrProject(updatedArrProject);
        setSearchKeyword('');
        setSearchResult([]);
      })
      .catch(err => {
        console.error('Error adding user to project:', err);
        message.error('Không thể thêm người dùng');
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
      <div className="text-3xl font-bold mb-4">Project Management</div>
      <Table columns={columns} dataSource={arrProject} rowKey="id" />
      <CustomProjectModal
        visible={isModalVisible}
        onCancel={handleCancel}
        projectId={editingProjectId}
      />
      <Modal
        title="Members"
        visible={isUserModalVisible}
        onCancel={() => setIsUserModalVisible(false)}
        footer={null}
      >
        <Input.Search
          placeholder="Search users..."
          value={searchKeyword}
          onChange={handleSearchChange}
          onSearch={handleSearchUser}
          style={{ marginBottom: 16 }}
        />
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <List
            dataSource={searchResult}
            renderItem={item => (
              <List.Item
                actions={[
                  <Button
                    type="primary"
                    onClick={() => handleAddUserToProject(item.userId)}
                  >
                    <i className="fa-solid fa-user-plus" />
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={item.name}
                  description={item.email}
                />
              </List.Item>
            )}
          />
        </div>
        <div
          style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '16px' }}
        >
          <h2 className="text-xl font-semibold">Users</h2>
          <List
            dataSource={userList}
            renderItem={item => (
              <List.Item className="flex justify-center items-center">
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={item.name}
                />
                <div className="space-x-2">
                  <i
                    className="fa-solid fa-trash-can px-4 py-3 text-white bg-red-500 rounded-md cursor-pointer"
                    onClick={() =>
                      handleDeleteUserFromProject(editingProjectId, item.userId)
                    }
                  />
                </div>
              </List.Item>
            )}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ProjectManage;
