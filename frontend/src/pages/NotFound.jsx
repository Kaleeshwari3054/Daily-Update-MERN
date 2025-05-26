import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container className="text-center fade-in">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="my-5">
            <h1 style={{ fontSize: '5rem' }}>404</h1>
            <h2 className="mb-4">Page Not Found</h2>
            <p className="lead mb-4">
              The page you are looking for does not exist or has been moved.
            </p>
            <Button as={Link} to="/" variant="primary" size="lg">
              Go Home
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;