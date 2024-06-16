import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ProjectDetail = () => {
  const [tasks, setTasks] = useState([
    { id: 'task1', content: 'Task 1', column: 'column1' },
    { id: 'task2', content: 'Task 2', column: 'column1' },
    { id: 'task3', content: 'Task 3', column: 'column2' },
    { id: 'task4', content: 'Task 4', column: 'column2' },
    { id: 'task5', content: 'Task 5', column: 'column3' },
    { id: 'task6', content: 'Task 6', column: 'column3' },
    { id: 'task7', content: 'Task 7', column: 'column4' },
    { id: 'task8', content: 'Task 8', column: 'column4' },
  ]);

  const [columns, setColumns] = useState({
    column1: {
      id: 'column1',
      title: 'BACKLOG',
      taskIds: ['task1', 'task2'],
    },
    column2: {
      id: 'column2',
      title: 'SELECTED FOR DEVELOPMENT',
      taskIds: ['task3', 'task4'],
    },
    column3: {
      id: 'column3',
      title: 'IN PROGRESS',
      taskIds: ['task5', 'task6'],
    },
    column4: {
      id: 'column4',
      title: 'DONE',
      taskIds: ['task7', 'task8'],
    },
  });

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
