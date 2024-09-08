import React from 'react';
import styled from 'styled-components';

const EventItemContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
`;

const EventTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #1d1d1f;
`;

const EventDetails = styled.p`
  font-size: 0.9rem;
  color: #86868b;
  margin: 0.25rem 0;
`;

function EventItem({ event }) {
  return (
    <EventItemContainer>
      <EventTitle>{event.title}</EventTitle>
      <EventDetails>Date: {new Date(event.date).toLocaleDateString()}</EventDetails>
      <EventDetails>Time: {event.time}</EventDetails>
      {event.lecturer && <EventDetails>Lecturer: {event.lecturer}</EventDetails>}
    </EventItemContainer>
  );
}

export default EventItem;