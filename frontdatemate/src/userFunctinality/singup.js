import { useState } from "react";
import qs from "qs"; // Import the qs package
import "./singup.css"
import { useNavigate } from "react-router-dom"
export default function Signup() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [validatePermission, setPermission]= useState(false)
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()
  const handleValidate = async (e)=>{
    e.preventDefault()
    const validateData = {
      otp: otp,
      username: username,
    }

    const validateResponse = await fetch('http://127.0.0.1:8000/validate/',{
      method:'POST',
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded', 
      },
      body: qs.stringify(validateData),
    })
    if (validateResponse.status === 200){
      navigate('/login')
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {
      username: username,
      email: email,
      password: password1,
    }

    const response = await fetch('http://127.0.0.1:8000/signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', 
      },
      body: qs.stringify(data), 
    });

    if (response.status === 200){
      setPermission(true)
    }
  };

  return (
    <div>
      <div className="sign-header">
        <p>Sign Up for DateMate</p>
      </div>
      <div className="signup-container">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </form>
        {validatePermission?
        <form onSubmit={handleValidate}>
        <input value={otp} placeholder="Enter Otp" required type="text" 
            onChange={(e)=>setOtp(e.target.value)}/>
            <button type="submit">Validate Otp</button>
        </form>:<></>}
      </div>
      <div className="footer">
                <p>&copy; 2024 DateMate. All rights reserved. 
                <a href="mailto:support@datemate.com">Contact Support</a></p>
            </div>
    </div>
  );
}
