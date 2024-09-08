import React from 'react';
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
  return (
    <Router>
      <GlobalStyles />
      <AppContainer>
        <Header />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/events" component={EventsPage} />
        </Switch>
      </AppContainer>
    </Router>
  );
}

export default App;