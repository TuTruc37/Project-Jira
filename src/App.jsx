import { createContext } from 'react';
import UseRouteCustom from './routes/UseRouteCustom';

import { message } from 'antd';
export const AlertContext = createContext();
function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const myRoutes = UseRouteCustom();
  const handleAlert = (type, content) => {
    messageApi.open({
      type,
      content,
    });
  };
  return (
    <AlertContext.Provider value={{ handleAlert }}>
      {contextHolder}
      {myRoutes}
    </AlertContext.Provider>
  );
}

export default App;
