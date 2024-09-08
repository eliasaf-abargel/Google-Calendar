import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import EventItem from './EventItem';

const EventListContainer = styled.div`
  display: grid;
  gap: 1rem;
`;

function EventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <EventListContainer>
      {events.map((event) => (
        <EventItem key={event.id} event={event} />
      ))}
    </EventListContainer>
  );
}

export default EventList;