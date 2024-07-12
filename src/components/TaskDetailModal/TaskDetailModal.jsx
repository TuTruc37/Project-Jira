import React, { useState, useEffect } from 'react';
import { Modal, Input, TreeSelect, Button } from 'antd';
import SelectCustom from './../SelectCustom/SelectCustom'; // Giả sử bạn đã tạo một component SelectCustom
import EditorTiny from './../EditorTiny'; // Giả sử bạn đã tạo một component EditorTiny
import axios from 'axios'; // Hoặc http từ thư viện của bạn

const { TextArea } = Input;

const TaskDetailModal = ({
  taskModalOpen,
  handleOk,
  handleCancel,
  selectedTaskId,
  setFieldValue,
  handleChange,
  gstatusName,
  gpriority,
  gtaskType,
  userAsign,
  setSelectedTask
}) => {
  const [selectedTask, setSelectedTaskState] = useState(null);

  useEffect(() => {
    if (selectedTaskId) {
      getTaskDetails(selectedTaskId);
    }
  }, [selectedTaskId]);

  const getTaskDetails = async (taskId) => {
    try {
      const response = await axios.get(/Project/getTaskDetail?taskId=${taskId});
      setSelectedTaskState(response.data);
    } catch (error) {
      console.error('Failed to fetch task details:', error);
    }
  };

  return (
    <Modal
      title="Task Detail"
      width={1000}
      visible={taskModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      {selectedTask && (
        <div>
          <h3 className="mb-4">{selectedTask.content}</h3>

          <div className="grid grid-cols-2 gap-5">
            {/* cột 1 */}
            <div>
              <EditorTiny
                name="description"
                handleChange={value => setFieldValue('description', value)} // Cập nhật giá trị cho formik
                value={selectedTask.description}
              />
              <label htmlFor="comment" className="text-lg font-semibold">
                Comment
              </label>
              <div>
                <TextArea
                  onResize={null}
                  placeholder="Thêm bình luận"
                  className="mt-2 text-area"
                ></TextArea>
                <div className="mt-2 space-x-2">
                  <Button type="primary" className="py-1 px-4 font-medium rounded-sm">
                    Save
                  </Button>
                  <Button className="py-1 px-4 font-medium rounded-sm">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
            {/* cột 2 */}
            <div>
              <div className="kanban-task-assignees">
                <SelectCustom
                  label="Status"
                  name="statusId"
                  handleChange={handleChange}
                  value={selectedTask.statusId}
                  options={gstatusName} // Truyền danh sách trạng thái từ API vào options
                  labelColor="text-black"
                  valueProp="statusId"
                  labelProp="statusName"
                />
                <SelectCustom
                  label="Priority"
                  name="priorityId"
                  handleChange={handleChange}
                  value={selectedTask.priorityId}
                  options={gpriority} // Truyền danh sách độ ưu tiên từ API vào options
                  labelColor="text-black"
                  valueProp="priorityId"
                  labelProp="priority"
                />
                <SelectCustom
                  label="Task Type"
                  name="typeId"
                  handleChange={handleChange}
                  value={selectedTask.typeId}
                  options={gtaskType} // Truyền danh sách loại nhiệm vụ từ API vào options
                  labelColor="text-black"
                  valueProp="id"
                  labelProp="taskType"
                />
                <div className="flex flex-wrap">
                  <label htmlFor="assignees" className="text-lg font-semibold">
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
                      setSelectedTaskState(prev => ({
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
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TaskDetailModal;