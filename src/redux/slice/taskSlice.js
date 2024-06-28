// taskSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectMan } from '../../services/projectMan';

// Initial state
const initialState = {
  tasks: [],
  columns: {},
  loading: false,
  error: null,
};

// Async thunk for fetching project details
export const fetchProjectDetails = createAsyncThunk(
  'tasks/fetchProjectDetails',
  async (projectId, thunkAPI) => {
    try {
      const response = await projectMan.getProjectDetails(projectId);
      const project = response.data.content;

      // Extract tasks and columns from project details
      const newTasks = [];
      const newColumns = {};

      project.lstTask.forEach((column) => {
        const columnId = `column-${column.statusId}`;
        const taskIds = column.lstTaskDeTail.map((task) => {
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

      return { tasks: newTasks, columns: newColumns };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      const newTask = action.payload;
      state.tasks.push(newTask);
      state.columns[newTask.column].taskIds.push(newTask.id);
    },
    updateTaskState: (state, action) => {
      const { source, destination } = action.payload;

      if (!destination) return;

      const sourceColumn = state.columns[source.droppableId];
      const destinationColumn = state.columns[destination.droppableId];

      // Remove task from source column
      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      const [removed] = sourceTaskIds.splice(source.index, 1);

      // Add task to destination column
      const destinationTaskIds = Array.from(destinationColumn.taskIds);
      destinationTaskIds.splice(destination.index, 0, removed);

      state.columns[source.droppableId].taskIds = sourceTaskIds;
      state.columns[destination.droppableId].taskIds = destinationTaskIds;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.columns = action.payload.columns;
      })
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { addTask, updateTaskState } = tasksSlice.actions;
export default tasksSlice.reducer;
