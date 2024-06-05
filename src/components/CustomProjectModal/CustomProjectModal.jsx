import React from 'react';
import { Modal as AntdModal } from 'antd';
import InputCustom from '../Input/InputCustom';

const CustomProjectModal = ({ visible, onCancel, projectId }) => {
  return (
    <AntdModal
      title={
        <div className="mb-10">
          <h2 className="text-2xl">Edit Project</h2>
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      width={1000}
      footer={
        <div>
          <button
            onClick={() => {}}
            className="py-2 px-4 bg-blue-500 rounded text-white"
            type="button"
          >
            Cập nhật
          </button>
        </div>
      } // Để loại bỏ footer mặc định của Modal
    >
      <div className="flex justify-between w-[full]">
        <div className="w-[30%] outline-none border-none ">
          <InputCustom label="ID" />
        </div>
        <div className="w-[30%]">
          <InputCustom label={'Project Name'} />
        </div>
        <div className="w-[30%]">
          <InputCustom label={'Category'} />
        </div>
      </div>
    </AntdModal>
  );
};

export default CustomProjectModal;
