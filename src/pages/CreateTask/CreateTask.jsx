import React, { useContext, useEffect, useState } from 'react';
import SelectCustom from '../../components/SelectCustom/SelectCustom';
import InputCustom from '../../components/Input/InputCustom';
import Description from '../../components/Description/Description';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AlertContext } from '../../App';
import { getAllCreateTask } from '../../services/getAllCreateTask';
const CreateTask = () => {
  const [gstatusName, SetStatusName] = useState([]);
  console.log(gstatusName);
  const [gpriority, setPriority] = useState([]);
  console.log(gpriority);
  useEffect(() => {
    fetchData();
    DataPriority();
  }, []);
  const fetchData = async () => {
    try {
      const response = await getAllCreateTask.getAllStatus();
      const data = response.data.content;
      SetStatusName(data);
    } catch (error) {
      console.error(error);
    }
  };

  const DataPriority = async () => {
    try {
      const repo = await getAllCreateTask.getAllPriority();
      console.log(repo.data.content);
      setPriority(repo.data.content);
    } catch (err) {
      console.log(err);
    }
  };
  const { handleAlert } = useContext(AlertContext);
  const { handleChange, handleBlur, errors, values, handleSubmit, touched } =
    useFormik({
      initialValues: {
        listUserAsign: [0],
        taskName: '',
        description: '',
        statusId: '',
        originalEstimate: 0,
        timeTrackingSpent: 0,
        timeTrackingRemaining: 0,
        projectId: 0,
        typeId: 0,
        priorityId: 0,
      },
      // onSubmit là phương thức chạy khi form được submit
      onSubmit: async (values, { resetForm }) => {
        console.log(values);
        try {
          // const res = await projectMan.createProjectAuthorize(values);
          // console.log(res);
          handleAlert('success', 'Tạo Task thành công');
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
      <h1 className="text-2xl font-bold">Create Task</h1>
      <form onSubmit={handleSubmit} className="space-y-5 w-full ">
        {/* <SelectCustom
          label="Project"
          name="listUserAsign"
          handleChange={handleChange}
          value={values.listUserAsign}
          // options={projectCateName} // Truyền danh sách loại người dùng từ API vào options
          labelColor="text-black"
        /> */}
        <InputCustom
          label="task Name"
          name="taskName"
          handleChange={handleChange}
          handleBlur={handleBlur}
          placeholder="Vui lòng nhập tên"
          error={errors.taskName}
          touched={touched.taskName}
          value={values.taskName}
          labelColor="text-black"
        />
        <SelectCustom
          label="Status"
          name="statusId"
          handleChange={handleChange}
          value={values.statusId}
          options={gstatusName} // Truyền danh sách loại người dùng từ API vào options
          labelColor="text-black"
        />
        <SelectCustom
          label="Priority"
          name="priorityId"
          handleChange={handleChange}
          value={values.priorityId}
          options={gpriority} // Truyền danh sách loại người dùng từ API vào options
          labelColor="text-black"
        />

        {/* <SelectCustom /> */}
        <InputCustom />
        <InputCustom />
        <InputCustom />
        <Description />
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
