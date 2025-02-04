import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const USER_ID = 'demo-user'; // Replace with actual user ID system

function App() {
  const [userData, setUserData] = useState({ totalPoints: 0, prizesWon: 0 });
  const [isAnimating, setIsAnimating] = useState(false);



  const handleClick = async () => {
    setIsAnimating(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/click/${USER_ID}`);
      setUserData(prev => ({
        totalPoints: response.data.points,
        prizesWon: prev.prizesWon + (response.data.prizeWon ? 1 : 0)
      }));
      
      if (response.data.bonusPoints) {
        toast.success(`+${response.data.bonusPoints} Bonus Points!`);
      }
      if (response.data.prizeWon) {
        toast.info('🎉 You won a prize!');
      }
    } catch (error) {
      toast.error('Error processing click');
    }
    setIsAnimating(false);
  };

  const fetchUserData = async () => {
    const response = await axios.get(
      `http://localhost:5000/api/user/${USER_ID}` // Full URL
    );
    setUserData(response.data);
  };

  useEffect(() => { fetchUserData(); }, []);

  return (
    <div className="app">
      <div className="counter">
        <h1>{userData.totalPoints} Points</h1>
        <p>Prizes Won: {userData.prizesWon}</p>
      </div>
      <button 
        className={`click-button ${isAnimating ? 'animate' : ''}`}
        onClick={handleClick}
      >
        Click Me!
      </button>
    </div>
  );
}

export default App;