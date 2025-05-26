import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import UpdateCard from '../components/updates/UpdateCard';
import UpdateEditModal from '../components/updates/UpdateEditModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const UpdateHistory = () => {
  const [updates, setUpdates] = useState([]);
  const [filteredUpdates, setFilteredUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUpdate, setCurrentUpdate] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [allTags, setAllTags] = useState([]);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get('/api/updates');
      setUpdates(res.data);
      setFilteredUpdates(res.data);
      
      // Extract all unique tags
      const tags = new Set();
      res.data.forEach(update => {
        if (update.tags && update.tags.length) {
          update.tags.forEach(tag => tags.add(tag));
        }
      });
      setAllTags(Array.from(tags));
      
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

  useEffect(() => {
    // Filter updates based on search term and tag
    let filtered = updates;
    
    if (searchTerm) {
      filtered = filtered.filter(update => 
        update.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterTag) {
      filtered = filtered.filter(update => 
        update.tags && update.tags.includes(filterTag)
      );
    }
    
    setFilteredUpdates(filtered);
  }, [searchTerm, filterTag, updates]);

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

  const resetFilters = () => {
    setSearchTerm('');
    setFilterTag('');
  };

  return (
    <Container className="fade-in">
      <h1 className="page-heading">Update History</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {deleteSuccess && <Alert variant="success">Update deleted successfully!</Alert>}
      
      <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <Form.Control
            type="text"
            placeholder="Search updates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        
        <Col md={4} className="mb-3 mb-md-0">
          <Form.Select 
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
          >
            <option value="">Filter by tag</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </Form.Select>
        </Col>
        
        <Col md={2}>
          <Button 
            variant="outline-secondary" 
            className="w-100" 
            onClick={resetFilters}
          >
            Reset
          </Button>
        </Col>
      </Row>
      
      {loading ? (
        <LoadingSpinner />
      ) : filteredUpdates.length > 0 ? (
        filteredUpdates.map(update => (
          <UpdateCard 
            key={update._id} 
            update={update} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <Alert variant="info">
          No updates found.
        </Alert>
      )}
      
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

export default UpdateHistory;