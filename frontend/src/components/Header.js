import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 1rem 0;
  margin-bottom: 2rem;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d1d1f;
  text-decoration: none;
`;

const NavLink = styled(Link)`
  margin-left: 1rem;
  color: #1d1d1f;
  text-decoration: none;
  &:hover {
    color: #0066cc;
  }
`;

function Header() {
  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">PDF Calendar App</Logo>
        <div>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/events">Events</NavLink>
        </div>
      </Nav>
    </HeaderContainer>
  );
}

export default Header;