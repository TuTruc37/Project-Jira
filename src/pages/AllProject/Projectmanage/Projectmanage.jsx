import React, { useEffect, useState, useCallback } from 'react';
import { Input, List, Avatar, Button, message, Modal, Table, Tag } from 'antd';
import { projectMan } from '../../../services/projectMan';
import CustomProjectModal from '../../../components/CustomProjectModal/CustomProjectModal';
import { debounce } from 'lodash';
import './projectManage.scss';

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
    handleGetAllProject(); // Tải lại danh sách dự án sau khi đóng modal
  };

  const handleGetAllProject = () => {
    projectMan
      .getAllProject()
      .then(res => {
        setArrProject(res.data.content);
      })
      .catch(err => {
        console.error('Lỗi khi tải danh sách dự án:', err);
        message.error('Lỗi khi tải danh sách dự án');
      });
  };

  useEffect(() => {
    handleGetAllProject();
  }, []);

  const handleDeleteProject = projectId => {
    projectMan
      .deleteProject(projectId)
      .then(res => {
        message.success('Xóa dự án thành công');
        handleGetAllProject();
      })
      .catch(err => {
        console.error('Lỗi khi xóa dự án:', err);
        message.error('Không thể xóa dự án');
      });
  };

  const handleGetUsersByProjectId = projectId => {
    setIsUserModalVisible(true);
    setEditingProjectId(projectId); // Đảm bảo rằng editingProjectId được thiết lập
    setUserList([]);

    projectMan
      .getUserProjectId(projectId)
      .then(res => {
        if (res.data && res.data.content) {
          setUserList(res.data.content);
        } else {
          console.error('Định dạng phản hồi không mong đợi:', res);
          message.error('Định dạng phản hồi không mong đợi');
        }
      })
      .catch(err => {
        console.error('Lỗi khi tải người dùng:', err);
        message.error('Lỗi khi tải người dùng');
      });
  };

  const handleDeleteUserFromProject = (projectId, userId) => {
    projectMan
      .removeUserFromProject({ projectId, userId })
      .then(res => {
        message.success('Xóa người dùng thành công');
        handleGetUsersByProjectId(projectId); // Cập nhật lại danh sách người dùng

        // Cập nhật arrProject để phản ánh danh sách thành viên đã cập nhật
        const updatedArrProject = arrProject.map(project => {
          if (project.id === projectId) {
            // Lọc ra người dùng bị xóa khỏi danh sách thành viên
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
        console.error('Lỗi khi xóa người dùng khỏi dự án:', err);
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
        console.error('Lỗi khi tìm kiếm người dùng:', err);
        message.error('Lỗi khi tìm kiếm người dùng');
      });
  };

  // const handleSearchUser = searchKeyword => {
  //   projectMan
  //     .searchUser(searchKeyword)
  //     .then(res => {
  //       setSearchResult(res.data.content);
  //     })
  //     .catch(err => {
  //       console.error('Lỗi khi tìm kiếm người dùng:', err);
  //       message.error('Lỗi khi tìm kiếm người dùng');
  //     });
  // };

  const debouncedSearchUser = useCallback(debounce(handleSearchUser, 300), []);

  const handleSearchChange = e => {
    const { value } = e.target;
    setSearchKeyword(value);
    debouncedSearchUser(value);
  };

  const handleAddUserToProject = userId => {
    if (!editingProjectId) {
      message.error('Chưa chọn dự án để thêm người dùng.');
      return;
    }

    projectMan
      .assignUserToProject({ projectId: editingProjectId, userId })
      .then(res => {
        message.success('Thêm người dùng thành công');
        handleGetUsersByProjectId(editingProjectId); // Cập nhật lại danh sách người dùng sau khi thêm

        // Cập nhật arrProject để phản ánh danh sách thành viên đã cập nhật
        const updatedArrProject = arrProject.map(project => {
          if (project.id === editingProjectId) {
            // Kiểm tra nếu người dùng đã tồn tại trong danh sách thành viên
            const existingUser = project.members.find(
              member => member.userId === userId
            );
            if (existingUser) {
              return project; // Người dùng đã tồn tại, không cần cập nhật
            }

            // Thêm người dùng mới vào danh sách thành viên
            return {
              ...project,
              members: [
                ...project.members,
                { userId, name: 'Thành viên mới', avatar: '' }, // Thay thế với thông tin thành viên thực nếu có
              ],
            };
          }
          return project;
        });

        setArrProject(updatedArrProject);
        setSearchKeyword('');
        setSearchResult([]);
      })
      .catch(err => {
        console.error('Lỗi khi thêm người dùng vào dự án:', err);
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
      title: 'Dự án',
      dataIndex: 'projectName',
      sorter: (a, b) => a.projectName.localeCompare(b.projectName),
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'categoryName',
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
    },
    {
      title: 'Người tạo',
      dataIndex: 'creator',
      render: creator => <Tag color="#87d068">{creator.name}</Tag>,
    },
    {
      title: 'Thành viên',
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
      title: 'Hành động',
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
      <div className="text-3xl font-bold mb-4">Quản lý dự án</div>
      <Table columns={columns} dataSource={arrProject} rowKey="id" />
      <CustomProjectModal
        visible={isModalVisible}
        onCancel={handleCancel}
        projectId={editingProjectId}
        onProjectUpdated={handleGetAllProject}
      />
      <Modal
        title="Thành viên"
        visible={isUserModalVisible}
        onCancel={() => setIsUserModalVisible(false)}
        footer={null}
      >
        <Input.Search
          placeholder="Tìm kiếm người dùng..."
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
          <h2 className="text-xl font-semibold">Người dùng trong dự án</h2>
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
