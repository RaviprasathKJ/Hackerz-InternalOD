import { Request, Response } from 'express';
import { teamleadQueries } from '../queries';
import pool from '../config/db';

interface ODDetails {
  user_id: string;
  date: string;
  reason: string;
  description: string;
  request_by: string;
  status: string;
  from_time: string;
  to_time: string;
  request_type: string;
}

const sendRequest = async (req: Request, res: Response) => {
  // Extract the OD details from the request body
  const odDetailsArray: ODDetails[] = Object.values(req.body).filter(
    (item): item is ODDetails => item !== null && typeof item === 'object' && 'user_id' in item
  );

  console.log("Received OD Details:", odDetailsArray);

  // If the array is empty, send a bad request response
  if (odDetailsArray.length === 0) {
    return res.status(400).send('Invalid request: odDetailsArray should be a non-empty array.');
  }

  // Connect to the database
  const client = await pool.connect();

  try {
    // Begin transaction
    await client.query('BEGIN');

    // Ensure UUID extension is present for generating UUIDs if needed
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    // Prepare the values array for the INSERT query
    const values = odDetailsArray.flatMap((details) => [
      details.user_id,
      details.date,
      details.reason,
      details.description,
      details.request_by,
      details.status,
      details.from_time,
      details.to_time,
      details.request_type,
    ]);

    // Generate the query for inserting records into the database
    const query = teamleadQueries.sendRequest(odDetailsArray.length);
    console.log('Generated Query:', query);
    console.log('Values:', values);

    // Execute the query to insert the records into the database
    const result = await client.query(query, values);

    // Log the result of the insert query
    console.log("Insert Result:", result.rows);

    // After inserting the records, update the Stayback and Meeting counts
    for (let details of odDetailsArray) {
      if (details.reason === 'Stayback') {
        await client.query(teamleadQueries.updateStaybackQuery, [details.user_id]);
      } else if (details.reason === 'Meeting') {
        await client.query(teamleadQueries.updateMeetingQuery, [details.user_id]);
      }
    }

    // Commit the transaction
    await client.query('COMMIT');

    // Send a success response with the inserted records
    res.status(200).json({
      message: 'Records inserted successfully',
      records: result.rows,
    });
  } catch (err: any) {
    // If any error occurs, rollback the transaction
    await client.query('ROLLBACK');
    console.error('Transaction error:', err);

    // Respond with an error message
    res.status(500).json({
      message: 'Error inserting records',
      error: err.message,
      stack: err.stack,  // Include stack trace for debugging
    });
  } finally {
    // Release the database client back to the pool
    client.release();
  }
};

export default { sendRequest };
