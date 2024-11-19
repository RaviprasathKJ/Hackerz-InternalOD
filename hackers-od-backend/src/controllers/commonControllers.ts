import { pool } from '../config/config';
import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library'
import { commonQueries } from '../queries';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const login = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const username = payload?.name;

    if (!email) {
      return res.status(400).json({ error: 'Email not found in Google payload' });
    }

    pool.query(commonQueries.login, [email], (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Database query failed' });
      }

      if (results.rows.length === 0) {
        return res.status(403).json({ error: 'Unauthorized user' });
      }

      const role = results.rows[0].type;

      const jwtToken = jwt.sign({ email, role ,username}, process.env.JWT_SECRET as string, { expiresIn: '1h' });

      res.json({ token: jwtToken, role ,username});
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Failed to authenticate Google token', msg: error });
  }
};

const verifyToken = (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ decoded });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

const getAllStudents = (_: Request, res: Response) => {
  pool.query(commonQueries.getAllStudents, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error fetching all students' });
    }
    res.status(200).json(results.rows);
  });
};

const getApprovedStudents = (_: Request, res: Response) => {
  pool.query(commonQueries.getApprovedStudents, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error fetching approved students' });
    }
    res.status(200).json(results.rows);
  });
};

const getRejectedStudents = (_: Request, res: Response) => {
  pool.query(commonQueries.getRejectedStudents, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error fetching rejected students' });
    }
    res.status(200).json(results.rows);
  });
};

const getPendingStudents = (_: Request, res: Response) => {
  pool.query(commonQueries.getPendingStudents, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error fetching pending students' });
    }
    res.status(200).json(results.rows);
  });
};

const getApprovedStudentsToday = (_: Request, res: Response) => {
  pool.query(commonQueries.getApprovedStudentsToday, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error fetching approved students today' });
    }
    res.status(200).json(results.rows);
  });
};

const getRejectedStudentsToday = (_: Request, res: Response) => {
  pool.query(commonQueries.getRejectedStudentsToday, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error fetching rejected students today' });
    }
    res.status(200).json(results.rows);
  });
};

const getPendingStudentsToday = (_: Request, res: Response) => {
  pool.query(commonQueries.getPendingStudentsToday, (error, results) => {
    if (error) {
      console.log(error.message);
      return res.status(500).json({ error: 'Error fetching pending students today' });
    }
    res.status(200).json(results.rows);
  });
};

export default {
  login,
  verifyToken,
  getAllStudents,
  getApprovedStudents,
  getRejectedStudents,
  getPendingStudents,
  getApprovedStudentsToday,
  getRejectedStudentsToday,
  getPendingStudentsToday
};

