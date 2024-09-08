import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const UploadContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
`;

const UploadForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  background-color: #0071e3;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0077ed;
  }
`;

const FileName = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #86868b;
`;

const UploadButton = styled.button`
  background-color: #34c759;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  margin-top: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #30b754;
  }

  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('pdfFile', file);

    try {
      setUploadStatus('Uploading...');
      const response = await axios.post('http://localhost:5001/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadStatus('File uploaded successfully!');
      console.log(response.data);
    } catch (error) {
      setUploadStatus('Error uploading file.');
      console.error('Error uploading file:', error);
    }
  };

  return (
    <UploadContainer>
      <UploadForm onSubmit={handleSubmit}>
        <FileInput type="file" id="file" onChange={handleFileChange} accept=".pdf" />
        <FileInputLabel htmlFor="file">Choose PDF File</FileInputLabel>
        {file && <FileName>{file.name}</FileName>}
        <UploadButton type="submit" disabled={!file}>
          Upload and Process
        </UploadButton>
      </UploadForm>
      {uploadStatus && <p>{uploadStatus}</p>}
    </UploadContainer>
  );
}

export default FileUpload;