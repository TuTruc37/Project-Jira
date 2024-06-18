import React, { useEffect, useState } from 'react';
import { Modal as AntdModal, Input, Button, message, Select } from 'antd';
import TextEditor from '../TextEditor/TextEditor';
import { projectMan } from '../../services/projectMan';

const { Option } = Select;

const CustomProjectModal = ({ visible, onCancel, projectId }) => {
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
          console.error('Error fetching project details:', err);
          message.error('Error fetching project details');
        });
    }

    // Fetch project categories
    projectMan
      .getProjectCategory()
      .then(res => {
        const categoriesData = res.data.content; // Adjust based on your API response structure
        console.log('Fetched categories:', categoriesData); // Check the structure of categoriesData
        setCategories(categoriesData);
      })
      .catch(err => {
        console.error('Error fetching project categories:', err);
        message.error('Error fetching project categories');
      });
  }, [projectId]);

  const handleSave = () => {
    projectMan
      .updateProjectDetails(projectDetails.id, projectDetails)
      .then(res => {
        message.success('Successfully updated project');
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
      setProjectDetails({
        ...projectDetails,
        projectCategory: {
          id: selectedCategory.id,
          name: selectedCategory.projectCategoryName,
        },
      });
    } else {
      setProjectDetails({
        ...projectDetails,
        [field]: value,
      });
    }
  };

  return (
    <div className="space-y-5">
      <AntdModal
        title="Edit Project "
        style={{ fontSize: '48px' }}
        visible={visible}
        onCancel={onCancel}
        width={1000}
        footer={
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        }
      >
        <div className="flex justify-between w-full ">
          <div className="w-[30%]  space-y-2">
            <label className="font-semibold ">ID</label>
            <Input
              style={{ color: 'black' }}
              value={projectDetails.id}
              onChange={e => handleChange('id', e.target.value)}
              disabled
            />
          </div>
          <div className="w-[30%] space-y-2">
            <label className='font-semibold'>Project Name</label>
            <Input
              value={projectDetails.projectName}
              onChange={e => handleChange('projectName', e.target.value)}
            />
          </div>
          <div className="w-[30%] flex flex-col space-y-2">
            <label className='font-semibold'>Project Category</label>
            <Select
              value={projectDetails.projectCategory.name}
              onChange={value => handleChange('projectCategoryName', value)}
              placeholder="Select category"
            >
              {categories.map(category => (
                <Option key={category.id} value={category.projectCategoryName}>
                  {category.projectCategoryName}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div className='mt-4'>
          <TextEditor
            value={projectDetails.description}
            onChange={value => handleChange('description', value)}
          />
        </div>
      </AntdModal>
    </div>
  );
};

export default CustomProjectModal;
