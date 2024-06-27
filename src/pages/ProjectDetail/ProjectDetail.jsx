import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { projectMan } from './../../services/projectMan'; // Make sure to import your service
import { path } from '../../common/path';
import { Breadcrumb, Modal, TreeSelect, Slider } from 'antd';
import './projectDetail.scss';
import { Button } from 'antd/es/radio';
//
import { useDispatch } from 'react-redux';
import SelectCustom from '../../components/SelectCustom/SelectCustom';
import InputCustom from '../../components/Input/InputCustom';
import Description from '../../components/Description/Description';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AlertContext } from '../../App';
import { getAllCreateTask } from '../../services/getAllCreateTask';
import { addTask } from './../../redux/slice/taskSlice';
// import './createTask.scss';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const { projectId } = useParams(); // Lấy projectId từ URL
  const dispatch = useDispatch();
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
      projectId: projectId, // Đặt giá trị projectId từ URL vào initialValues
      typeId: '',
      priorityId: '',
    },
    onSubmit: async values => {
      console.log('Submitted values:', values); // Log dữ liệu đã gửi đi
      try {
        const res = await getAllCreateTask.postCreateTask(values);
        handleAlert('success', 'Tạo Task thành công');
        resetForm();

        // Dispatch addTask to Redux store
        const newTask = {
          id: `task-${res.data.taskId}`,
          content: values.taskName,
          column: `column-${values.statusId}`,
        };
        dispatch(addTask(newTask));
      } catch (err) {
        handleAlert('error', err.response.data.content);
      }
    },
    validationSchema: Yup.object({
      // taskName: Yup.string()
      //   .required('Vui lòng không bỏ trống')
      //   .min(5, 'Vui lòng nhập tối thiểu 5 ký tự'),
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

  const filterTreeNode = (inputValue, treeNode) => {
    return treeNode.title.toLowerCase().includes(inputValue.toLowerCase());
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const res = await projectMan.getProjectDetails(projectId);
        const projectData = res.data.content;

        // Transform the data to match the format needed for the Kanban board
        const taskMap = {};
        projectData.lstTask.forEach(status => {
          status.lstTaskDeTail.forEach(task => {
            taskMap[task.taskId] = {
              id: task.taskId.toString(),
              content: task.taskName,
              column: status.statusId,
              assignees: task.assigness,
              taskType: task.taskTypeDetail.taskType,
              priority: task.priorityTask.priority, // Add priority field
            };
          });
        });

        const newTasks = Object.values(taskMap);
        const newColumns = projectData.lstTask.reduce((acc, status) => {
          acc[status.statusId] = {
            id: status.statusId,
            title: status.statusName,
            taskIds: status.lstTaskDeTail.map(task => task.taskId.toString()),
          };
          return acc;
        }, {});

        setTasks(newTasks);
        setColumns(newColumns);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const handleDragEnd = result => {
    if (!result.destination) return;

    const sourceColumnId = result.source.droppableId;
    const destinationColumnId = result.destination.droppableId;

    if (sourceColumnId === destinationColumnId) {
      const column = columns[sourceColumnId];
      const updatedTaskIds = Array.from(column.taskIds);
      const [removed] = updatedTaskIds.splice(result.source.index, 1);
      updatedTaskIds.splice(result.destination.index, 0, removed);

      const updatedColumn = {
        ...column,
        taskIds: updatedTaskIds,
      };

      setColumns({
        ...columns,
        [sourceColumnId]: updatedColumn,
      });
    } else {
      const sourceColumn = columns[sourceColumnId];
      const destinationColumn = columns[destinationColumnId];

      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      const destinationTaskIds = Array.from(destinationColumn.taskIds);

      const [removed] = sourceTaskIds.splice(result.source.index, 1);
      destinationTaskIds.splice(result.destination.index, 0, removed);

      const updatedColumns = {
        ...columns,
        [sourceColumnId]: {
          ...sourceColumn,
          taskIds: sourceTaskIds,
        },
        [destinationColumnId]: {
          ...destinationColumn,
          taskIds: destinationTaskIds,
        },
      };

      setColumns(updatedColumns);
    }
  };

  const getTaskTypeIcon = taskType => {
    switch (taskType.toLowerCase()) {
      case 'bug':
        return (
          <i className="fa-solid fa-xmark bg-red-500 py-1 px-2 rounded text-white"></i>
        );
      case 'new task':
        return (
          <i className="fa-solid fa-font-awesome bg-green-500 py-1 px-2 rounded text-white"></i>
        );
      default:
        return <i className="fa-solid fa-square-check"></i>;
    }
  };

  const getPriorityIcon = priority => {
    switch (priority.toLowerCase()) {
      case 'high':
        return <i className="fa-solid fa-arrow-up py-2 px-2 priority-high"></i>;

      case 'medium':
        return <i className="fa-solid fa-arrow-up priority-medium"></i>;
      case 'low':
        return <i className="fa-solid fa-arrow-down priority-low"></i>;

      case 'lowest':
        return <i className="fa-solid fa-arrow-down priority-lowest"></i>;
      default:
        return null;
    }
  };

  return (
    <div className="ProjectDetail">
      <Breadcrumb separator="/">
        <Breadcrumb.Item>
          <Link to={path.account.trangChu} className="">
            Home
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Project details</Breadcrumb.Item>
      </Breadcrumb>
      <h1 className="text-left text-2xl font-bold pb-8 pt-4">Project Detail</h1>
      <div className="flex justify-end mb-3">
        {/* Create task */}
        <>
          <Button
            className="py-4 px-4 font-semibold text-md bg-blue-500 flex justify-center items-center text-white hover:text-white "
            onClick={showModal}
          >
            Create task
          </Button>
          <Modal
            width={900}
            style={{ top: 20 }}
            // title="Create task"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
          >
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
                    onChange={
                      value => setFieldValue('projectId', value) // Cập nhật giá trị cho formik
                    }
                    filterTreeNode={filterTreeNode} // Add filterTreeNode to enable search
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
                      onChange={
                        value => setFieldValue('listUserAsign', value) // Cập nhật giá trị cho formik
                      }
                      filterTreeNode={filterTreeNode} // Add filterTreeNode to enable search
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
          </Modal>
        </>
        {/* End create task */}
      </div>
      <div className="grid grid-cols-4 gap-5">
        <DragDropContext onDragEnd={handleDragEnd}>
          {Object.values(columns).map(column => (
            <Droppable key={column.id} droppableId={column.id}>
              {provided => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="column droppable-column space-y-2 divide-y p-5 text-center"
                >
                  <h2 className="text-left mb-2 font-medium">{column.title}</h2>
                  {column.taskIds.map((taskId, index) => {
                    const task = tasks.find(task => task.id === taskId);

                    return (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {provided => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className="task hover:bg-gray-300 p-5 bg-white shadow-md rounded-md"
                          >
                            <div className="text-left text-md font-normal">
                              {task.content}
                            </div>
                            <div className="flex mt-4 justify-between items-center">
                              <div className="flex space-x-2">
                                <div className="task-type">
                                  {getTaskTypeIcon(task.taskType)}
                                </div>
                                <div className="task-priority">
                                  {getPriorityIcon(task.priority)}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-y-2 mt-2 justify-end">
                                {task.assignees.map(assignee => (
                                  <img
                                    key={assignee.id}
                                    src={assignee.avatar}
                                    alt={assignee.name}
                                    className="w-7 h-7 rounded-full mr-2"
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
};

export default ProjectDetail;
