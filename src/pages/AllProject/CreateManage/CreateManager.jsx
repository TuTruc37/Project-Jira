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
  const [projectCateName, SetprojectCateName] = useState([]);
  console.log(projectCateName);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await projectCategory.GetProjectCategory();
        const data = response.data.content;
        SetprojectCateName(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  const { handleAlert } = useContext(AlertContext);
  const { handleChange, handleBlur, errors, values, handleSubmit, touched } =
    useFormik({
      initialValues: {
        projectName: '',
        description: '',
        categoryId: 0,
        alias: '',
      },
      // onSubmit là phương thức chạy khi form được submit
      onSubmit: async (values, { resetForm }) => {
        console.log(values);
        try {
          const res = await projectMan.createProjectAuthorize(values);
          console.log(res);
          handleAlert('success', 'Tạo project thành công');
          resetForm();
        } catch (err) {
          console.log(err);
          handleAlert('error', err.response.data.content);
        }
      },
      validationSchema: Yup.object({
        projectName: Yup.string()
          .required('Vui lòng không bỏ trống')
          .min(5, 'Vui lòng nhập tối thiêu 5 ký tự'),
      }),
    });
  return (
    <div>
      <h1 className="text-2xl font-bold">Create Project</h1>
      <form onSubmit={handleSubmit} className="space-y-5 w-full ">
        <InputCustom
          label="Name"
          name="projectName"
          handleChange={handleChange}
          handleBlur={handleBlur}
          placeholder="Vui lòng nhập tên"
          error={errors.projectName}
          touched={touched.projectName}
          value={values.projectName}
          labelColor="text-black"
        />
        <h2 className="block mt-5 mb-3 font-medium text-black text-lg ">
          Description
        </h2>
        <Description
          name="description"
          value={values.description}
          handleChange={handleChange}
        />
        <SelectCustom
          label="project Category Name"
          name="categoryId"
          handleChange={handleChange}
          value={values.categoryId}
          options={projectCateName} // Truyền danh sách loại người dùng từ API vào options
          labelColor="text-black"
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
