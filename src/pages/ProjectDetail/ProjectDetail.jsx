import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { projectMan } from './../../services/projectMan'; // Make sure to import your service
import { path } from '../../common/path';
import { Breadcrumb, Modal, TreeSelect, Slider, Input, Select } from 'antd';
import './projectDetail.scss';
import { Button } from 'antd/es/radio';
import { useDispatch } from 'react-redux';
import SelectCustom from '../../components/SelectCustom/SelectCustom';
import InputCustom from '../../components/Input/InputCustom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AlertContext } from '../../App';
import { getAllCreateTask } from '../../services/getAllCreateTask';
import { addTask } from './../../redux/slice/taskSlice';
import EditorTiny from '../../components/EditorTiny/EditorTiny';
import TextArea from 'antd/es/input/TextArea';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

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

  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      setLoading(false);
    }, 3000);
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
      projectId: projectId,
      typeId: '',
      priorityId: '',
    },
    onSubmit: async values => {
      console.log('Submitted values:', values);
      try {
        const res = await getAllCreateTask.postCreateTask(values);
        handleAlert('success', 'Tạo Task thành công');
        resetForm();

        const newTask = {
          id: `task-${res.data.taskId}`,
          content: values.taskName,
          column: `column-${values.statusId}`,
        };
        dispatch(addTask(newTask));
      } catch (err) {
        handleAlert('error', err.response.data.content);
        console.log(err.response.data.content);
      }
    },
    validationSchema: Yup.object({
      // taskName: Yup.string().required('Vui lòng không bỏ trống').min(5, 'Vui lòng nhập tối thiểu 5 ký tự'),
    }),
  });
  // const handleAssigneesChange = value => {
  //   const selectedUsers = value.map(userId => userAsign.find(user => user.userId === userId));
  //   setSelectedTask(prevTask => ({
  //     ...prevTask,
  //     assignees: selectedUsers,
  //   }));
  // };
  const handleDeleteTask = async () => {
    try {
      // Gọi API để xóa task
      const res = await getAllCreateTask.deleteTask(selectedTask.id);
      handleAlert('success', 'Xóa task thành công');

      // Cập nhật lại state tasks sau khi xóa
      const updatedTasks = tasks.filter(task => task.id !== selectedTask.id);
      setTasks(updatedTasks);

      // Đóng modal chi tiết task sau khi xóa thành công (nếu cần)
      setTaskModalOpen(false);
    } catch (error) {
      handleAlert('error', 'Xóa task không thành công');
      console.error('Error deleting task:', error);
    }
  };

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
    handleChange(e);
    if (name === 'timeTrackingSpent' || name === 'timeTrackingRemaining') {
      const spent = parseInt(values.timeTrackingSpent, 10) || 0;
      const remaining = parseInt(values.timeTrackingRemaining, 10) || 0;
      setTimeTracking(spent + remaining);
    }
  };

  const filterTreeNode = (inputValue, treeNode) => {
    return treeNode.title.toLowerCase().includes(inputValue.toLowerCase());
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const updatedTask = {
        id: selectedTask.id,
        content: selectedTask.content,
        column: selectedTask.column,
        assignees: selectedTask.assignees,
        taskType: selectedTask.taskType,
        priority: selectedTask.priority,
        description: selectedTask.description,
      };

      const res = await getAllCreateTask.postCreateTask(updatedTask);
      handleAlert('success', 'Task updated successfully');
      setIsModalOpen(false);
    } catch (error) {
      handleAlert('error', 'Failed to update task');
      console.error('Error updating task:', error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setTaskModalOpen(false);
  };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const res = await getAllCreateTask.getProjectDetails(projectId);
        const projectData = res.data.content;

        const taskMap = {};
        projectData.lstTask.forEach(status => {
          status.lstTaskDeTail.forEach(task => {
            taskMap[task.taskId] = {
              id: task.taskId.toString(),
              content: task.taskName,
              column: status.statusId,
              assignees: task.assigness,
              taskType: task.taskTypeDetail.taskType,
              priority: task.priorityTask.priority,
              description: task.taskDescription,
              creator: task.creator,
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

  const handleTaskClick = async taskId => {
    try {
      const res = await getAllCreateTask.getTaskDetails(taskId);
      const taskDetails = res.data.content;

      setSelectedTask({
        id: taskDetails.taskId.toString(),
        content: taskDetails.taskName,
        column: taskDetails.statusId,
        assignees: taskDetails.assigness,
        taskType: taskDetails.taskTypeDetail.taskType,
        priority: taskDetails.priorityTask.priority,
        description: taskDetails.description,
        originalEstimate: taskDetails.originalEstimate,
        timeTrackingSpent: taskDetails.timeTrackingSpent,
        timeTrackingRemaining: taskDetails.timeTrackingRemaining,
        comments: taskDetails.lstComment,
      });

      // Mở modal sửa task khi click vào tiêu đề task
      setTaskModalOpen(true);
    } catch (error) {
      console.error('Error fetching task details:', error);
    }
  };

  const handleTaskFieldChange = (field, value) => {
    setSelectedTask(prevTask => ({
      ...prevTask,
      [field]: value,
    }));
  };

  const getTaskTypeIcon = taskType => {
    switch (taskType.toLowerCase()) {
      case 'bug':
        return (
          <i className="fa-solid fa-xmark bg-red-500 py-1 px-2 rounded text-white"></i>
        );
      case 'new task':
        return (
          <i className="fa-solid fa-font-awesome bg-green-500 py-1 px-2 text-sm rounded text-white"></i>
        );
      default:
        return <i className="fa-solid fa-square-check"></i>;
    }
  };

  const getPriorityIcon = priority => {
    switch (priority.toLowerCase()) {
      case 'high':
        return (
          <span className="flex items-center space-x-1 ml-2">
            <i className="fa-solid fa-arrow-up priority-high text-red-500"></i>
            <span>High</span>
          </span>
        );
      case 'medium':
        return (
          <span className="flex items-center space-x-1 ml-2">
            <i className="fa-solid fa-arrow-up  priority-medium text-yellow-500"></i>
            <span>Medium</span>
          </span>
        );
      case 'low':
        return (
          <span className="flex items-center space-x-1 ml-2">
            <i className="fa-solid fa-arrow-down priority-low text-green-500"></i>
            <span>Low</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Project Detail</h1>
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link to={path.account.trangChu}>Project Manager</Link>
        </Breadcrumb.Item>

        <Breadcrumb.Item>Project Detail</Breadcrumb.Item>
      </Breadcrumb>
      <Input
        placeholder="Tìm kiếm mô tả trong dự án..."
        // onChange={}

        style={{ marginBottom: 16, width: 300 }}
      />
      <div className="flex flex-row-reverse items-center mb-3 ">
        <Button
          className="py-3 px-4 bg-blue-500 text-white font-semibold rounded-sm flex items-center hover:text-white "
          type="primary"
          onClick={() => {
            showModal();
            showLoading();
          }}
        >
          Create Task
        </Button>
      </div>
      <Modal
        width={900}
        style={{ top: 20 }}
        // title="Create task"
        loading={loading}
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
                  placeholder="Vui lòng chọn thành viên"
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

            <EditorTiny
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4 ">
          {Object.entries(columns).map(([columnId, column]) => (
            <Droppable key={columnId} droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`p-4 bg-gray-200 rounded  ${
                    snapshot.isDraggingOver ? 'bg-gray-300' : ''
                  }`}
                >
                  <h2 className="font-semibold text-lg mb-4">{column.title}</h2>
                  {column.taskIds.map((taskId, index) => {
                    const task = tasks.find(task => task.id === taskId);
                    return (
                      <Draggable
                        key={taskId}
                        draggableId={taskId}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 mb-2 bg-white rounded shadow-md hover:bg-gray-300 ${
                              snapshot.isDragging ? 'bg-gray-100' : ''
                            }`}
                            // onClick={showLoading}
                            onClick={() => {
                              handleTaskClick(taskId);
                              showLoading();
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <span>{task.content}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <div className="flex">
                                <span>{getTaskTypeIcon(task.taskType)}</span>
                                <span>{getPriorityIcon(task.priority)}</span>
                              </div>
                              <span className="flex flex-wrap space-x-1">
                                {task.assignees.map(assignee => (
                                  <span
                                    key={assignee.id}
                                    className="text-xs text-gray-500   "
                                  >
                                    {/* {assignee.avatar} */}
                                    <img
                                      className="w-7 h-7 rounded-full flex flex-wrap"
                                      src={assignee.avatar}
                                      alt={assignee.name}
                                    />
                                  </span>
                                ))}
                              </span>
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
        </div>
      </DragDropContext>
      <Modal
        width={900}
        style={{ top: 20 }}
        title={
          <div className="flex justify-between items-center">
            <p className='font-semibold text-xl'>Task detail</p>
            <i
              onClick={handleDeleteTask}
              className="fa-solid fa-trash-can mr-10 hover:bg-gray-200 rounded py-2 px-3 cursor-pointer"
            />
          </div>
        }
        open={taskModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        loading={loading}
        footer={null}
      >
        {selectedTask && (
          <div>
            {/* <h1 className="text-3xl font-bold">{selectedTask.content}</h1> */}
            <textarea className="w-full  pt-1 px-2 text-md" name="" id="">
              {selectedTask.content}
            </textarea>

            <form className="space-y-3  w-full">
              <div className="grid grid-cols-2 gap-5">
                <SelectCustom
                  label="Status"
                  name="statusId"
                  handleChange={e =>
                    handleTaskFieldChange('statusId', e.target.value)
                  }
                  value={selectedTask.column}
                  options={gstatusName}
                  labelColor="text-black"
                  valueProp="statusId"
                  labelProp="statusName"
                />

                <SelectCustom
                  label="Priority"
                  name="priorityId"
                  handleChange={e =>
                    setSelectedTask({ ...selectedTask, priorityId: e })
                  }
                  value={selectedTask.column}
                  options={gpriority}
                  labelColor="text-black"
                  valueProp="priorityId"
                  labelProp="priority"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <SelectCustom
                  label="Task Type"
                  name="typeId"
                  onChange={handleChange}
                  value={selectedTask.column}
                  options={gtaskType}
                  labelColor="text-black"
                  valueProp="id"
                  labelProp="taskType"
                />
                <div>
                  <label
                    className="block text-lg font-semibold text-black mb-2"
                    htmlFor=""
                  >
                    Assignees
                  </label>

                  <TreeSelect
                    showSearch
                    style={{ width: '100%' }}
                    value={selectedTask.assignees.map(user => user.name)}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="Vui lòng chọn thành viên"
                    allowClear
                    multiple
                    treeDefaultExpandAll
                    onChange={value => {
                      const updatedAssignees = userAsign.filter(user =>
                        value.includes(user.name)
                      );
                      setSelectedTask(prev => ({
                        ...prev,
                        assignees: updatedAssignees,
                      }));
                    }}
                    filterTreeNode={(input, node) =>
                      node.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    treeData={userAsign.map(user => ({
                      title: user.name,
                      value: user.name,
                    }))}
                  />
                </div>
              </div>

              <EditorTiny
                name="description"
                handleChange={value =>
                  setSelectedTask(prevTask => ({
                    ...prevTask,
                    description: value,
                  }))
                }
                value={selectedTask.description}
              />

              <div className="mt-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white px-5 py-2 rounded-md w-full text-center"
                  type="submit"
                >
                  Update Task
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProjectDetail;
