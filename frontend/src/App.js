import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

function App() {
  const [isGoogleAuthorized, setIsGoogleAuthorized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGoogleApi = () => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', initClient);
      };
      script.onerror = () => setError('Failed to load Google API');
      document.body.appendChild(script);
    };

    const initClient = () => {
      window.gapi.client.init({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scope: 'https://www.googleapis.com/auth/calendar.readonly'
      }).then(() => {
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
      }).catch(err => {
        setError('Error initializing Google API client');
        console.error('Error initializing Google API client:', err);
      });
    };

    const updateSigninStatus = (isSignedIn) => {
      setIsGoogleAuthorized(isSignedIn);
    };

    loadGoogleApi();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Router>
      <GlobalStyles />
      <AppContainer>
        <Header isGoogleAuthorized={isGoogleAuthorized} />
        <Switch>
          <Route exact path="/" render={(props) => <HomePage {...props} isGoogleAuthorized={isGoogleAuthorized} />} />
          <Route path="/events" render={(props) => <EventsPage {...props} isGoogleAuthorized={isGoogleAuthorized} />} />
        </Switch>
      </AppContainer>
    </Router>
  );
}

export default App;