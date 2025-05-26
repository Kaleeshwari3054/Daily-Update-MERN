import { Card, Badge, Button } from 'react-bootstrap';
import { useState } from 'react';

const UpdateCard = ({ update, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card 
      className="update-card mb-3" 
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="d-flex align-items-center mb-2">
              {update.mood && (
                <span className="mood-emoji" title="Mood">
                  {update.mood}
                </span>
              )}
              <Card.Title className="mb-0">
                {formatDate(update.date)}
              </Card.Title>
            </div>
          </div>
          
          {showActions && (
            <div>
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="me-2"
                onClick={() => onEdit(update)}
              >
                Edit
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => onDelete(update._id)}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
        
        <Card.Text className="my-3">
          {update.text}
        </Card.Text>
        
        {update.tags && update.tags.length > 0 && (
          <div>
            {update.tags.map((tag, index) => (
              <Badge 
                key={index} 
                bg="light" 
                text="dark" 
                className="me-2"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default UpdateCard;