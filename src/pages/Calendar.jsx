import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import axios from 'axios';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Calendar = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const fetchUpdatesForMonth = async () => {
    try {
      setLoading(true);
      
      // Calculate first and last day of the month
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      // Format dates for API
      const startDate = firstDay.toISOString().split('T')[0];
      const endDate = lastDay.toISOString().split('T')[0];
      
      // Fetch updates for the date range
      const res = await axios.get(`/api/updates/range?startDate=${startDate}&endDate=${endDate}`);
      setUpdates(res.data);
    } catch (err) {
      setError('Failed to load calendar data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUpdatesForMonth();
  }, [currentMonth]);
  
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Add day names
    dayNames.forEach(day => {
      days.push(
        <Col key={`header-${day}`} className="text-center">
          <div className="fw-bold py-2">{day}</div>
        </Col>
      );
    });
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<Col key={`empty-${i}`}><div className="calendar-day empty"></div></Col>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      
      // Find updates for this day
      const dayUpdates = updates.filter(update => {
        const updateDate = new Date(update.date);
        return updateDate.getDate() === day && 
               updateDate.getMonth() === month && 
               updateDate.getFullYear() === year;
      });
      
      days.push(
        <Col key={dateString}>
          <div className={`calendar-day ${dayUpdates.length > 0 ? 'has-update' : ''}`}>
            <div className="calendar-day-header">{day}</div>
            {dayUpdates.map(update => (
              <div key={update._id} className="small">
                {update.mood && <span>{update.mood} </span>}
                <span className="text-truncate d-inline-block" style={{ maxWidth: '100%' }}>
                  {update.text.length > 20 ? `${update.text.substring(0, 20)}...` : update.text}
                </span>
              </div>
            ))}
          </div>
        </Col>
      );
    }
    
    // Group days into rows
    const rows = [];
    for (let i = 0; i < days.length; i += 7) {
      rows.push(
        <Row key={`row-${i}`} className="g-1 mb-1">
          {days.slice(i, i + 7)}
        </Row>
      );
    }
    
    return rows;
  };
  
  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  if (loading && !updates.length) {
    return <LoadingSpinner />;
  }
  
  return (
    <Container className="fade-in">
      <h1 className="page-heading">Calendar View</h1>
      
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button 
              className="btn btn-outline-primary" 
              onClick={previousMonth}
            >
              &lt; Previous
            </button>
            
            <h3 className="mb-0">{formatMonth(currentMonth)}</h3>
            
            <button 
              className="btn btn-outline-primary" 
              onClick={nextMonth}
            >
              Next &gt;
            </button>
          </div>
          
          {renderCalendar()}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Calendar;