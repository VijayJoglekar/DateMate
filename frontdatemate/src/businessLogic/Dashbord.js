import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import qs from 'qs';
import "./dashbord.css";

export default function Dashbord() {
    const [searchEvent, setSearchEvent] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [addeventstatus, setEventStatus] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    
    const navigate = useNavigate(); 

    const addevent = async (e) => {
        e.preventDefault();
        const AddEventData = {
            title: title,
            description: description,
            date: date,
            is_recurring: isRecurring,
            token: sessionStorage.getItem("auth_token")
        };
        try {
            const response = await fetch('http://127.0.0.1:8000/addevent/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: qs.stringify(AddEventData),
            });
            if (response.status === 200) {
                setEventStatus('done');
            } else {
                setEventStatus('error');
            }
        } catch (error) {
            alert(error);
        }
    };

    const searchEventHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:8000/searchevents/?query=${searchEvent}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("auth_token")}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data.events || []);
            } else {
                setSearchResults([]);
                alert("Error fetching search results");
            }
        } catch (error) {
            alert(error);
        }
    };

    const fetchAllEvents = async () => {
        navigate('/viewevent')
    };

    const logoutHandler = async () => {
        try {
            const logoutResponse = await fetch('http://127.0.0.1:8000/logout/',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: qs.stringify({token:sessionStorage.getItem("auth_token")}),
            })
            if (logoutResponse.status === 200){
                sessionStorage.removeItem("auth_token"); 
                navigate("/login"); 
            }
        }
        catch(error){
            alert(error)
        }
    };

   

    return (
        <div className="dashboard-container">
            <div className="dash-header">
                <h1>Welcome to DateMate Dashboard</h1>
            </div>

            <div className="dash-maincontainer">
                <div className="search-bar">
                    <form onSubmit={searchEventHandler}>
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchEvent}
                            onChange={(e) => setSearchEvent(e.target.value)}
                        />
                        <button type="submit" className="cta-button">Search</button>
                    </form>
                </div>

                <div className="search-results">
                    <h3>Search Results:</h3>
                    {searchResults.length > 0 ? (
                        <ul>
                            {searchResults.map((event, index) => (
                                <li key={index}>
                                    <strong>{event.title}</strong>: {event.description} on {event.date}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No events found.</p>
                    )}
                </div>

                <div className="add-event-form">
                    <h3>Add New Event</h3>
                    <form onSubmit={addevent}>
                        <label htmlFor="title">Event Title</label>
                        <input
                            type="text"
                            id="title"
                            placeholder="Event Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                        <label htmlFor="description">Event Description</label>
                        <textarea
                            id="description"
                            placeholder="Describe the event"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <label htmlFor="eventDate">Event Date</label>
                        <input
                            type="date"
                            id="eventDate"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />

                        <label htmlFor="isRecurring">Is this event recurring?</label>
                        <input
                            type="checkbox"
                            id="isRecurring"
                            checked={isRecurring}
                            onChange={(e) => setIsRecurring(e.target.checked)}
                        />

                        <button type="submit" className="cta-button">Add Event</button>
                    </form>
                    {addeventstatus === 'done' ? (
                        <p>Event added successfully!</p>
                    ) : addeventstatus === 'error' ? (
                        <p>Error adding event.</p>
                    ) : null}
                </div>

                <div className="action-buttons">
                    <button className="cta-button" onClick={fetchAllEvents}>See All Events</button>
                    {allEvents.length > 0 && (
                        <div className="all-events">
                            <h3>All Events:</h3>
                            <ul>
                                {allEvents.map((event, index) => (
                                    <li key={index}>
                                        <strong>{event.title}</strong>: {event.description} on {event.date}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="action-buttons">
                <button className="cta-button" onClick={logoutHandler}>Logout</button>
                
            </div>
        </div>
    );
}
