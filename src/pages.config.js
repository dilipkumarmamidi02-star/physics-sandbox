import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import Laboratory from './pages/Laboratory';
import Learn from './pages/Learn';
import Profile from './pages/Profile';
import Progress from './pages/Progress';
import Simulator from './pages/Simulator';
import StudentAssignments from './pages/StudentAssignments';
import TeacherDashboard from './pages/TeacherDashboard';
import TemplateBuilder from './pages/TemplateBuilder';
import RoleSelect from './pages/RoleSelect';
import ConnectTeacher from './pages/ConnectTeacher';
import __Layout from './Layout.jsx';

export const PAGES = {
    "About": About,
    "AdminDashboard": AdminDashboard,
    "Home": Home,
    "Laboratory": Laboratory,
    "Learn": Learn,
    "Profile": Profile,
    "Progress": Progress,
    "Simulator": Simulator,
    "StudentAssignments": StudentAssignments,
    "TeacherDashboard": TeacherDashboard,
    "TemplateBuilder": TemplateBuilder,
    "RoleSelect": RoleSelect,
    "ConnectTeacher": ConnectTeacher,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
