// InputProfile.jsx
import React from 'react';

const InputProfile = ({
  label,
  name,
  onBlur,
  type = 'text',
  placeholder,
  error,
  touched,
  className,
  value,
  labelColor,
  onChange,
  readOnly,
}) => {
  const inputValue = value || '';

  const inputClassName = `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 ${
    readOnly ? 'bg-gray-200 cursor-not-allowed' : ''
  }`;

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
        onChange={onChange}
        onBlur={onBlur}
        type={type}
        className={inputClassName}
        placeholder={placeholder}
        value={inputValue}
        readOnly={readOnly}
      />
      {touched && error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default InputProfile;
