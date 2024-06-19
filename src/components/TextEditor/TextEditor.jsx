import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TextEditor = ({ value, onChange }) => {
  return (
    <div>
      <ReactQuill
        className="h-40"
        theme="snow"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default TextEditor;
