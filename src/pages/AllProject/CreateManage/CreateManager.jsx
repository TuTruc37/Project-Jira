import React, { useContext, useEffect, useState } from 'react';
import InputCustom from '../../../components/Input/InputCustom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AlertContext } from '../../../App';
import Description from '../../../components/Description/Description';
import { projectCategory } from '../../../services/projectCategory';
import SelectCustom from '../../../components/SelectCustom/SelectCustom';
import { projectMan } from '../../../services/projectMan';

const CreateManager = () => {
  const [projectCateName, setProjectCateName] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await projectCategory.GetProjectCategory();
        const data = response.data.content;
        setProjectCateName(data);
      } catch (error) {
        console.error('Error fetching project categories:', error);
      }
    };

    fetchData();
  }, []);

  const { handleAlert } = useContext(AlertContext);

  const formik = useFormik({
    initialValues: {
      projectName: '',
      description: '',
      categoryId: '',
      alias: '',
    },
    onSubmit: async (values, { resetForm }) => {
      console.log('Submitting values:', values);
      try {
        const res = await projectMan.createProjectAuthorize(values);
        console.log('API response:', res);
        handleAlert('success', 'Tạo project thành công');
        resetForm();
      } catch (err) {
        console.error('Error creating project:', err);
        if (err.response && err.response.data && err.response.data.content) {
          handleAlert('error', err.response.data.content);
        } else {
          handleAlert(
            'error',
            'Đã xảy ra lỗi khi tạo project. Vui lòng thử lại sau.'
          );
        }
      }
    },
    validationSchema: Yup.object({
      projectName: Yup.string()
        .required('Vui lòng không bỏ trống')
        .min(5, 'Vui lòng nhập tối thiểu 5 ký tự'),
    }),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Create Project</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-5 w-full">
        <InputCustom
          label="Name"
          name="projectName"
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
          placeholder="Vui lòng nhập tên"
          error={formik.errors.projectName}
          touched={formik.touched.projectName}
          value={formik.values.projectName}
          labelColor="text-black"
        />
        <h2 className="block mt-5 mb-3 font-medium text-black text-lg">
          Description
        </h2>
        <Description
          name="description"
          value={formik.values.description}
          handleChange={value => formik.setFieldValue('description', value)}
          
        />
        <SelectCustom
          label="Project Category Name"
          name="categoryId"
          handleChange={formik.handleChange}
          value={formik.values.categoryId}
          options={projectCateName}
          labelColor="text-black"
          valueProp="id"
          labelProp="projectCategoryName"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white px-5 py-2 rounded-md w-full text-center"
          type="submit"
        >
          Create Project
        </button>
      </form>
    </div>
  );
};

export default CreateManager;
