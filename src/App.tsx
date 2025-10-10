import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import ResetPassword from './pages/ResetPassword'; // Corrected import
import DashboardPage from './pages/DashboardPage';
import IssueBookPage from './pages/IssueBookPage';
import ReturnBookPage from './pages/ReturnBookPage';
import ManageBooksPage from './pages/ManageBooksPage';
import ManageMembersPage from './pages/ManageMembersPage';
import ViewLoansPage from './pages/ViewLoansPage';
import Pagelayout from './components/Pagelayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />

        {/* Protected layout */}
        <Route path="/dashboard" element={<Pagelayout />}>
          {/* Nested pages */}
          <Route index element={<DashboardPage />} />
          <Route path="issue-book" element={<IssueBookPage />} />
          <Route path="return-book" element={<ReturnBookPage />} />
          <Route path="manage-book" element={<ManageBooksPage />} />
          <Route path="manage-member" element={<ManageMembersPage />} />
          <Route path="view-loan" element={<ViewLoansPage />} />
        </Route>

        {/* Default route */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;