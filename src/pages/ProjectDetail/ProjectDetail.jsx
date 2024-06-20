import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { projectMan } from '../../services/projectMan';

const ProjectDetail = () => {
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectId = 15644; // Chỉ định ID dự án của bạn
    projectMan.getProjectDetails(projectId).then((response) => {
      const project = response.data.content;

      if (!project || !project.lstTask) {
        console.error("Project or lstTask not found in response");
        setLoading(false);
        return;
      }

      // Extract tasks from lstTask and lstTaskDeTail
      const newTasks = [];
      const newColumns = {};

      project.lstTask.forEach(column => {
        const columnId = `column-${column.statusId}`;
        const taskIds = column.lstTaskDeTail.map(task => {
          const taskId = `task-${task.taskId}`;
          newTasks.push({
            id: taskId,
            content: task.taskName,
            column: columnId,
          });
          return taskId;
        });

        newColumns[columnId] = {
          id: columnId,
          title: column.statusName,
          taskIds: taskIds,
        };
      });

      setTasks(newTasks);
      setColumns(newColumns);
      setLoading(false);
    }).catch(error => {
      console.error("Error fetching project details:", error);
      setLoading(false);
    });
  }, []);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ProjectDetail">
      <h1 className="text-center text-2xl font-bold pb-20">Kanban Board</h1>
      <div className="grid grid-cols-4 gap-5 shadow-2xl">
        <DragDropContext onDragEnd={handleDragEnd}>
          {Object.values(columns).map(column => (
            <Droppable key={column.id} droppableId={column.id}>
              {provided => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="column divide-y p-5 bg-gray-400 text-center"
                >
                  <h2>{column.title}</h2>
                  {column.taskIds.map((taskId, index) => {
                    const task = tasks.find(task => task.id === taskId);
                    if (!task) return null;

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
                            className="task p-5 bg-white"
                          >
                            {task.content}
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
