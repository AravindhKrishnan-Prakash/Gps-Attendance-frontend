import React, { useState ,useEffect} from 'react';
import './Student.css';
import axios from 'axios';

const StudentForm = () => {
  // Define the list of subject codes and staff names
  const subjectCodes = [
    "19z501",
    "19z502",
    "19z503",
    "19z504",
    "19z505",
    "19O001",
    "19z511",
    "19z512",
  ];
  
  const staffNames = [
    'SATHIYAPRIYA K', 
    'RAMESH A C',
    'SUDHA SADASIVAM G',
    'PRAKASH J',
    'VIJAYALAKSHMI S',
    'INDUMATHI D',
    'ARUL ANAND N'
  ];

  const [formData, setFormData] = useState({
    studentName: '',
    rollNumber: '',
    staffName: '',
    subjectCode: '',
    status: '',
    location: { latitude: '', longitude: '' },
    code: ''
  });
  useEffect(() => {
    const storedRollNumber = localStorage.getItem('rollNumber');
    setFormData((prevData) => ({
      ...prevData,
      rollNumber: storedRollNumber || '',
    }));
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevData) => ({
            ...prevData,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          }));
        },
        (error) => {
          alert('Unable to retrieve location.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.status === 'Present' && (!formData.location.latitude || !formData.location.longitude || !formData.code)) {
      alert('Location and code are required if the student is present.');
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/store-student-data/", formData);
      console.log('Response:', response.data);
      alert('Attendance Recorded!');
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error recording attendance!');
    }
  };

  return (
    <div className="form-container">
      <h2>Student Attendance Form</h2>
      <form onSubmit={handleSubmit} className="student-form">
        <div className="form-group">
          <label htmlFor="studentName">Student Name</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="rollNumber">Roll Number</label>
          <input
            type="text"
            name="rollNumber"
            value={formData.rollNumber}
            disabled 
          />
        </div>
        <div className="form-group">
          <label htmlFor="staffName">Staff Name</label>
          <select
            name="staffName"
            value={formData.staffName}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Staff Name
            </option>
            {staffNames.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="subjectCode">Subject Code</label>
          <select
            name="subjectCode"
            value={formData.subjectCode}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Subject Code
            </option>
            {subjectCodes.map((code, index) => (
              <option key={index} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required={formData.status === 'Present'}
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <div className="status-options">
            <label>
              <input
                type="radio"
                name="status"
                value="Present"
                onChange={handleChange}
                required
              />
              Present
            </label>
            <label>
              <input
                type="radio"
                name="status"
                value="Absent"
                onChange={handleChange}
                required
              />
              Absent
            </label>
          </div>
        </div>
        {formData.status === 'Present' && (
          <div className="form-group">
            <label>Location</label>
            <button type="button" onClick={handleLocation} className="location-btn">
              Get Location
            </button>
            {formData.location.latitude && (
              <p>
                Latitude: {formData.location.latitude}, Longitude: {formData.location.longitude}
              </p>
            )}
          </div>
        )}
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default StudentForm;
