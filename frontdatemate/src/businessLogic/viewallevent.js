import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import qs from 'qs';
import './viewall.css'

export default function UserEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch events on component mount
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/get_user_events/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: qs.stringify({'token':sessionStorage.getItem("auth_token")}),
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data.events || []);
                } else {
                    const data = await response.json();
                    setError(data.message || 'Error fetching events');
                }
            } catch (error) {
                setError('Error fetching events');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);
    const backToDashboardHandler = () => {
        navigate("/dashbord"); 
    };
    return (
        <div>
            <div className="events-header">
                <h1>Your Events</h1>
            </div>

            <div className="events-container">
                {loading ? (
                    <p>Loading events...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : events.length > 0 ? (
                    <ul>
                        {events.map((event, index) => (
                            <li key={index}>
                                <strong>{event.title}</strong>: {event.description} on {event.date} {event.is_recurring ? '(Recurring)' : ''}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No events found.</p>
                )}

<button className="cta-button" onClick={backToDashboardHandler}>Back to Dashboard</button>
            </div>
        </div>
    );
}
