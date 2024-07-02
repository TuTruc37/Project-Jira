import React, { useContext, useEffect, useState } from 'react';
import { handleGetValueLocalStore } from '../../utils/utils';
import { users } from '../../services/users';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AlertContext } from '../../App';
import InputProfile from '../../components/Input/InputProfile';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
const Profile = () => {
  const dataUsers = handleGetValueLocalStore('dataUser');
  const [dataUser, setDataUser] = useState([]);
  const [matchedUser, setMatchedUser] = useState(null);
  //cập nhập lại dữ liệu localStorage Khi đã bấm sửa
  const handleSetValueLocalStore = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };
  //
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    users
      .getUsers()
      .then(res => {
        setDataUser(res.data.content);
        const matchedUser = res.data.content.find(
          user => user.email === dataUsers.email
        );
        if (matchedUser) {
          setMatchedUser(matchedUser);
        }
      })
      .catch(err => {
        console.log(err.data.message);
      });
  };

  const { handleAlert } = useContext(AlertContext);

  const onSubmit = async values => {
    console.log('Gửi giá trị:', values);
    try {
      const res = await users.editUser(values);
      console.log('Phản hồi API:', res);
      handleAlert('success', 'Sửa thông tin thành công');
      // Cập nhật dữ liệu trong localStorage
      const updatedDataUsers = { ...dataUsers, ...values };
      handleSetValueLocalStore('dataUser', updatedDataUsers);
      // Reload lại trang
      window.location.reload();
    } catch (err) {
      console.error('Lỗi khi sửa thông tin:', err);
    }
  };

  const formik = useFormik({
    initialValues: {
      id: '',
      email: '',
      name: '',
      phoneNumber: '',
      avatar: '',
    },
    onSubmit: onSubmit,
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Địa chỉ email không hợp lệ')
        .required('Bắt buộc'),
      name: Yup.string().required('Bắt buộc'),
      phoneNumber: Yup.string().required('Bắt buộc'),
    }),
  });

  // Giải phóng các thuộc tính cần thiết từ formik
  const { values, handleChange, handleBlur, handleSubmit, setFieldValue } =
    formik;

  useEffect(() => {
    if (matchedUser) {
      setFieldValue('id', matchedUser.userId);
      setFieldValue('email', matchedUser.email);
      setFieldValue('name', matchedUser.name);
      setFieldValue('phoneNumber', matchedUser.phoneNumber);
      setFieldValue('avatar', matchedUser.avatar);
    }
  }, [matchedUser, setFieldValue]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-center">
        Thông tin tài khoản
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5 w-full" noValidate>
        <div className="grid grid-cols-2 gap-5 grid-flow-col">
          <div className="text-center">
            <Space direction="vertical" size={16}>
              <Space wrap size={16}>
                <Avatar
                  size={250}
                  icon={<UserOutlined />}
                  src={values.avatar}
                />
              </Space>
            </Space>
          </div>
          <div>
            <InputProfile
              label="ID"
              name="id"
              value={values.id}
              onChange={handleChange}
              onBlur={handleBlur}
              readOnly
            />

            <InputProfile
              label="Email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              readOnly
            />
            <InputProfile
              label="Tên"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <InputProfile
              label="Số điện thoại"
              name="phoneNumber"
              value={values.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-700 py-3 px-60 rounded-lg mt-3"
            >
              Sửa
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
