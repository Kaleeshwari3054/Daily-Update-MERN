import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const MOOD_EMOJIS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😎', label: 'Cool' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '🤔', label: 'Thoughtful' },
];

const UpdateEditModal = ({ show, onHide, update, onUpdateEdited }) => {
  const [text, setText] = useState('');
  const [tags, setTags] = useState('');
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (update) {
      setText(update.text || '');
      setTags(update.tags ? update.tags.join(', ') : '');
      setMood(update.mood || '');
    }
  }, [update]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Please enter your update text');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      const updateData = {
        text,
        tags: tagsArray,
        mood,
      };
      
      await axios.put(`/api/updates/${update._id}`, updateData);
      
      onUpdateEdited();
      onHide();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Update</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Update Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Tags (comma-separated)</Form.Label>
            <Form.Control
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Mood</Form.Label>
            <div className="mood-selector">
              {MOOD_EMOJIS.map((item) => (
                <span
                  key={item.label}
                  title={item.label}
                  onClick={() => setMood(item.emoji)}
                  className={mood === item.emoji ? 'selected' : ''}
                >
                  {item.emoji}
                </span>
              ))}
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateEditModal;