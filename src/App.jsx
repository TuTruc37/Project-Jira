import { createContext } from 'react';
import UseRouteCustom from './routes/UseRouteCustom';
import viVN from 'antd/lib/locale/vi_VN';
import { message, ConfigProvider } from 'antd';
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
    <ConfigProvider locale={viVN}>
      <AlertContext.Provider value={{ handleAlert }}>
        {contextHolder}
        {myRoutes}
      </AlertContext.Provider>
    </ConfigProvider>
  );
}

export default App;
