import React, { useContext } from 'react';
import SelectCustom from '../../components/SelectCustom/SelectCustom';
import InputCustom from '../../components/Input/InputCustom';
import Description from '../../components/Description/Description';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AlertContext } from '../../App';
import { projectMan } from '../../services/projectMan';

const CreateTask = () => {
  const { handleAlert } = useContext(AlertContext);

  const formik = useFormik({
    initialValues: {
      taskName: '',
      description: '',
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        console.log('Form values before sending:', values);
        const res = await projectMan.createProjectAuthorize(values);
        console.log('API response:', res);
        handleAlert('success', 'Tạo Task thành công');
        resetForm();
      } catch (err) {
        console.error('Error creating task:', err);
        if (err.response && err.response.data && err.response.data.content) {
          handleAlert('error', err.response.data.content);
        } else {
          handleAlert(
            'error',
            'Đã xảy ra lỗi khi tạo task. Vui lòng thử lại sau.'
          );
        }
      }
    },
    validationSchema: Yup.object({
      taskName: Yup.string()
        .required('Vui lòng không bỏ trống')
        .min(5, 'Vui lòng nhập tối thiểu 5 ký tự'),
    }),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Create Task</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-5 w-full">
        <InputCustom
          label="Task Name"
          name="taskName"
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
          placeholder="Vui lòng nhập tên"
          error={formik.errors.taskName}
          touched={formik.touched.taskName}
          value={formik.values.taskName}
          labelColor="text-black"
        />

        <Description
          value={formik.values.description}
          handleChange={value => formik.setFieldValue('description', value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white px-5 py-2 rounded-md w-full text-center"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
