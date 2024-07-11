import React, { useEffect, useState } from 'react';
import { Modal as AntdModal, Input, Button, message, Select } from 'antd';
import TextEditor from '../TextEditor/TextEditor';
import { projectMan } from '../../services/projectMan';

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
    projectCategory: '', // categoryId là tên api của cái này
  });
  const [categories, setCategories] = useState([]);
  console.log(categories);

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
            creator: projectData.creator,
            description: projectData.description,
            projectCategory: projectData.categoryId,
          });
        })
        .catch(err => {
          console.error('Error loading project details:', err);
          message.error('Error loading project details');
        });
    }

    projectMan
      .getProjectCategory()
      .then(res => {
        const categoriesData = res.data.content;
        setCategories(categoriesData);
      })
      .catch(err => {
        console.error('Error loading project categories:', err);
        message.error('Error loading project categories');
      });
  }, [projectId]);
  const handleSave = () => {
    console.log('Saving project details:', projectDetails);

    // Ensure all required fields are filled
    if (
      !projectDetails.projectName ||
      !projectDetails.projectCategory ||
      !projectDetails.description
    ) {
      message.error('Please fill out all required fields.');
      return;
    }

    // Update project details via API call
    const requestData = {
      id: projectDetails.id,
      projectName: projectDetails.projectName,
      creator: projectDetails.creator,
      description: projectDetails.description,
      categoryId: projectDetails.projectCategory,
    };

    projectMan
      .updateProject(projectDetails.id, requestData)
      .then(res => {
        console.log('API response:', res);
        message.success('Project updated successfully');
        if (onProjectUpdated) {
          onProjectUpdated();
        }
        onCancel();
      })
      .catch(err => {
        console.error('Error updating project:', err);
        message.error('Error updating project');
      });
  };
  const handleChange = (field, value) => {
    setProjectDetails(prevDetails => ({
      ...prevDetails,
      [field]: value,
    }));
  };
  return (
    <div className="space-y-5">
      <AntdModal
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
              value={projectDetails.projectCategory}
              onChange={value => handleChange('projectCategoryName', value)}
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
          <TextEditor
            value={projectDetails.description}
            onChange={value => handleChange('description', value)}
          />
        </div>
        <div className=""></div>
      </AntdModal>
    </div>
  );
};

export default CustomProjectModal;
