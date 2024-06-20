// ProjectDetail.jsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { fetchProjectDetails, updateTaskState } from './../../redux/slice/taskSlice';

const ProjectDetail = () => {
  const dispatch = useDispatch();
  const { tasks, columns, loading } = useSelector((state) => state.tasks);

  useEffect(() => {
    const projectId = 15644; // Replace with your actual project ID
    dispatch(fetchProjectDetails(projectId));
  }, [dispatch]);

  const handleDragEnd = (result) => {
    dispatch(updateTaskState(result));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ProjectDetail">
      <h1 className="text-center text-2xl font-bold pb-20">Kanban Board</h1>
      <div className="grid grid-cols-4 gap-5 shadow-2xl">
        <DragDropContext onDragEnd={handleDragEnd}>
          {Object.values(columns).map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="column divide-y p-5 bg-gray-400 text-center"
                >
                  <h2>{column.title}</h2>
                  {column.taskIds.map((taskId, index) => {
                    const task = tasks.find((task) => task.id === taskId);
                    if (!task) return null;

                    return (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
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
