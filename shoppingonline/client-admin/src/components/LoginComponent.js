import axios from 'axios';
import React, { Component } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import MyContext from '../contexts/MyContext';
import './LoginComponent.css';

class Login extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: ''
    };
  }
  render() {
    if (this.context.token === '') {
      return (
        <Container fluid className="login-container">
          <Row className="justify-content-center align-items-center vh-100">
            <Col xs={12} md={6} lg={4}>
              <Form className="login-form">
                <h2 className="text-center mb-4">ADMIN LOGIN</h2>
                
                <Form.Group controlId="formUsername">
                  <Form.Label style={{color: 'white'}}>Username:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your username"
                    value={this.state.txtUsername}
                    onChange={(e) => this.setState({ txtUsername: e.target.value })}
                  />
                </Form.Group>

                <Form.Group controlId="formPassword">
                  <Form.Label style={{color: 'white'}}>Password:</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={this.state.txtPassword}
                    onChange={(e) => this.setState({ txtPassword: e.target.value })}
                  />
                  </Form.Group>
                  
                  <div className="d-grid gap-2">
                    <Button
                      variant="secondary" size="lg"
                      type="submit"
                      onClick={(e) => this.btnLoginClick(e)}
                      className="login-button login-btn"
                    >
                    LOGIN
                    </Button>
                  </div>
                
              </Form>
            </Col>
          </Row>
        </Container>
      );
    }

    return <div />;
  }
  // event-handlers
  btnLoginClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    if (username && password) {
      const account = { username: username, password: password };
      this.apiLogin(account);
    } else {
      alert('Please input username and password');
    }
  }
  // apis
  apiLogin(account) {
    axios.post('/api/admin/login', account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setUsername(account.username);
      } else {
        alert(result.message);
      }
    });
  }
}
export default Login;