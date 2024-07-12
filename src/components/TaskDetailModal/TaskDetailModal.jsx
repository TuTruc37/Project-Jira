import React from 'react';
import { Modal } from 'antd';






const TaskDetailModal = ({ visible, onClose, task }) => {
  if (!task) return null;

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      title={task.content}
    >
    
      <p><strong>Task Name:</strong> {task.content}</p>
      <p><strong>Task Type:</strong> {task.taskType}</p>
      <p><strong>Priority:</strong> {task.priority}</p>
      <p><strong>Assignees:</strong></p>
      <div className="flex flex-wrap gap-y-2 mt-2 justify-end">
        {task.assignees.map(assignee => (
          <div key={assignee.id} className="flex items-center space-x-2">
            <img src={assignee.avatar} alt={assignee.name} className="w-7 h-7 rounded-full mr-2" />
            <span>{assignee.name}</span>
          </div>
        ))}
      </div>
      {/* Add more details as needed */}
    </Modal>
  );
};

export default TaskDetailModal;
