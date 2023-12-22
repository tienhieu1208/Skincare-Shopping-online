import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Link } from 'react-router-dom';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';

class Menu extends Component {
  static contextType = MyContext; // using this.context to access global state
  render() {
    return (
      <Navbar data-bs-theme="dark" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Link} to="/admin/home">HHL</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/admin/home">HOME</Nav.Link>
            <Nav.Link as={Link} to="/admin/category">CATEGORY</Nav.Link>
            <Nav.Link as={Link} to="/admin/product">PRODUCT</Nav.Link>
            <Nav.Link as={Link} to="/admin/order">ORDER</Nav.Link>
            <Nav.Link as={Link} to="/admin/customer">CUSTOMER</Nav.Link>
          </Nav>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
            Hello <b>{this.context.username}</b> | <Button variant="outline-light" as={Link} to="/admin/home" onClick={() => this.lnkLogoutClick()}>Logout</Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
  // event-handlers
  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setUsername('');
  }
}
export default Menu;