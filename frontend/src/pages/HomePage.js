import React from 'react';
import styled from 'styled-components';
import FileUpload from '../components/FileUpload';

const HomeContainer = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #86868b;
  margin-bottom: 2rem;
`;

function HomePage() {
  return (
    <HomeContainer>
      <Title>Welcome to PDF Calendar App</Title>
      <Subtitle>Upload your PDF schedule and we'll add it to your calendar</Subtitle>
      <FileUpload />
    </HomeContainer>
  );
}

export default HomePage;