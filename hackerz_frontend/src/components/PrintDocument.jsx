import React from "react";
import logo from "../assets/logo.png";
import citlogo from "../assets/citlogo.png";
import sign from "../assets/sign.png";

const PrintDocument = ({ students, currentDate }) => {
  const formatTime = (time) => {
    const [hour, min] = time.split(":").slice(0, 2);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${min} ${ampm}`;
  };

  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const studentChunks = chunkArray(students, 25);

  const StudentTable = ({ students, startIndex }) => (
    <div style={{ pageBreakBefore: startIndex === 0 ? 'always' : 'always' }}>
      <div className="header">
        <img id="citLogo" src={citlogo} alt="Chennai Institute of Technology Logo" />
        <img id="hackerzLogo" src={logo} alt="Hackerz Logo" />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <strong>Date: </strong>{currentDate}
      </div>
      <table>
        <thead>
          <tr>
            <th>S.NO</th>
            <th>NAME</th>
            <th>YEAR</th>
            <th>COMMITTEE</th>
            <th>From</th>
            <th>TO</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={startIndex + index}>
              <td>{startIndex + index + 1}</td>
              <td>{student.name}</td>
              <td>{student.year}</td>
              <td>{student.reason}</td>
              <td>{formatTime(student.from_time)}</td>
              <td>{formatTime(student.to_time)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="print-container">
      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 2cm;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print-container {
              padding: 20px;
              font-family: Arial, sans-serif;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
            }
            #hackerzLogo {
              width: 100px;
              height: auto;
            }
            #citLogo {
              width: 180px;
              height: auto;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 14px;
              color: #333;
            }
            th, td {
              border: 1px solid #333;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            .signature-section {
              display: flex;
              flex-direction:column;
              justify-content: center;
              align-items:flex-end;
              margin-top: 20px;
              padding-right:20px;
              padding-left:20px;
              text-align:center; 
            }
            .signature-img {
              width: 100px;
              height: auto;
              margin-right: 90px;
            }
          }
        `}
      </style>

      <div className="first-page">
        <div className="header">
          <img id="citLogo" src={citlogo} alt="Chennai Institute of Technology Logo" />
          <img id="hackerzLogo" src={logo} alt="Hackerz Logo" />
        </div>

        <div className="address-from" style={{ marginBottom: "20px" }}>
          <strong>From</strong>
          <div>Team Hackerz'24,<br />
            Department of Computer Science,<br />
            Chennai Institute of Technology,<br />
            Sarathy Nagar, Nandambakkam Post,<br />
            Kundrathur, Chennai-600069.
          </div>
        </div>

        <div className="address-to" style={{ marginBottom: "20px" }}>
          <strong>To</strong>
          <div>The Head of Department,<br />
            Chennai Institute of Technology,<br />
            Sarathy Nagar, Nandambakkam Post,<br />
            Kundrathur, Chennai-600069.
          </div>
        </div>

        <div className="subject" style={{ fontWeight: "bold", marginBottom: "20px" }}>
          Subject: Requesting permission for OD regarding Hackerz'24 symposium.
        </div>

        <div className="content" style={{ lineHeight: "1.5", marginBottom: "40px" }}>
          <p>Respected Mam,</p>
          <p>We hereby request you to grant permission for the following list of students to pursue our work for Hackerz. We request you to kindly grant permission for the mentioned students on {currentDate}.</p>
        </div>

        <div className="closing" style={{ marginBottom: "40px" }}>
          Regards,<br />
          Team Hackerz'24
        </div>

        <div className="signature-section">
          <img className="signature-img" src={sign} alt="Signature" />
          <div>
            <p style={{ margin: 0 }}>Head of Department</p>
            <p style={{ margin: 0 }}>Computer Science and Engineering</p>
          </div>
        </div>
      </div>

      {studentChunks.map((chunk, index) => (
        <StudentTable key={index} students={chunk} startIndex={index * 25} />
      ))}
    </div>
  );
};

export default PrintDocument;
