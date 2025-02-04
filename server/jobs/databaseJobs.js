import mongoose from 'mongoose';
import User from '../models/User.js';

export const connectToDatabase = () => mongoose.connect(process.env.MONGODB_URI);

export const getOrCreateUser = async (userId) => {
  return User.findOneAndUpdate(
    { userId },
    { $setOnInsert: { userId, totalPoints: 0, prizesWon: 0 } },
    { upsert: true, new: true }
  );
};

export const handleClickEvent = async (userId) => {
  const user = await User.findOne({ userId });
  let points = 1;
  let prizeWon = false;
  
  // 50% chance for 10 points
  if (Math.random() < 0.5) points += 9;
  
  // 25% chance for prize
  if (Math.random() < 0.25) {
    prizeWon = true;
    await User.updateOne({ userId }, { $inc: { prizesWon: 1 } });
  }

  await User.updateOne({ userId }, { $inc: { totalPoints: points } });
  
  return {
    points: user.totalPoints + points,
    prizeWon,
    bonusPoints: points > 1 ? 10 : 0
  };
};