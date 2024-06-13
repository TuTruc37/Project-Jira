import React from 'react';

const InputCustom = ({
  label,
  name,
  handleChange,
  handleBlur,
  type = 'text',
  placeholder,
  error,
  touched,
  className,
  value,
  labelColor,
}) => {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className={`block mb-2 font-medium ${labelColor} text-lg`}
      >
        {label}
      </label>
      <input
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        type={type}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
        placeholder={placeholder}
        value={value}
      />
      {touched && error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default InputCustom;
