import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slice/userSlice';
import taskSlice from './slice/taskSlice';
export const store = configureStore({
  reducer: {
    user: userSlice,
    tasks: taskSlice, // Đảm bảo tên này trùng với tên bạn sử dụng trong useSelector
  },
});
