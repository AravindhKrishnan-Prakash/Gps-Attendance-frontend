import React, { useState } from 'react';
import axios from 'axios';
import './Record.css'; // Create this for styling

const Record = () => {
  const [staffName, setStaffName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [date, setDate] = useState("");
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  const handleViewAttendance = async (event) => {
    event.preventDefault();

    if (!staffName || !subjectCode || !date) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/attendance/view/", {
        staff_name: staffName,
        subject_code: subjectCode,
        date: date
      });
      setRecords(response.data);
      setError(""); // Clear any previous errors
    } catch (error) {
      setError("Error fetching attendance records.");
      console.error(error);
    }
  };

  return (
    <div className="record-container">
      <h1 className="record-title">View Attendance Records</h1>
      <form className="record-form" onSubmit={handleViewAttendance}>
        <div className="form-group">
          <label htmlFor="staffName">Staff Name</label>
          <input
            type="text"
            name="staffName"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="subjectCode">Subject Code</label>
          <input
            type="text"
            name="subjectCode"
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-view">View Attendance</button>
      </form>

      {error && <p className="error">{error}</p>}

      {records.length > 0 && (
        <div className="records-display">
          <h2>Attendance Records:</h2>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Roll Number</th>
                <th>Course Code</th>
                <th>Status</th>
                <th>Validation Code</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index}>
                  <td>{record.student_name}</td>
                  <td>{record.roll_number}</td>
                  <td>{record.course_code}</td>
                  <td>{record.attendance_status}</td>
                  <td>{record.code_validation}</td>
                  <td>{record.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Record;
