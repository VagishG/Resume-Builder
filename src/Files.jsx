import React from 'react';

const Files = (props) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && isValidFileType(file)) {
      // Only set the selected image if the file type is valid
      props.setSelectedImage(file);
    } else {
      // You can display an error message or handle the invalid file type
      console.error('Invalid file type selected.');
    }
  };

  const isValidFileType = (file) => {
    // Define the allowed file types using MIME types
    const allowedTypes = props.call;

    // Check if the selected file type is in the list of allowed types
    return allowedTypes.includes(file.type);
  };

  return (
    <div>
      <label htmlFor="imageInput"></label>
      <input
        type="file"
        id="imageInput"
        accept={props.accept}
        onChange={handleFileChange}
      />

      {/* Display the selected image */}
      {props.selectedImage && (
        <div>
          <p>Selected Image:</p>
          <img
            src={URL.createObjectURL(props.selectedImage)}
            alt="Selected"
            style={{ maxWidth: '100%', maxHeight: '200px' }}
          />
        </div>
      )}
    </div>
  );
};

export default Files;
