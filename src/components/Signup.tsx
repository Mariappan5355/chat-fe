import React, { useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };


  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('Please enter all the details');
      return;
    }

    try {
      await signup(username, email, password);
      setError('');
      navigate('/login');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Sign up failed. Please try again.');
      }
    }
  };

  return (
    <Row className="vh-100">
      <Col md={6} className="d-flex justify-content-center align-items-center">
        <Form onSubmit={handleSubmit} className="w-75">
          <h2 className="mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group controlId="formName" className="mb-4">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter the name"
              value={username}
              onChange={handleUserNameChange}
            />
          </Form.Group>
          <Form.Group controlId="formBasicEmail" className="mb-4">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={handleEmailChange}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword" className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="col-2 ml-5">
            Submit
          </Button>
        </Form>
      </Col>
      <Col md={6} className="p-0">
        <img src="images/login.avif" alt="Sign Up" className="img-fluid vh-100" />
      </Col>
    </Row>
  );
};

export default Signup;
