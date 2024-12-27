import { useState } from "react";
import { useNavigate } from "react-router-dom";
import qs from 'qs';
import './login.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginData = {
            username: username,
            password: password,
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                credentials: 'include', 
                body: qs.stringify(loginData),
            });

            if (response.status === 200) {
            
                const responseData = await response.json()
                console.log(responseData)
                
              
                const token = responseData.token
                if (token) {
                    console.log('Token received:', token)
                    sessionStorage.setItem('auth_token', token);
                    navigate('/dashbord');
                }
            } else {
                // Show error message for invalid login
                alert("Invalid username or password. Please try again.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Something went wrong. Please try again later.");
        }
    };

    return (
        <div>
            <div className="login-header">
                <p>Welcome Back to DateMate</p>
            </div>
            <div className="login-container">
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                </form>
                <p className="signup-link">
                    Don't have an account? <a href="/signup">Sign up here</a>.
                </p>
            </div>

            <div className="footer">
                <p>
                    &copy; 2024 DateMate. All rights reserved.{' '}
                    <a href="mailto:support@datemate.com">Contact Support</a>
                </p>
            </div>
        </div>
    );
}
