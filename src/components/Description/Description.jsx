import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import CSS của react-quill
const Description = ({ name, handleChange, value }) => {
  return <ReactQuill name={name} value={value} onChange={handleChange} />;
};

export default Description;
