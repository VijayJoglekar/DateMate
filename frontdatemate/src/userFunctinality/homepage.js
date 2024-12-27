import "./home.css"
import { useNavigate } from "react-router-dom"
export default function HomePage(){
    const navigate = useNavigate()
    return(
        <div>
            <div class="header">
                <h1>Welcome to DateMate</h1>
            </div>

            <div class="hero-section">
                <h2>Your Personal Assistant for Important Dates</h2>
                <p>Keep track of all your important dates and get notified to never forget special moments!</p>
                <button onClick={()=>navigate("/singup")} class="cta-button">Get Started</button>
            </div>

            <div class="features">
                <div class="feature-item">
                    <h3>Easy Reminders</h3>
                    <p>Receive notifications for birthdays, anniversaries, meetings, and more!</p>
                </div>
                <div class="feature-item">
                    <h3>Customizable</h3>
                    <p>Create custom categories and organize your events as you like.</p>
                </div>
                <div class="feature-item">
                    <h3>Secure & Private</h3>
                    <p>Your data is protected with the highest level of security.</p>
                </div>
            </div>

            <div class="footer">
                <p> <p>&copy;2024 DateMate. All rights reserved. </p>
                <a href="mailto:support@datemate.com">Contact Support</a></p>
            </div>
        </div>
    )
}
