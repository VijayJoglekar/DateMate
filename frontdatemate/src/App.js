
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './userFunctinality/homepage';
import Signup from './userFunctinality/singup';
import Login from './userFunctinality/login';
import Dashbord from './businessLogic/Dashbord';
import VeiwallEvent from './businessLogic/viewallevent';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/singup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashbord" element={<Dashbord/>} />
        <Route path="/viewevent" element={<VeiwallEvent/>} />
      </Routes>
    </Router>
  );
}


export default App;
