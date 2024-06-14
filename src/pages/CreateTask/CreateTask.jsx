import React, { useContext, useEffect, useState } from 'react';
import SelectCustom from '../../components/SelectCustom/SelectCustom';
import InputCustom from '../../components/Input/InputCustom';
import Description from '../../components/Description/Description';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AlertContext } from '../../App';
import { getAllCreateTask } from '../../services/getAllCreateTask';
import { TreeSelect, Slider } from 'antd';
import './createTask.scss';

const CreateTask = () => {
  const [gprojectId, setProjectId] = useState([]);
  const [gstatusName, SetStatusName] = useState([]);
  const [gpriority, setPriority] = useState([]);
  const [gtaskType, setTaskType] = useState([]);
  const [userAsign, setUserAsign] = useState([]);
  const [timeTracking, setTimeTracking] = useState(0);

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
      setPriority(repo.data.content);
    } catch (err) {
      console.log(err);
    }
  };

  const DataTaskType = async () => {
    try {
      const repo = await getAllCreateTask.getAllTaskType();
      setTaskType(repo.data.content);
    } catch (err) {
      console.log(err);
    }
  };

  const DataUserAsign = async () => {
    try {
      const repo = await getAllCreateTask.getAllUsers();
      setUserAsign(repo.data.content);
    } catch (err) {
      console.log(err);
    }
  };

  const { handleAlert } = useContext(AlertContext);
  const {
    handleChange,
    handleBlur,
    errors,
    values,
    handleSubmit,
    touched,
    setFieldValue,
  } = useFormik({
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
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await getAllCreateTask.getcreateTask(values);
        handleAlert('success', 'Tạo Task thành công');
        resetForm();
      } catch (err) {
        handleAlert('error', err.response.data.content);
      }
    },
    validationSchema: Yup.object({
      projectName: Yup.string()
        .required('Vui lòng không bỏ trống')
        .min(5, 'Vui lòng nhập tối thiêu 5 ký tự'),
    }),
  });

  const handleSliderChange = value => {
    const newRemaining = values.originalEstimate - value;
    setTimeTracking(value);
    setFieldValue('timeTrackingSpent', value);
    setFieldValue(
      'timeTrackingRemaining',
      newRemaining >= 0 ? newRemaining : 0
    );
  };

  const handleTimeSpentChange = (e) => {
    const value = parseInt(e.target.value, 10);
    const newRemaining = values.originalEstimate - value;
    setTimeTracking(value);
    setFieldValue('timeTrackingSpent', value);
    setFieldValue('timeTrackingRemaining', newRemaining >= 0 ? newRemaining : 0);
  };

  const handleTimeRemainingChange = (e) => {
    const value = parseInt(e.target.value, 10);
    const newSpent = values.originalEstimate - value;
    setTimeTracking(newSpent);
    setFieldValue('timeTrackingSpent', newSpent >= 0 ? newSpent : 0);
    setFieldValue('timeTrackingRemaining', value);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Create Task</h1>
      <form onSubmit={handleSubmit} className="space-y-5 w-full ">
        <div>
          <label
            className="block text-lg mb-2 mt-6 font-semibold text-black"
            htmlFor=""
          >
            Project
          </label>
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Chọn dự án"
            allowClear
            treeDefaultExpandAll
            onChange={value =>
              handleChange({ target: { name: 'projectId', value } })
            }
            treeData={gprojectId.map(project => ({
              ...project,
              title: project.projectName,
              value: project.id,
            }))}
          />
        </div>
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
        <div className="grid grid-cols-2 gap-5 ">
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

          <div className="">
            <label
              className=" text-lg mb-2 block font-semibold text-black"
              htmlFor=""
            >
              Assignees
            </label>
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              value={values.userAsign}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
              allowClear
              multiple
              treeDefaultExpandAll
              onChange={value =>
                handleChange({ target: { name: 'listUserAsign', value } })
              }
              treeData={userAsign.map(user => ({
                ...user,
                title: user.name,
                value: user.userId,
              }))}
            />
          </div>
          <div>
            <div>
              <label
                className="text-lg  block text-black font-semibold"
                htmlFor=""
              >
                Time tracking
              </label>

              <Slider
                defaultValue={0}
                value={timeTracking}
                onChange={handleSliderChange}
                tooltip={{
                  open: false,
                }}
              />
              <div className="flex justify-between">
                <p className="text-md font-medium">{values.timeTrackingSpent}h logged</p>
                <p className="text-md font-medium">{values.timeTrackingRemaining}h remaining</p>
              </div>
            </div>
          </div>
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
              label="time Spent (Hours)"
              name="timeTrackingSpent"
              handleChange={handleTimeSpentChange}
              handleBlur={handleBlur}
              error={errors.timeTrackingSpent}
              touched={touched.timeTrackingSpent}
              value={values.timeTrackingSpent}
              labelColor="text-black"
            />
            <InputCustom
              label="time Remaining (Hours)"
              name="timeTrackingRemaining"
              handleChange={handleTimeRemainingChange}
              handleBlur={handleBlur}
              error={errors.timeTrackingRemaining}
              touched={touched.timeTrackingRemaining}
              value={values.timeTrackingRemaining}
              labelColor="text-black"
            />
          </div>
        </div>
        <Description />
      </form>
        <button
          className="bg-blue-500 mt-20 hover:bg-blue-700 text-white px-5 py-2 rounded-md w-full text-center"
          type="submit"
        >
          Submit
        </button>
    </div>
  );
};

export default CreateTask;
