import React, { useContext } from 'react';
import { useFormik } from 'formik';
import InputCustom from '../../Input/InputCustom';
import * as Yup from 'yup';
import { AlertContext } from '../../../App';
import { Link, useNavigate } from 'react-router-dom';
import { path } from '../../../common/path';
import { handleSetValueLocalStore } from '../../../utils/utils';
import { useDispatch } from 'react-redux';
import { handleGetValue } from '../../../redux/slice/userSlice';
import styles from './formRegister.module.scss';
import { users } from '../../../services/users';
const FormRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleAlert } = useContext(AlertContext);
  const { handleChange, handleBlur, errors, values, handleSubmit, touched } =
    useFormik({
      initialValues: {
        // initialValues đóng vai trò quản lí dữ liệu mặc định cho các input
        email: '',
        passWord: '',
        name: '',
        phoneNumber: '',
      },
      // onSubmit là phương thức chạy khi form được submit
      onSubmit: async (values, { resetForm }) => {
        console.log(values);
        // khi sử dụng async await luôn có một try catch bọc lại để bắt các vấn đề về lỗi

        try {
          const res = await users.dangKy(values);
          // console.log(res);
          handleAlert('success', 'Đăng ký thành công');
          navigate(path.account.dangNhap);
          // gọi hàm xử lí load lại dữ liệu mới từ backend
          handleSetValueLocalStore('dataUser', res.data.content);
          dispatch(handleGetValue(res.data.content));
          // đưa tất cả dữ liệu về mặc định
          resetForm();
        } catch (err) {
          console.log(err.response.data.message);
          handleAlert('error', err.response.data.message);
        }
      },
      validationSchema: Yup.object({
        name: Yup.string()
          .required('Vui lòng không bỏ trống')
          .min(5, 'Vui lòng nhập tối thiêu 5 ký tự'),
        email: Yup.string()
          .required('Vui lòng không bỏ trống')
          .email('Vui lòng nhập đúng email'),
        phoneNumber: Yup.string()
          .required('Vui lòng không bỏ trống')
          .matches(
            /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
            'Đây không phải số điện thoại'
          ),
        passWord: Yup.string()
          .required('Vui lòng không bỏ trống')
          .matches(
            // tạo một mật khẩu có ít nhất 8 ký tự bao gồm 1 ký tự viết hoa 1 ký tự đặc biệt và số
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[a-zA-Z0-9\W]{8,}$/,
            'Vui lòng nhập mật khẩu ít nhất 8 ký tự bao gồm 1 ký tự viết hoa 1 ký tự đặc biệt và số'
          ),
        nhapLaiMatKhau: Yup.string()
          .required('Vui lòng không bỏ trống')
          .oneOf([Yup.ref('passWord')], 'Mật khẩu không trùng khớp'),
      }),
    });
  return (
    <div
      className={`flex items-center justify-center h-full lg:w-11/12 text-black md:w-11/12 ${styles.endBeautiful}`}
    >
      <form onSubmit={handleSubmit} className="space-y-5 w-full ">
        <h1 className="md:text-2xl font-bold leading-tight mt-12">
          Tạo tài khoản riêng của bạn
        </h1>
        <InputCustom
          label="Name"
          name="name"
          handleChange={handleChange}
          handleBlur={handleBlur}
          placeholder="Vui lòng nhập tên"
          error={errors.name}
          touched={touched.name}
          value={values.name}
          labelColor="text-black"
        />
        <InputCustom
          label="Email"
          name="email"
          handleChange={handleChange}
          handleBlur={handleBlur}
          placeholder="Vui lòng nhập email"
          error={errors.email}
          touched={touched.email}
          value={values.email}
          labelColor="text-black"
        />
        <InputCustom
          label="Số điện thoại"
          name="phoneNumber"
          handleChange={handleChange}
          handleBlur={handleBlur}
          placeholder="Vui lòng nhập số điện thoại"
          error={errors.phoneNumber}
          touched={touched.phoneNumber}
          value={values.phoneNumber}
          labelColor="text-black"
        />

        <InputCustom
          label="Mật khẩu"
          name="passWord"
          handleChange={handleChange}
          handleBlur={handleBlur}
          placeholder="Vui lòng nhập mật khẩu"
          type="password"
          error={errors.passWord}
          touched={touched.passWord}
          className="col-span-2"
          value={values.passWord}
          labelColor="text-black"
        />
        <InputCustom
          label="Nhập lại mật khẩu"
          name="nhapLaiMatKhau"
          handleChange={handleChange}
          handleBlur={handleBlur}
          placeholder="Vui lòng nhập lại mật khẩu"
          type="password"
          error={errors.nhapLaiMatKhau}
          touched={touched.nhapLaiMatKhau}
          className="col-span-2"
          value={values.nhapLaiMatKhau}
          labelColor="text-black"
        />
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white px-5 py-2 rounded-md w-full text-center"
            type="submit"
          >
            Đăng Ký
          </button>
          <p className="mt-8">
            Bạn đã có tài khoản?
            <Link
              to={path.account.dangNhap}
              className="text-blue-500 hover:text-blue-700 font-semibold ml-2"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default FormRegister;
