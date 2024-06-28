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
    id: '',
    projectName: '',
    projectCategory: { id: '', name: '' },
    description: '',
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (projectId) {
      projectMan
        .getProjectDetails(projectId)
        .then(res => {
          const projectData = res.data.content;
          setProjectDetails({
            id: projectData.id,
            projectName: projectData.projectName,
            projectCategory: projectData.projectCategory,
            description: projectData.description,
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
      !projectDetails.projectCategory.id ||
      !projectDetails.description
    ) {
      message.error('Please fill out all required fields.');
      return;
    }

    // Update project details via API call
    projectMan
      .updateProject(projectDetails.id, projectDetails)
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
    if (field === 'projectCategoryName') {
      const selectedCategory = categories.find(
        category => category.projectCategoryName === value
      );
      console.log('Selected category:', selectedCategory);
      setProjectDetails({
        ...projectDetails,
        projectCategory: {
          id: selectedCategory.id,
          name: selectedCategory.projectCategoryName,
        },
      });
    } else {
      console.log('Field:', field, 'Value:', value);
      setProjectDetails({
        ...projectDetails,
        [field]: value,
      });
    }
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
              value={projectDetails.projectCategory.name}
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
