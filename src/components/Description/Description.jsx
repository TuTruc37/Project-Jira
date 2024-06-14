import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Description = ({ name, handleChange, value }) => {
  return (
    <ReactQuill
      style={{ height: 200 }}
      name={name}
      value={value}
      onChange={handleChange}
    />
  );
};

export default Description;
