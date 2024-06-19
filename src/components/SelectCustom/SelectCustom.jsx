import React from 'react';

const SelectCustom = ({
  label,
  name,
  handleChange,
  value,
  options,
  labelColor,
  valueProp,
  labelProp,
}) => {
  return (
    <div className="">
      <div className="form-group mt-14 ">
        <label className={`block mb-2 font-medium mt-12 ${labelColor} text-lg`}>
          {label}
        </label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
          name={name}
          value={value}
          onChange={handleChange}
        >
          <option value="" label="Chọn danh mục dự án" />
          {options.map(option => (
            <option key={option[valueProp]} value={option[valueProp]}>
              {option[labelProp]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectCustom;
