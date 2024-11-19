const sendRequest = (recordCount: number): string => {
  const valuePlaceholders = Array(recordCount)
    .fill(0)
    .map(
      (_, i) =>
        `($${i * 9 + 1}, $${i * 9 + 2}, $${i * 9 + 3}, $${i * 9 + 4}, $${i * 9 + 5}, $${i * 9 + 6}, $${i * 9 + 7}, $${i * 9 + 8}, $${i * 9 + 9})`
    )
    .join(', ');

  return `
    INSERT INTO od_details (user_id, date, reason, description, request_by, status, from_time, to_time, request_type)
    VALUES ${valuePlaceholders}
    RETURNING *;
  `;
};

const updateStaybackQuery = `
  UPDATE od_details
  SET Stayback_cnt = COALESCE(Stayback_cnt, 0) + 1
  WHERE user_id = $1 AND request_type = 'Stayback';
`;

const updateMeetingQuery = `
  UPDATE od_details
  SET Meeting_cnt = COALESCE(Meeting_cnt, 0) + 1
  WHERE user_id = $1 AND request_type = 'Meeting';
`;

export default { sendRequest, updateStaybackQuery, updateMeetingQuery };
