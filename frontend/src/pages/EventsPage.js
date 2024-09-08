import React from 'react';
import styled from 'styled-components';
import EventList from '../components/EventList';

const EventsPageContainer = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #1d1d1f;
`;

function EventsPage() {
  return (
    <EventsPageContainer>
      <Title>Your Calendar Events</Title>
      <EventList />
    </EventsPageContainer>
  );
}

export default EventsPage;