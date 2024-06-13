import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import CSS của react-quill

const Description = ({ name, handleChange, value,c }) => {
  return <ReactQuill style={{height:200}} name={name} value={value} onChange={handleChange} />;
};

export default Description;
