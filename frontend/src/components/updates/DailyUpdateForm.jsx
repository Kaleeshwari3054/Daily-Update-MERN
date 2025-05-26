import { useState, useContext } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const MOOD_EMOJIS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😎', label: 'Cool' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '🤔', label: 'Thoughtful' },
];

const DailyUpdateForm = ({ onUpdateAdded }) => {
  const [text, setText] = useState('');
  const [tags, setTags] = useState('');
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { user } = useContext(AuthContext);

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
      
      await axios.post('/api/updates', updateData);
      
      // Reset form
      setText('');
      setTags('');
      setMood('');
      
      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Notify parent component
      if (onUpdateAdded) {
        onUpdateAdded();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4 fade-in">
      <Card.Body>
        <Card.Title>How was your day, {user?.name}?</Card.Title>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Update added successfully!</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Today's Update</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="What happened today? Share your thoughts, wins, or goals..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Tags (comma-separated)</Form.Label>
            <Form.Control
              type="text"
              placeholder="work, study, family, etc."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <Form.Text className="text-muted">
              Separate tags with commas (e.g., work, study, life)
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>How are you feeling?</Form.Label>
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
          
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
            className="w-100"
          >
            {loading ? 'Saving...' : 'Save Update'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default DailyUpdateForm;