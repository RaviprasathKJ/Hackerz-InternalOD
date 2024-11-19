const acceptRequest = "UPDATE OD_Details SET status = '1' WHERE status = '0' AND od_id = ANY($1)";
const modifyRequestTiming = "UPDATE OD_Details SET from_time = $2, to_time = $3 WHERE od_id = ANY($1) AND status = '0' RETURNING *";
const rejectRequest = "UPDATE OD_Details SET status = '-1' WHERE od_id = ANY($1)";

export default { acceptRequest, rejectRequest, modifyRequestTiming };

