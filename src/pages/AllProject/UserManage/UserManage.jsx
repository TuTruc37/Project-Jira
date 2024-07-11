import { useEffect, useState } from 'react';
import { Button, Table, Modal, message, Input, Typography } from 'antd';
import Swal from 'sweetalert2';
import { users } from '../../../services/users';

const UserManage = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [dataUsers, setDataUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [search, setSearch] = useState('');
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    users
      .getUsers()
      .then(res => {
        setDataUsers(res.data.content);
      })
      .catch(err => {
        console.log(err);
        message.error('Lỗi khi lấy danh sách người dùng');
      });
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      width: '5%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text, record) => (
        <div className="flex space-x-3">
          <Button
            onClick={() => handleEditUser(record)}
            type="primary"
            className="bg-info-400 text-white"
          >
            <i className="fa-solid fa-user-pen" />
          </Button>
          <Button
            onClick={() => deleteUser(record)}
            type="secondary"
            className="bg-red-400 text-white hover:bg-red-600"
          >
   <i className="fa-solid fa-trash-can" />

          </Button>
        </div>
      ),
    },
  ];

  let dataSource = [];
  dataUsers.map((user, index) => {
    dataSource.push({
      key: index + 1,
      id: user.userId,
      email: user.email,
      name: user.name,
      phone: user.phoneNumber,
    });
  });

  const handleEditUser = record => {
    setIsOpenModal(true);
    setCurrentUser(record);

    setEmail(record.email);
    setName(record.name);
    setPhone(record.phone);
  };

  useEffect(() => {
    if (currentUser) {
      console.log(currentUser);
      setEmail(currentUser.email);
      setName(currentUser.name);
      setPhone(currentUser.phone);
    }
  }, [currentUser]);

  const saveDataUser = () => {
    let payload = {
      id: currentUser.id,
      email: email != '' ? email : currentUser.email,
      name: name != '' ? name : currentUser.name,
      phoneNumber: phone != '' ? phone : currentUser.phone,
    };

    if (name.length == 0) {
      message.error("Tên không được để trống!");
    } else {
      if (isValid) {
        users.editUser(payload)
        .then(res => {
          if (res.data.statusCode == 200) {
            message.success("Cập nhật thành công!");
            fetchUsers();
            setIsOpenModal(false)
          } else {
            message.error('Error!');
          }
        })
      }
    }
  }

  const deleteUser = record => {
  
    Swal.fire({
      title: 'Bạn muốn xóa người dùng này không?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then(result => {
      if (result.isConfirmed) {
        users.deleteUser(record.id).then(() => {
          message.success("Xóa người dùng thành công!");
          fetchUsers();
        }).catch(err => {
          if (err.response && err.response.status === 400) {
            message.error(err.response.data.content)
          } else {
            message.error('Error!')
          }
        })
      }
    });
  }

  const checkPhoneValid = (e) => {
    const phoneRegex = /^(032|033|034|035|036|037|038|039|086|070|076|077|078|079|089|081|082|083|084|085|088|056|058|059|087)\d{7}$/;

    const value = e.target.value;
    setPhone(value);
    setIsValid(phoneRegex.test(value));
  }

  dataSource = dataSource.filter(item =>
    Object.values(item).some(value =>
      value?.toString()?.toLowerCase()?.includes(search.toLowerCase())
    )
  )

  return (
    <>
      <Input type="text" onChange={(e) => setSearch(e.target.value)} className="flex justify-end mb-5 w-1/4" size="medium" placeholder="Full name..." />

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          showQuickJumper: false,
          size: 'small',
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
          showTotal: total => {
            return `Total: ${total}`;
          },
        }}
      />

      <Modal
        title="Edit user"
        open={isOpenModal}
        onOk={() => saveDataUser()}
        onCancel={() => setIsOpenModal(false)}
      >
        <Typography.Title level={5}>Email</Typography.Title>
        <Input
          type="email"
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          value={email}
          disabled
        />

        <Typography.Title level={5}>Name</Typography.Title>
        <Input
          type="text"
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          value={name}
        />

        <Typography.Title level={5}>Phone</Typography.Title>
        <Input
          type="phone"
          onChange={e => checkPhoneValid(e)}
          placeholder="Phone"
          value={phone}
          style={{
            borderColor: isValid ? 'initial' : 'bg-red-400',
            outline: isValid ? 'initial' : 'bg-red-400',
          }}
        />
        {!isValid && <p style={{ color: 'red' }}>Số điện thoại không hợp lệ. Phải bắt đầu bằng 03, 05, 07, 08, 09, hoặc +84 và có 10 ký tự.</p>}
      </Modal>
    </>
  );
};

export default UserManage;
