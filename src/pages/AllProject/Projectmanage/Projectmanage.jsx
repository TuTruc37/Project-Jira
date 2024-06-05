import React, { useEffect, useState } from 'react';
import { projectMan } from '../../../services/projectMan';
import { Table, Tag, Avatar } from 'antd';
import { AntDesignOutlined, UserOutlined } from '@ant-design/icons';

const Projectmanage = () => {
  const [arrProject, setArrProject] = useState([]);

  const handleGetAllProject = () => {
    projectMan
      .getAllProject()
      .then(res => {
        console.log(res.data.content);
        setArrProject(res.data.content);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleGetAllProject();
  }, []);

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
      render: members => {
        return (
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
        );
      },
    },
    {
      title: 'Chức năng',
      render: (text, record) => (
        <div className="flex">
          <button className="py-2 px-4 rounded text-white bg-yellow-300 mr-3">
            <i className="fa-solid fa-pen"></i>
          </button>
          <button className="py-2 px-4 rounded text-white bg-red-500 mr-3">
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="text-2xl font-bold">Project management</div>
      {/* table */}
      <Table columns={columns} dataSource={arrProject} rowKey="id" />
    </div>
  );
};

export default Projectmanage;
