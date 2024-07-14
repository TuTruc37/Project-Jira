import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectMan } from '../../services/projectMan';
import { getAllCreateTask } from '../../services/getAllCreateTask';

// Initial state
const initialState = {
  tasks: [],
  columns: {
    'column-backlog': {
      id: 'column-backlog',
      title: 'BACKLOG',
      taskIds: [],
    },
    'column-selected': {
      id: 'column-selected',
      title: 'SELECTED FOR DEVELOPMENT',
      taskIds: [],
    },
    'column-progress': {
      id: 'column-progress',
      title: 'IN PROGRESS',
      taskIds: [],
    },
    'column-done': {
      id: 'column-done',
      title: 'DONE',
      taskIds: [],
    },
  },
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
      const newColumns = {
        'column-backlog': { ...initialState.columns['column-backlog'] },
        'column-selected': { ...initialState.columns['column-selected'] },
        'column-progress': { ...initialState.columns['column-progress'] },
        'column-done': { ...initialState.columns['column-done'] },
      };

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

        if (newColumns[columnId]) {
          newColumns[columnId].taskIds.push(...taskIds);
        }
      });

      return { tasks: newTasks, columns: newColumns };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for creating a task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async ({ projectId, taskData }, thunkAPI) => {
    try {
      const response = await projectMan.createTask(projectId, taskData);
      const newTask = response.data.content;
      return newTask;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Slice
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
    deleteTask: (state, action) => {
      const taskId = action.payload;
      // Remove task from tasks array
      state.tasks = state.tasks.filter(task => task.id !== taskId);

      // Remove task from corresponding column
      Object.keys(state.columns).forEach(columnId => {
        state.columns[columnId].taskIds = state.columns[
          columnId
        ].taskIds.filter(id => id !== taskId);
      });
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProjectDetails.pending, state => {
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
      })
      .addCase(createTask.fulfilled, (state, action) => {
        const newTask = action.payload;
        const taskId = `task-${newTask.taskId}`;
        state.tasks.push({
          id: taskId,
          content: newTask.taskName,
          column: 'column-backlog', // Assuming new tasks go to backlog
        });
        state.columns['column-backlog'].taskIds.push(taskId);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

// Export actions and reducer
export const { addTask, updateTaskState, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
