import { useEffect, useState } from 'react';
import { Button, Table, Modal, message, Input, Typography } from 'antd';
import Swal from 'sweetalert2';
import { users } from '../../../services/users';

const UserManage = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [dataUsers, setDataUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [search, setSearch] = useState('');
  const [isNew, setIsNew] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isNameValid, setIsNameValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const handleOk = () => {
    if (isNew) {
      const checkemail = checkEmailValid(email);
      const checkname = checkNameValid(name);
      const checkphone = checkPhoneValid(phone);
      const checkpassword = checkPassWordValid(password);
      if (checkemail && checkname && checkphone && checkpassword) {
        newUser();
      } else {
        message.error('Vui lòng kiểm tra lại thông tin.');
      }
    } else {
      const checkname = checkNameValid(name);
      const checkphone = checkPhoneValid(phone);
      if (checkname && checkphone) {
        saveDataUser();
      } else {
        message.error('Vui lòng kiểm tra lại thông tin.');
      }
    }
  };

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
            type="secondary"
            className="bg-amber-400 text-white  hover:bg-amber-600"
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

  const newUser = async () => {
    const checkmail = dataUsers.filter(item => item.email === email);
    if (checkmail.length > 0) {
      message.error('Email đã tồn tại!');
      return;
    }
    try {
      await users
        .dangKy({
          email: email,
          passWord: password,
          name: name,
          phoneNumber: phone,
        })
        .then(() => {
          message.success('Thêm người dùng mới thành công');
          fetchUsers();
          resetForm();
          setIsOpenModal(false);
        });
    } catch (err) {
      console.log(err);
      message.error(err.response.data.content);
    }
  };

  const resetForm = () => {
    setEmail('');
    setName('');
    setPhone('');
    setPassword('');
    setIsPhoneValid(true);
    setIsEmailValid(true);
    setIsNameValid(true);
    setIsPasswordValid(true);
  };

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
    resetForm();
    setIsOpenModal(true);
    setCurrentUser(record);
    setIsNew(false);
    setEmail(record.email);
    setName(record.name);
    setPhone(record.phone);
  };

  const handleAddNewUser = () => {
    resetForm();
    setIsOpenModal(true);
    setCurrentUser(null);
    setIsNew(true);
  };

  useEffect(() => {
    if (currentUser) {
      resetForm();
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
      message.error('Tên không được để trống!');
    } else {
      if (isPhoneValid) {
        users.editUser(payload).then(res => {
          if (res.data.statusCode == 200) {
            message.success('Cập nhật thành công!');
            fetchUsers();
            setIsOpenModal(false);
          } else {
            message.error('Cập nhật thất bại!');
          }
        });
      }
    }
  };

  const deleteUser = record => {
    Swal.fire({
      title: 'Bạn muốn xóa người dùng này không?',
      showCancelButton: true,
      confirmButtonText: 'Đồng Ý',
      cancelButtonText: 'Hủy',
    }).then(result => {
      if (result.isConfirmed) {
        users
          .deleteUser(record.id)
          .then(() => {
            message.success('Xóa người dùng thành công!');
            fetchUsers();
          })
          .catch(err => {
            if (err.response && err.response.status === 400) {
              message.error(err.response.data.content);
            } else {
              message.error('Xóa Người Dùng Thất Bại!');
            }
          });
      }
    });
  };

  const checkPhoneValid = value => {
    const phoneRegex = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/;
    const valid = phoneRegex.test(value);
    setIsPhoneValid(valid);
    return valid;
  };

  const checkNameValid = value => {
    const valid = value.length > 4;
    setIsNameValid(valid);
    return valid;
  };

  const checkPassWordValid = value => {
    const Regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[a-zA-Z0-9\W]{8,}$/;
    const valid = Regex.test(value);
    setIsPasswordValid(valid);
    return valid;
  };

  const checkEmailValid = value => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(value);
    setIsEmailValid(valid);
    return valid;
  };

  dataSource = dataSource.filter(item =>
    Object.values(item).some(value =>
      value?.toString()?.toLowerCase()?.includes(search.toLowerCase())
    )
  );

  return (
    <>
      <h2 className="mb-4 text-2xl font-semibold">User Manager</h2>
      <div className="flex justify-between items-center">
        <Input
          type="text"
          onChange={e => setSearch(e.target.value)}
          className="flex justify-end mb-5 w-1/4"
          size="medium"
          placeholder="Tìm kiếm ..."
        />
        <Button
          onClick={() => handleAddNewUser()}
          type="secondary"
          className="bg-blue-500 text-white mr-20 "
        >
          <i className="fa-solid fa-user-plus"></i>
          <p>thêm người dùng</p>
        </Button>
      </div>

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
        }}
      />

      <Modal
        title={isNew ? 'Thêm người dùng' : 'Chỉnh sửa người dùng'}
        open={isOpenModal}
        onOk={handleOk}
        onCancel={() => {
          resetForm();
          setIsOpenModal(false);
        }}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Typography.Title level={5}>Email</Typography.Title>
        <Input
          type="email"
          onChange={e => {
            setEmail(e.target.value);
            checkEmailValid(e.target.value);
          }}
          placeholder="Nhập Địa Chỉ Email"
          value={email}
          disabled={!isNew}
          style={{
            borderColor: isEmailValid ? 'initial' : 'red',
            outline: isEmailValid ? 'initial' : 'red',
          }}
        />
        {!isEmailValid && <p style={{ color: 'red' }}>Email không hợp lệ.</p>}
        <Typography.Title level={5}>Tên Người Dùng</Typography.Title>
        <Input
          type="text"
          onChange={e => {
            setName(e.target.value);
            checkNameValid(e.target.value);
          }}
          placeholder="Nhập Tên Người Dùng"
          value={name}
          style={{
            borderColor: isNameValid ? 'initial' : 'red',
            outline: isNameValid ? 'initial' : 'red',
          }}
        />
        {!isNameValid && (
          <p style={{ color: 'red' }}>
            Tên người dùng không được để trống. Vui lòng nhập tối thiêu 5 ký tự
          </p>
        )}
        <Typography.Title level={5}>Số Điện Thoại</Typography.Title>
        <Input
          type="text"
          onChange={e => {
            setPhone(e.target.value);
            checkPhoneValid(e.target.value);
          }}
          placeholder="Nhập Số Điện Thoại"
          value={phone}
          style={{
            borderColor: isPhoneValid ? 'initial' : 'red',
            outline: isPhoneValid ? 'initial' : 'red',
          }}
        />
        {!isPhoneValid && (
          <p style={{ color: 'red' }}>
            Số điện thoại không hợp lệ. Phải bắt đầu bằng 03, 05, 07, 08, 09,
            hoặc +84 và có 10 ký tự.
          </p>
        )}
        {isNew && (
          <>
            <Typography.Title level={5}>Mật Khẩu</Typography.Title>
            <Input
              type="password"
              onChange={e => {
                setPassword(e.target.value);
                checkPassWordValid(e.target.value);
              }}
              placeholder="Nhập Mật Khẩu"
              value={password}
              style={{
                borderColor: isPasswordValid ? 'initial' : 'red',
                outline: isPasswordValid ? 'initial' : 'red',
              }}
            />
            {!isPasswordValid && (
              <p style={{ color: 'red' }}>
                Vui lòng nhập mật khẩu ít nhất 8 ký tự bao gồm 1 ký tự viết hoa
                1 ký tự đặc biệt và số.
              </p>
            )}
          </>
        )}
      </Modal>
    </>
  );
};

export default UserManage;
