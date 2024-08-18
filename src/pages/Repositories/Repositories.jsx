import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  message,
  Modal,
  Avatar,
  Input,
  List,
  Tag,
  Space,
  Select,
  Empty,
  Spin,
} from 'antd';
import { projectMan } from '../../services/projectMan';
import CustomProjectModal from '../../components/CustomProjectModal/CustomProjectModal';
import { debounce } from 'lodash';
import { path } from '../../common/path';
import { NavLink } from 'react-router-dom'; // Thay đổi từ Link sang NavLink
// import './projectManage.scss';
import { handleGetValueLocalStore } from '../../utils/utils';
import Loader from '../../components/Loader/Loader';

const Repositories = () => {
  // loading
  //làm spin để load dữ liệu thì biết là có dữ liệu và nó đang tải lên chứ không phải trống không
  const [isLoading, setIsLoading] = useState(true);
  console.log(isLoading);
  const customSpin = (
    <div>
      <Spin size="large" />
      <div>Loading...</div>
    </div>
  );
  //
  const [arrProject, setArrProject] = useState([]);
  console.log(arrProject);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  console.log(editingProjectId); // id đang truy cập và sửa
  const [userList, setUserList] = useState([]);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  // search dự án
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedProjects, setSearchedProjects] = useState([]);
  // button dự án cá nhân
  const dataUsers = handleGetValueLocalStore('dataUser');
  const [personalProjects, setPersonalProjects] = useState([]);
  console.log(personalProjects);
  useEffect(() => {
    DuAnCaNhan();
  }, [arrProject]);
  // search dự án
  const handleSearchTermChange = event => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const filteredProjects = personalProjects.filter(project =>
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchedProjects(filteredProjects);
  }, [searchTerm, personalProjects]);
  //

  const showModal = projectId => {
    setIsModalVisible(true);
    setEditingProjectId(projectId);
    handleGetAllProject();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProjectId(null);
    handleGetAllProject();
  };

  const handleGetAllProject = () => {
    projectMan
      .getAllProject()
      .then(res => {
        setArrProject(res.data.content);
        // console.log(res.data.content);// danh sách dự án
        setIsLoading(false);
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
    setEditingProjectId(projectId);
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
      });
  };

  const handleDeleteUserFromProject = (projectId, userId) => {
    projectMan
      .removeUserFromProject({ projectId, userId })
      .then(res => {
        message.success('Xóa người dùng thành công');
        handleGetUsersByProjectId(projectId);

        const updatedArrProject = arrProject.map(project => {
          if (project.id === projectId) {
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

  const debouncedSearchUser = debounce(handleSearchUser, 300);

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
        handleGetUsersByProjectId(editingProjectId);

        const updatedArrProject = arrProject.map(project => {
          if (project.id === editingProjectId) {
            const existingUser = project.members.find(
              member => member.userId === userId
            );
            if (existingUser) {
              return project;
            }

            return {
              ...project,
              members: [
                ...project.members,
                { userId, name: 'Thành viên mới', avatar: '' },
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
      // sorter: (a, b) => a.id - b.id,
      sorter: (a, b) => b.id - a.id, // Sắp xếp theo thứ tự giảm dần của id
    },
    {
      title: 'Dự án',
      dataIndex: 'projectName',
      render: (text, record) => (
        <NavLink to={`${path.account.projectDetail}/${record.id}`}>
          {text}
        </NavLink>
      ),
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
  // button dự án cá nhân

  const DuAnCaNhan = () => {
    // console.log(arrProject);
    const projectsWithMatchingCreators = arrProject.filter(project => {
      const creatorName = project.creator.name;
      const userName = dataUsers.name;
      return creatorName === userName;
    });

    setPersonalProjects(projectsWithMatchingCreators);
  };
  // select
  const handleChange = value => {
    const filteredProjects = personalProjects.filter(
      project => project.categoryName === value
    );
    setSearchedProjects(filteredProjects);
  };
  const sortedProjects = personalProjects.sort((a, b) => b.id - a.id);
  return (
    <>
      <div>
        <div className="text-3xl font-bold mb-4">Kho lưu trữ</div>
        <div className="flex justify-center items-center">
          {/* select  */}
          <Space wrap style={{ padding: '0px 10px 16px 0px' }}>
            <Select
              defaultValue="Lựa chọn tên danh mục"
              style={{
                width: 200,
              }}
              onChange={handleChange}
              options={[
                {
                  value: 'all',
                  label: 'All',
                },
                {
                  value: 'Dự án web',
                  label: 'Dự án web',
                },
                {
                  value: 'Dự án phần mềm',
                  label: 'Dự án phần mềm',
                },
                {
                  value: 'Dự án di động',
                  label: 'Dự án di động',
                },
              ]}
            />
          </Space>
          {/* Search dự án */}
          <Input.Search
            placeholder="Tìm kiếm dự án..."
            onChange={handleSearchTermChange}
            style={{ marginBottom: 16 }}
          />
        </div>
        {/* {personalProjects.length > 0 && ( */}
        <Table
          columns={columns}
          dataSource={
            searchedProjects.length > 0 ? searchedProjects : sortedProjects
          }
          rowKey="id"
          locale={{
            emptyText:
              arrProject.length > 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <Empty image={customSpin} description={null} />
              ),
          }}
        />
        {/* )} */}
        {/*  */}
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
            style={{
              maxHeight: '400px',
              overflowY: 'auto',
              marginTop: '16px',
            }}
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
                        handleDeleteUserFromProject(
                          editingProjectId,
                          item.userId
                        )
                      }
                    />
                  </div>
                </List.Item>
              )}
            />
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Repositories;
