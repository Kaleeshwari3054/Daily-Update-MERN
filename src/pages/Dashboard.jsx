import { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import DailyUpdateForm from '../components/updates/DailyUpdateForm';
import UpdateCard from '../components/updates/UpdateCard';
import UpdateEditModal from '../components/updates/UpdateEditModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUpdate, setCurrentUpdate] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get('/api/updates');
      
      // Only show the most recent 5 updates
      setUpdates(res.data.slice(0, 5));
    } catch (err) {
      setError('Failed to load updates. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const handleEdit = (update) => {
    setCurrentUpdate(update);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/updates/${id}`);
      
      // Remove from state
      setUpdates(updates.filter(update => update._id !== id));
      
      // Show success message
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 3000);
    } catch (err) {
      setError('Failed to delete update');
      console.error(err);
    }
  };

  return (
    <Container className="fade-in">
      <h1 className="page-heading">Dashboard</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {deleteSuccess && <Alert variant="success">Update deleted successfully!</Alert>}
      
      <Row>
        <Col lg={6} className="mb-4">
          <DailyUpdateForm onUpdateAdded={fetchUpdates} />
        </Col>
        
        <Col lg={6}>
          <h3 className="mb-3">Recent Updates</h3>
          
          {loading ? (
            <LoadingSpinner />
          ) : updates.length > 0 ? (
            updates.map(update => (
              <UpdateCard 
                key={update._id} 
                update={update} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <Alert variant="info">
              No updates yet. Create your first daily update!
            </Alert>
          )}
        </Col>
      </Row>
      
      {showEditModal && (
        <UpdateEditModal 
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          update={currentUpdate}
          onUpdateEdited={fetchUpdates}
        />
      )}
    </Container>
  );
};

export default Dashboard;