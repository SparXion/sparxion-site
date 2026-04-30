import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
function App() {
  const [interest, setInterest] = useState('');
  const [industry, setIndustry] = useState('');
  const [careers, setCareers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [studentInterests, setStudentInterests] = useState('');
  const [studentTalents, setStudentTalents] = useState('');
  const [studentImage, setStudentImage] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [companyNeeds, setCompanyNeeds] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('');
  const [companyImage, setCompanyImage] = useState(null);
  const [editStudentId, setEditStudentId] = useState(null);
  const fetchData = async () => {
    try {
      const careerResponse = await axios.get('http://127.0.0.1:5000/careers');
      const companyResponse = await axios.get('http://127.0.0.1:5000/companies');
      const studentResponse = await axios.get('http://127.0.0.1:5000/students');
      const allCareers = JSON.parse(careerResponse.data);
      const allCompanies = JSON.parse(companyResponse.data);
      const allStudents = JSON.parse(studentResponse.data);
      const matchingCareers = allCareers.filter(career => !interest || career.interests.includes(interest.toLowerCase()));
      const matchingSkills = [...new Set(matchingCareers.flatMap(career => career.skills))];
      setCareers(matchingCareers);
      setCompanies(allCompanies.filter(company => 
        (!industry || company.industry.toLowerCase() === industry.toLowerCase()) &&
        (!interest || company.needs.some(need => matchingSkills.includes(need)))
      ));
      setStudents(allStudents.filter(student => !interest || student.interests.includes(interest.toLowerCase())));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const addStudent = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', studentId);
    formData.append('interests', studentInterests);
    formData.append('talents', studentTalents);
    if (studentImage) {
      formData.append('image', studentImage);
    }
    try {
      await axios.post('http://127.0.0.1:5000/students', formData);
      setStudentId('');
      setStudentInterests('');
      setStudentTalents('');
      setStudentImage(null);
      alert('Student added!');
      fetchData();
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student');
    }
  };
  const editStudent = (student) => {
    setEditStudentId(student.id);
    setStudentId(student.id);
    setStudentInterests(student.interests.join(','));
    setStudentTalents(student.talents.join(','));
    setStudentImage(null);
  };
  const updateStudent = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('interests', studentInterests);
    formData.append('talents', studentTalents);
    if (studentImage) {
      formData.append('image', studentImage);
    }
    try {
      await axios.put(`http://127.0.0.1:5000/students/${studentId}`, formData);
      setEditStudentId(null);
      setStudentId('');
      setStudentInterests('');
      setStudentTalents('');
      setStudentImage(null);
      alert('Student updated!');
      fetchData();
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student');
    }
  };
  const deleteStudent = async (studentId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/students/${studentId}`);
      alert('Student deleted!');
      fetchData();
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student');
    }
  };
  const addCompany = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', companyName);
    formData.append('needs', companyNeeds);
    formData.append('industry', companyIndustry);
    if (companyImage) {
      formData.append('image', companyImage);
    }
    try {
      await axios.post('http://127.0.0.1:5000/companies', formData);
      setCompanyName('');
      setCompanyNeeds('');
      setCompanyIndustry('');
      setCompanyImage(null);
      alert('Company added!');
      fetchData();
    } catch (error) {
      console.error('Error adding company:', error);
      alert('Failed to add company');
    }
  };
  return (
    <div className="container">
      <h1>Career Exploration App</h1>
      <div className="search">
        <input
          type="text"
          placeholder="Enter interests (e.g., art)"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter industry (e.g., toys)"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        />
        <button onClick={fetchData}>Find Matches</button>
      </div>
      <h2>Careers</h2>
      {careers.map(career => (
        <p key={career._id.$oid} className="item">{career.name}: {career.skills.join(', ')}</p>
      ))}
      <h2>Companies</h2>
      {companies.map(company => (
        <div key={company._id.$oid} className="item">
          <p>{company.name}: {company.needs.join(', ')}</p>
          {company.images.map((image, index) => (
            <div key={index}>
              <a href={image.url} target="_blank" rel="noopener noreferrer">{image.url}</a>
              <img src={image.url} alt="Company logo" className="image-preview" />
            </div>
          ))}
        </div>
      ))}
      <h2>{editStudentId ? 'Edit Student' : 'Add Student'}</h2>
      <form onSubmit={editStudentId ? updateStudent : addStudent} className="form">
        <input
          type="text"
          placeholder="Student ID (e.g., student016)"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          disabled={editStudentId}
        />
        <input
          type="text"
          placeholder="Interests (e.g., art, tech)"
          value={studentInterests}
          onChange={(e) => setStudentInterests(e.target.value)}
        />
        <input
          type="text"
          placeholder="Talents (e.g., creativity)"
          value={studentTalents}
          onChange={(e) => setStudentTalents(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setStudentImage(e.target.files[0])}
        />
        <button type="submit">{editStudentId ? 'Update Student' : 'Add Student'}</button>
        {editStudentId && (
          <button type="button" onClick={() => {
            setEditStudentId(null);
            setStudentId('');
            setStudentInterests('');
            setStudentTalents('');
            setStudentImage(null);
          }}>Cancel</button>
        )}
      </form>
      <h2>Add Company</h2>
      <form onSubmit={addCompany} className="form">
        <input
          type="text"
          placeholder="Company Name (e.g., Mattel)"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Needs (e.g., sketching, prototyping)"
          value={companyNeeds}
          onChange={(e) => setCompanyNeeds(e.target.value)}
        />
        <input
          type="text"
          placeholder="Industry (e.g., toys)"
          value={companyIndustry}
          onChange={(e) => setCompanyIndustry(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCompanyImage(e.target.files[0])}
        />
        <button type="submit">Add Company</button>
      </form>
      <h2>Students</h2>
      {students.map(student => (
        <div key={student._id.$oid} className="item">
          <p>{student.id}: {student.interests.join(', ')}</p>
          {student.images.map((image, index) => (
            <div key={index}>
              <a href={image.url} target="_blank" rel="noopener noreferrer">{image.url}</a>
              <img src={image.url} alt="Student sketch" className="image-preview" />
            </div>
          ))}
          <button onClick={() => editStudent(student)} className="edit-button">Edit</button>
          <button onClick={() => deleteStudent(student.id)} className="delete-button">Delete</button>
        </div>
      ))}
    </div>
  );
}
export default App;