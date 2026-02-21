const API_URL = 'https://physics-sandbox-api.onrender.com/api';

const getToken = () => localStorage.getItem('physics_token');

const headers = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
});

export const api = {
  // Auth
  signup: (data) => fetch(`${API_URL}/auth/signup`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),
  login: (data) => fetch(`${API_URL}/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),

  // Users
  getTeachers: () => fetch(`${API_URL}/users/teachers`, { headers: headers() }).then(r => r.json()),

  // Links
  sendLinkRequest: (data) => fetch(`${API_URL}/links`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),
  getStudentLinks: (email) => fetch(`${API_URL}/links/student/${email}`, { headers: headers() }).then(r => r.json()),
  getTeacherLinks: (email) => fetch(`${API_URL}/links/teacher/${email}`, { headers: headers() }).then(r => r.json()),
  updateLink: (id, status) => fetch(`${API_URL}/links/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify({ status }) }).then(r => r.json()),

  // Assignments
  createAssignment: (data) => fetch(`${API_URL}/assignments`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),
  getStudentAssignments: (email) => fetch(`${API_URL}/assignments/student/${email}`, { headers: headers() }).then(r => r.json()),
  getTeacherAssignments: (email) => fetch(`${API_URL}/assignments/teacher/${email}`, { headers: headers() }).then(r => r.json()),

  // Submissions
  submitAssignment: (data) => fetch(`${API_URL}/submissions`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),
  getSubmissions: (assignmentId) => fetch(`${API_URL}/submissions/${assignmentId}`, { headers: headers() }).then(r => r.json()),
};
