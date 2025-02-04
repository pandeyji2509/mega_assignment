import express from 'express';
import cors from 'cors';
import * as databaseJobs from './jobs/databaseJobs.js';
import 'dotenv/config';

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST']
}));
app.use(express.json());

// Initialize database
databaseJobs.connectToDatabase().catch(err => console.error(err));

// Routes
app.get('/api/user/:userId', async (req, res) => {
  try {
    const user = await databaseJobs.getOrCreateUser(req.params.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post(`/api/click/:userId`, async (req, res) => {
  try {
    const result = await databaseJobs.handleClickEvent(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));