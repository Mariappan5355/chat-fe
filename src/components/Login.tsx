import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { getUser, login } from '../api/auth';
import { useNavigate } from 'react-router-dom';


const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        let user = await getUser();
        if (user) {
          navigate('/dashboard');
        }
      } catch (err) {
        console.log(err);
      }
    };

    checkUser();
  }, [navigate]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }


    try {
      await login(email, password);
      setError('');
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <Row className="vh-100">
      <Col md={6} className="d-flex justify-content-center align-items-center">
        <Form onSubmit={handleSubmit} className="w-75">
          <h2 className="mb-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
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
          <div className="mb-4 d-flex align-items-center justify-content-between">
            <Button variant="primary" type="submit" className="col-2 ml-5">
              Submit
            </Button>
            <div className="flex-end">
              Don't have an account? <a href="/signup">Sign Up</a>
            </div>
          </div>
        </Form>
      </Col>
      <Col md={6} className="p-0">
        <img src="images/login.avif" alt="Login" className="img-fluid" />
      </Col>
    </Row>
  );
};

export default Login;
