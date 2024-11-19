import { Request, Response } from 'express';
import { hodQueries } from '../queries';
import pool from '../config/db';

const acceptRequest = (req: Request, res: Response) => {

  const userIds: number[] = req.body.userIds;

  pool.query(hodQueries.acceptRequest, [userIds], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error accepting request' });
    }
    res.status(200).json({ message: 'Request accepted', rowCount: results.rowCount });
  });
}


const rejectRequest = (req: Request, res: Response) => {

  const userIds: number[] = req.body.userIds;

  pool.query(hodQueries.rejectRequest, [userIds], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error rejecting request' });
    }
    res.status(200).json({ message: 'Request rejected', rowCount: results.rowCount });
  });

};

const modifyRequestTiming = (req: Request, res: Response) => {

  const { userIds, from_time, to_time } = req.body
  console.log("USER ID: ", userIds)
  console.log("FROM TIME: ", from_time)
  console.log("TO TIME: ", to_time)

  pool.query(hodQueries.modifyRequestTiming, [userIds, from_time, to_time], (error, results) => {
    if (error) {
      console.error('Error modifying request timing:', error);
      return res.status(500).json({ error: 'Error modifying request timing' });
    }

    if (results.rowCount === 0) {
      return res.status(404).json({ error: 'OD request not found or not pending' });
    }

    res.status(200).json({ message: 'Request timing modified', updatedRecord: results.rows[0] });
  });
}


export default {
  acceptRequest,
  rejectRequest,
  modifyRequestTiming
};
