import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { projectMan } from './../../services/projectMan'; // Make sure to import your service
import { path } from '../../common/path';
import './projectDetail.scss';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState({});

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
      <h1 className="text-center text-2xl font-bold pb-20">Project Detail</h1>
      <div className="flex justify-end mb-3">
        <NavLink
          to={path.account.createTask}
          className="py-2 hover:text-white px-5 bg-blue-500 text-white font-semibold text-md rounded-md"
        >
          Create task
        </NavLink>
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
                            className="task p-5 bg-white shadow-md rounded-md"
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
                              <div className="flex mt-2 justify-end">
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
