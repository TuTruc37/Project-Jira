// hàm đưa dữ liệu lên
export const handleGetValueLocalStore = key => {
  const localString = localStorage.getItem(key);
  return localString ? JSON.parse(localString) : null;
};
// hàm lấy dữ liệu
export const handleSetValueLocalStore = (key, data) => {
  const dataString = JSON.stringify(data);
  localStorage.setItem(key, dataString);
};
