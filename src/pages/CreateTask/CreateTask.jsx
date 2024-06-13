import React, { useContext, useEffect, useState } from 'react';
import SelectCustom from '../../components/SelectCustom/SelectCustom';
import InputCustom from '../../components/Input/InputCustom';
import Description from '../../components/Description/Description';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AlertContext } from '../../App';
import { getAllCreateTask } from '../../services/getAllCreateTask';
import { TreeSelect } from 'antd';
const CreateTask = () => {
  const [gprojectId, setProjectId] = useState([]);
  // console.log(gprojectId);
  const [gstatusName, SetStatusName] = useState([]);
  // console.log(gstatusName);
  const [gpriority, setPriority] = useState([]);
  // console.log(gpriority);
  const [gtaskType, setTaskType] = useState([]);
  // console.log(gtaskType);
  const [userAsign, setUserAsign] = useState([]);
  // console.log(userAsign);
  useEffect(() => {
    DataProject();
    DataStatus();
    DataPriority();
    DataTaskType();
    DataUserAsign();
  }, []);
  const DataProject = async () => {
    try {
      const response = await getAllCreateTask.getAllProject();
      const data = response.data.content;
      setProjectId(data);
    } catch (error) {
      console.error(error);
    }
  };
  const DataStatus = async () => {
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
      // console.log(repo.data.content);
      setPriority(repo.data.content);
    } catch (err) {
      console.log(err);
    }
  };
  const DataTaskType = async () => {
    try {
      const repo = await getAllCreateTask.getAllTaskType();
      // console.log(repo.data.content);
      setTaskType(repo.data.content);
    } catch (err) {
      console.log(err);
    }
  };
  const DataUserAsign = async () => {
    try {
      const repo = await getAllCreateTask.getAllUsers();
      console.log(repo.data.content);
      setUserAsign(repo.data.content);
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
          const res = await getAllCreateTask.getcreateTask(values);
          console.log(res);
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
        <SelectCustom
          label="Project"
          name="projectId"
          handleChange={handleChange}
          value={values.projectId}
          options={gprojectId} // Truyền danh sách loại người dùng từ API vào options
          labelColor="text-black"
          valueProp="id"
          labelProp="projectName"
        />
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
          valueProp="statusId"
          labelProp="statusName"
        />
        <div className="grid grid-cols-2 gap-5">
          <SelectCustom
            label="Priority"
            name="priorityId"
            handleChange={handleChange}
            value={values.priorityId}
            options={gpriority} // Truyền danh sách loại người dùng từ API vào options
            labelColor="text-black"
            valueProp="priorityId"
            labelProp="priority"
          />

          <SelectCustom
            label="Task type"
            name="typeId"
            handleChange={handleChange}
            value={values.typeId}
            options={gtaskType} // Truyền danh sách loại người dùng từ API vào options
            labelColor="text-black"
            valueProp="id"
            labelProp="taskType"
          />

          {/* Component hai cái mới không tách riêng */}

          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            value={values.userAsign}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Please select"
            allowClear
            multiple
            treeDefaultExpandAll
            onChange={DataTaskType}
            treeData={userAsign}
          />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <InputCustom
            label="original Estimate"
            name="originalEstimate"
            handleChange={handleChange}
            handleBlur={handleBlur}
            error={errors.originalEstimate}
            touched={touched.originalEstimate}
            value={values.originalEstimate}
            labelColor="text-black"
          />
          <div className="grid grid-cols-2 gap-5">
            <InputCustom
              label="time Spent"
              name="timeTrackingSpent"
              handleChange={handleChange}
              handleBlur={handleBlur}
              error={errors.timeTrackingSpent}
              touched={touched.timeTrackingSpent}
              value={values.timeTrackingSpent}
              labelColor="text-black"
            />

            <InputCustom
              label="time Remaining"
              name="timeTrackingRemaining"
              handleChange={handleChange}
              handleBlur={handleBlur}
              error={errors.timeTrackingRemaining}
              touched={touched.timeTrackingRemaining}
              value={values.timeTrackingRemaining}
              labelColor="text-black"
            />
          </div>
        </div>
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
