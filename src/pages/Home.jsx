import { useContext } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Container className="fade-in">
      <Row className="justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <Col md={8} className="text-center">
          <h1 className="mb-4">Track Your Daily Journey</h1>
          <p className="lead mb-4">
            A simple way to record your thoughts, activities, and mood each day.
            Build a beautiful timeline of your life, one day at a time.
          </p>
          
          {isAuthenticated ? (
            <Button 
              as={Link} 
              to="/dashboard" 
              variant="primary" 
              size="lg"
              className="px-4 py-2"
            >
              Go to Dashboard
            </Button>
          ) : (
            <div>
              <Button 
                as={Link} 
                to="/register" 
                variant="primary" 
                size="lg"
                className="px-4 py-2 me-3"
              >
                Sign Up
              </Button>
              <Button 
                as={Link} 
                to="/login" 
                variant="outline-primary" 
                size="lg"
                className="px-4 py-2"
              >
                Login
              </Button>
            </div>
          )}
        </Col>
      </Row>
      
      <Row className="mt-5 mb-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <div className="mb-3" style={{ fontSize: '2rem' }}>📝</div>
              <Card.Title>Daily Updates</Card.Title>
              <Card.Text>
                Record your thoughts, activities, and experiences with just a few clicks.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <div className="mb-3" style={{ fontSize: '2rem' }}>📅</div>
              <Card.Title>Calendar View</Card.Title>
              <Card.Text>
                Visualize your journey with a beautiful calendar showing all your entries.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <div className="mb-3" style={{ fontSize: '2rem' }}>🔍</div>
              <Card.Title>Track Progress</Card.Title>
              <Card.Text>
                Look back on your journey and see how far you've come.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;