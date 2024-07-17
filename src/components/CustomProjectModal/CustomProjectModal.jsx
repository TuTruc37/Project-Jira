import React, { useEffect, useState } from 'react';
import { Modal as AntdModal, Input, Button, message, Select } from 'antd';
import TextEditor from '../TextEditor/TextEditor';
import { projectMan } from '../../services/projectMan';
import EditorTiny from '../EditorTiny/EditorTiny';

const { Option } = Select;

const CustomProjectModal = ({
  visible,
  onCancel,
  projectId,
  onProjectUpdated,
}) => {
  const [projectDetails, setProjectDetails] = useState({
    id: 0,
    projectName: '',
    creator: 0,
    description: '',
    projectCategory: '',
  });
  // khi bấm sửa (save) thì reload lại
  function Main_reload() {
    setInterval(function () {
      window.location.reload();
    }, 2000);
  }
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (projectId) {
      projectMan
        .getProjectDetails(projectId)
        .then(res => {
          const projectData = res.data.content;
          console.log(projectData);
          setProjectDetails({
            id: projectData.id,
            projectName: projectData.projectName,
            creator: projectData.creator.id, // Lấy creator.id từ dữ liệu
            description: projectData.description,
            projectCategory: projectData.projectCategory, // đây là dữ liệu đã được tạo sẵn
          });
        })
        .catch(err => {
          console.error('Lỗi tải chi tiết dự án:', err);
          message.error('Lỗi tải chi tiết dự án');
        });
    }

    projectMan
      .getProjectCategory()
      .then(res => {
        const categoriesData = res.data.content;
        setCategories(categoriesData);
      })
      .catch(err => {
        console.error('Lỗi khi tải danh mục dự án:', err);
        message.error('Lỗi khi tải danh mục dự án');
      });
  }, [projectId]);

  const handleSave = () => {
    console.log('Lưu chi tiết dự án:', projectDetails);

    // Ensure all required fields are filled
    if (
      !projectDetails.projectName ||
      !projectDetails.projectCategory ||
      !projectDetails.description
    ) {
      message.error('Vui lòng điền vào tất cả các trường bắt buộc.');
      return;
    }

    // Update project details via API call
    projectMan
      .updateProject(projectDetails.id, projectDetails)
      .then(res => {
        console.log('Phản hồi API:', res);
        message.success('Dự án được cập nhật thành công');
        if (onProjectUpdated) {
          onProjectUpdated();
        }
        Main_reload();
        onCancel();
      })
      .catch(err => {
        console.error('Lỗi cập nhật dự án:', err);
        message.error('Đây là dự án của người khác, bạn không thể sửa được!!!');
      });
  };

  const handleChange = (field, value) => {
    console.log(value);
    console.log(field);
    setProjectDetails({
      ...projectDetails,
      [field]: value,
    });
  };
  return (
    <div className="space-y-5">
      <AntdModal
      // loading={loading}
        title="Edit Project"
        visible={visible}
        onCancel={onCancel}
        width={1000}
        footer={
          <Button className="mt-10" type="primary" onClick={handleSave}>
            Save
          </Button>
        }
      >
        <div className="flex justify-between w-full">
          <div className="w-[30%] space-y-2">
            <label className="font-semibold">ID</label>
            <Input
              style={{ color: 'black' }}
              value={projectDetails.id}
              onChange={e => handleChange('id', e.target.value)}
              disabled
            />
          </div>
          <div className="w-[30%] space-y-2">
            <label className="font-semibold">Project Name</label>
            <Input
              value={projectDetails.projectName}
              onChange={e => handleChange('projectName', e.target.value)}
            />
          </div>
          <div className="w-[30%] flex flex-col space-y-2">
            <label className="font-semibold">Project Category</label>
            <Select
              value={
                projectDetails.projectCategory.name
                  ? projectDetails.projectCategory.name
                  : projectDetails.projectCategory.value
              }
              onChange={(value, option) => {
                return handleChange('projectCategory', option);
              }}
              // onChange={value => {
              //   handleChange('projectCategory', value);
              // }}
              placeholder="Select Category"
            >
              {categories.map(category => (
                <Option key={category.id} value={category.projectCategoryName}>
                  {category.projectCategoryName}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div className="mt-4">
          {/* <TextEditor
            value={projectDetails.description}
            onChange={value => handleChange('description', value)}
          /> */}
          <EditorTiny
            value={projectDetails.description}
            handleChange={value => handleChange('description', value)}
          />
        </div>
        <div className=""></div>
      </AntdModal>
    </div>
  );
};

export default CustomProjectModal;
