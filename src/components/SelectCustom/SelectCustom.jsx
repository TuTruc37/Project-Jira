import React from 'react';

const SelectCustom = ({
  label,
  name,
  handleChange,
  value,
  options,
  labelColor,
}) => {
  return (
    <div className="form-group ">
      <label className={`block mb-2 font-medium mt-12 ${labelColor} text-lg`}>{label}</label>
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
        name={name}
        value={value}
        onChange={handleChange}
      >
       
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.projectCategoryName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectCustom;
