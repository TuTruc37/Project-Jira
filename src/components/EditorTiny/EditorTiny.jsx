import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './editorTiny.scss';

const EditorTiny = ({ value, handleChange }) => {
  return (
    <Editor
      value={value}
      apiKey="hps86wiugt0czru5hl76286ostqmiw59ph7m5jlswxubnwvd"
      init={{
        height: 300,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | help',
      }}
      onEditorChange={(content) => handleChange(content)}
    />
  );
};

export default EditorTiny;
