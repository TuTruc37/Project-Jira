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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projects, statuses, priorities, taskTypes, users] =
        await Promise.all([
          getAllCreateTask.getAllProject(),
          getAllCreateTask.getAllStatus(),
          getAllCreateTask.getAllPriority(),
          getAllCreateTask.getAllTaskType(),
          getAllCreateTask.getAllUsers(),
        ]);

      setProjectId(projects.data.content);
      SetStatusName(statuses.data.content);
      setPriority(priorities.data.content);
      setTaskType(taskTypes.data.content);
      setUserAsign(users.data.content);
    } catch (error) {
      console.error('Error fetching data:', error);
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
    resetForm,
  } = useFormik({
    initialValues: {
      listUserAsign: [],
      taskName: '',
      description: '',
      statusId: '',
      originalEstimate: 0,
      timeTrackingSpent: 0,
      timeTrackingRemaining: 0,
      projectId: '',
      typeId: '',
      priorityId: '',
    },
    onSubmit: async values => {
      console.log('Submitted values:', values); // Log dữ liệu đã gửi đi
      try {
        const res = await getAllCreateTask.postCreateTask(values);
        handleAlert('success', 'Tạo Task thành công');
        resetForm();
      } catch (err) {
        handleAlert('error', err.response.data.content);
      }
    },
    validationSchema: Yup.object({
      taskName: Yup.string()
        .required('Vui lòng không bỏ trống')
        .min(5, 'Vui lòng nhập tối thiểu 5 ký tự'),
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

  const handleFieldChange = e => {
    const { name, value } = e.target;
    handleChange(e); // Gọi hàm handleChange của Formik để cập nhật giá trị
    if (name === 'timeTrackingSpent' || name === 'timeTrackingRemaining') {
      const spent = parseInt(values.timeTrackingSpent, 10) || 0;
      const remaining = parseInt(values.timeTrackingRemaining, 10) || 0;
      setTimeTracking(spent + remaining); // Tính tổng và cập nhật timeTracking
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Create Task</h1>
      <form onSubmit={handleSubmit} className="space-y-3 mt-6 w-full">
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
            value={values.projectId} // Gán giá trị hiện tại từ formik
            onChange={value =>
              setFieldValue('projectId', value) // Cập nhật giá trị cho formik
            }
            treeData={gprojectId.map(project => ({
              ...project,
              title: project.projectName,
              value: project.id,
            }))}
          />
        </div>
        <InputCustom
          label="Task Name"
          name="taskName"
          handleChange={handleFieldChange}
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
            label="Task Type"
            name="typeId"
            handleChange={handleChange}
            value={values.typeId}
            options={gtaskType} // Truyền danh sách loại người dùng từ API vào options
            labelColor="text-black"
            valueProp="id"
            labelProp="taskType"
          />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label
              className="text-lg mb-2 block font-semibold text-black"
              htmlFor=""
            >
              Assignees
            </label>
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              value={values.listUserAsign}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
              allowClear
              multiple
              treeDefaultExpandAll
              onChange={value =>
                setFieldValue('listUserAsign', value) // Cập nhật giá trị cho formik
              }
              treeData={userAsign.map(user => ({
                ...user,
                title: user.name,
                value: user.userId,
              }))}
            />
          </div>
          <div>
            <label
              className="text-lg block text-black font-semibold"
              htmlFor=""
            >
              Time Tracking
            </label>
            <Slider
              value={timeTracking}
              onChange={handleSliderChange}
              tooltipVisible={false}
            />
            <div className="flex justify-between">
              <p className="text-md font-medium">
                {values.timeTrackingSpent}h logged
              </p>
              <p className="text-md font-medium">
                {values.timeTrackingRemaining}h remaining
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <InputCustom
            label="Original Estimate"
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
              label="Time Spent (Hours)"
              name="timeTrackingSpent"
              handleChange={handleFieldChange}
              handleBlur={handleBlur}
              error={errors.timeTrackingSpent}
              touched={touched.timeTrackingSpent}
              value={values.timeTrackingSpent}
              labelColor="text-black"
            />
            <InputCustom
              label="Time Remaining (Hours)"
              name="timeTrackingRemaining"
              handleChange={handleFieldChange}
              handleBlur={handleBlur}
              error={errors.timeTrackingRemaining}
              touched={touched.timeTrackingRemaining}
              value={values.timeTrackingRemaining}
              labelColor="text-black"
            />
          </div>
        </div>
        <Description
          name="description"
          handleChange={value => setFieldValue('description', value)} // Cập nhật giá trị cho formik
          value={values.description}
        />
        <div className="">
          <button
            className="bg-blue-500 mt-10 hover:bg-blue-700 text-white px-5 py-2 rounded-md w-full text-center"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;
