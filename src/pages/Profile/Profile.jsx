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
  //cập nhập lại reload localStorage
  function Main_reload() {
    setInterval(function () {
      window.location.reload();
    }, 2000);
  }
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
      Main_reload();
    } catch (err) {
      console.error('Lỗi khi sửa thông tin:', err);
    }
  };

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      id: '',
      email: '',
      name: '',
      phoneNumber: '',
      avatar: '',
    },
    onSubmit: onSubmit,
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Vui lòng không bỏ trống')
        .min(5, 'Vui lòng nhập tối thiêu 5 ký tự'),
      phoneNumber: Yup.string()
        .required('Vui lòng không bỏ trống')
        .matches(
          /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
          'Đây không phải số điện thoại'
        ),
    }),
  });

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
        <div className="grid grid-cols-2 gap-5 grid-flow-col border-dashed border-2	p-4">
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
            <h2 className="text-3xl mt-14">Xin chào {values.name}</h2>
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
              placeholder="Vui lòng nhập tên"
              error={errors.name}
              touched={touched.name}
            />
            <InputProfile
              label="Số điện thoại"
              name="phoneNumber"
              value={values.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Vui lòng nhập số điện thoại"
              error={errors.phoneNumber}
              touched={touched.phoneNumber}
            />

            <div>
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-700 py-2 px-56 rounded-lg mt-3 text-xl"
              >
                Sửa
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
