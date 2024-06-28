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
import styles from '../FormRegister/formRegister.module.scss';
import { users } from '../../../services/users';
const FormLogin = () => {
  function Main_reload() {
    setInterval(function () {
      window.location.reload();
    }, 2000);
  }
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleAlert } = useContext(AlertContext);
  const { handleBlur, handleChange, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: {
        email: '',
        passWord: '',
      },
      onSubmit: async values => {
        // khi sử dụng async await luôn có một try catch bọc lại để bắt các vấn đề về lỗi
        try {
          const res = await users.dangNhap(values);
          console.log(res);
          handleAlert('success', 'Đăng nhập thành công');
          navigate(path.account.trangChu);
          let dataUser = handleSetValueLocalStore('dataUser', res.data.content);
          if (dataUser == null) {
            Main_reload();
          }

          dispatch(handleGetValue(res.data.content));
        } catch (error) {
          console.log(error.response.data.message);
          handleAlert('error', error.response.data.message);
        }
      },
      validationSchema: Yup.object({
        email: Yup.string()
          .required('Vui lòng không bỏ trống')
          .email('Vui lòng nhập đúng email'),
        passWord: Yup.string()
          .required('Vui lòng không bỏ trống')
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[a-zA-Z0-9\W]{8,}$/,
            'Vui lòng nhập mật khẩu ít nhất 8 ký tự bao gồm 1 ký tự viết hoa 1 ký tự đặc biệt và số'
          ),
      }),
    });

  return (
    <div
      className={`flex items-center justify-center h-full lg:w-11/12 text-black md:w-11/12 ${styles.endBeautiful}`}
    >
      <form onSubmit={handleSubmit} className="space-y-5 w-full">
        <h1 className="md:text-2xl font-bold leading-tight mt-12">
          Đăng nhập vào tài khoản của bạn
        </h1>
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
          label="Mật khẩu"
          name="passWord"
          handleChange={handleChange}
          handleBlur={handleBlur}
          error={errors.passWord}
          touched={touched.passWord}
          placeholder="Vui lòng nhập mật khẩu"
          value={values.passWord}
          type="password"
          labelColor="text-black"
        />
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white px-5 py-2 rounded-md w-full text-center"
            type="submit"
          >
            Đăng nhập
          </button>
          <p className="mt-8">
            Bạn cần một tài khoản?
            <Link
              to={path.dangKy}
              className="text-blue-500 hover:text-blue-700 font-semibold ml-2"
            >
              đăng ký tài khoản
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default FormLogin;
