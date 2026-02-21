const API_URL = "https://physics-sandbox-api.onrender.com/api";

const getToken = () => localStorage.getItem("physics_token");

const headers = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
});

const get = (url) => fetch(url, { headers: headers() }).then(r => r.json());
const post = (url, data) => fetch(url, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then(r => r.json());
const patch = (url, data) => fetch(url, { method: "PATCH", headers: headers(), body: JSON.stringify(data) }).then(r => r.json());
const del = (url) => fetch(url, { method: "DELETE", headers: headers() }).then(r => r.json());

export const api = {
  // Auth
  signup: (data) => post(`${API_URL}/auth/signup`, data),
  login: (data) => post(`${API_URL}/auth/login`, data),
  me: () => get(`${API_URL}/auth/me`),

  // Users
  getUsers: () => get(`${API_URL}/users`),
  getTeachers: () => get(`${API_URL}/users`).then(users => users.filter ? users.filter(u => u.role === "teacher") : []),

  // Links
  sendLinkRequest: (data) => post(`${API_URL}/links`, data),
  getStudentLinks: (email) => get(`${API_URL}/links?student_email=${email}`),
  getTeacherLinks: (email) => get(`${API_URL}/links?teacher_email=${email}`),
  updateLink: (id, status) => patch(`${API_URL}/links/${id}`, { status }),
  deleteLink: (id) => del(`${API_URL}/links/${id}`),

  // Assignments
  createAssignment: (data) => post(`${API_URL}/assignments`, data),
  getStudentAssignments: (email) => get(`${API_URL}/assignments?student_email=${email}`),
  getTeacherAssignments: (email) => get(`${API_URL}/assignments?teacher_email=${email}`),
  deleteAssignment: (id) => del(`${API_URL}/assignments/${id}`),

  // Submissions
  submitAssignment: (data) => post(`${API_URL}/submissions`, data),
  getSubmissions: (assignmentId) => get(`${API_URL}/submissions?assignment_id=${assignmentId}`),
};
