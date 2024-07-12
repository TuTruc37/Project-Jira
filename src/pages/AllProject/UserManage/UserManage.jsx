import { useEffect, useState } from 'react';
import { Button, Table, Modal, message, Input, Typography, ConfigProvider } from 'antd';
import Swal from 'sweetalert2';
import { users } from '../../../services/users';
import viVN from 'antd/lib/locale/vi_VN';

const UserManage = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [dataUsers, setDataUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [search, setSearch] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isNew, setIsNew] = useState(true);



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
      title: 'Tên Người Dùng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Chức Năng',
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

  const NewOrEdit = () => {
    if (isNew) {
      newUser();
    } else {
      saveDataUser();
    }
  }



  const newUser = async () => {
    const checkmail = dataUsers.filter(
      item => item.email = email
    );
    if (checkmail.length) {
      message.error("Email đã tồn tại!");
      return;
    }

    try {
      await users.dangKy({
        email: email,
        passWord: password,
        name: name,
        phoneNumber: phone,
      }).then(() => {
        message.success("Thêm người dùng mới thành công");
        fetchUsers();
        resetForm();
        setIsOpenModal(false);
      }

      );

    } catch (err) {
      console.log(err);
      message.error(err.response.data.content);
    }
  }

  const resetForm = () => {
    setEmail("");
    setName("");
    setPhone("");
    setPassword("");
  }

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
    setIsNew(false);
    setEmail(record.email);
    setName(record.name);
    setPhone(record.phone);
  };

  const handleAddNewUser = () => {
    setIsOpenModal(true);
    setCurrentUser(null);
    setIsNew(true);
    setEmail("");
    setName("");
    setPhone("");
    setPassword("");

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
              message.error('Cập nhật thất bại!');
            }
          })
      }
    }
  }

  const deleteUser = record => {

    Swal.fire({
      title: 'Bạn muốn xóa người dùng này không?',
      showCancelButton: true,
      confirmButtonText: 'Đồng Ý',
      cancelButtonText: 'Hủy'
    }).then(result => {
      if (result.isConfirmed) {
        users.deleteUser(record.id).then(() => {
          message.success("Xóa người dùng thành công!");
          fetchUsers();
        }).catch(err => {
          if (err.response && err.response.status === 400) {
            message.error(err.response.data.content)
          } else {
            message.error('Xóa Người Dùng Thất Bại!')
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
      <div className="flex justify-between items-center">
        <Input type="text" onChange={(e) => setSearch(e.target.value)} className="flex justify-end mb-5 w-1/4" size="medium" placeholder="Tìm kiếm ..." />

        <Button
          onClick={() => handleAddNewUser()}
          type="primary"
          className="bg-info-400 text-white mr-20"

        >
          <i className="fa-solid fa-user-plus"></i>
          Thêm Người Dùng
        </Button>

      </div>

      <ConfigProvider locale={viVN}>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{
            showQuickJumper: false,
            size: 'small',
            showTitle: 'trang',
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
            showTotal: total => {
              return `Tổng Trang: ${total}`;
            },
          }

          }
        />
      </ConfigProvider>

      <Modal
        title={(isNew ? "Thêm người dùng" : "Chỉnh sửa người dùng")}
        open={isOpenModal}
        onOk={() => NewOrEdit()}
        onCancel={() => setIsOpenModal(false)}
        okText={"Lưu"}
        cancelText={"Hủy"}
      >
        <Typography.Title level={5}>Email</Typography.Title>
        <Input
          type="email"
          onChange={e => setEmail(e.target.value)}
          placeholder="Nhập Địa Chỉ Email"
          value={email}
          disabled={!isNew}
        />

        <Typography.Title level={5}>Tên Người Dùng</Typography.Title>
        <Input
          type="text"
          onChange={e => setName(e.target.value)}
          placeholder="Nhập Tên Người Dùng"
          value={name}
        />

        <Typography.Title level={5}>Số Điện Thoại</Typography.Title>
        <Input
          type="Number"
          onChange={e => checkPhoneValid(e)}
          placeholder="Nhập Số Điện Thoại"
          value={phone}
          style={{
            borderColor: isValid ? 'initial' : 'bg-red-400',
            outline: isValid ? 'initial' : 'bg-red-400',
          }}
        />
        {!isValid && <p style={{ color: 'red' }}>Số điện thoại không hợp lệ. Phải bắt đầu bằng 03, 05, 07, 08, 09, hoặc +84 và có 10 ký tự.</p>}


        <Typography.Title level={5}>{(isNew ? "Mật Khẩu" : "")}</Typography.Title>

        <Input
          type={(isNew ? "password" : "hidden")}
          onChange={e => setPassword(e.target.value)}
          placeholder="Nhập Mật Khẩu"
          value={password}
        />
      </Modal>
    </>
  );
};

export default UserManage;