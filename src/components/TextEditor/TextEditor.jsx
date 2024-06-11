import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
const TextEditor = () => {
  const [value, setValue] = useState('');
  return (
    <div>
      <ReactQuill className='h-40' theme="snow" value={value} onChange={setValue} />
    </div>
  );
};

export default TextEditor;
