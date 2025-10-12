import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
//import { Toaster } from 'react-hot-toast';
import ResetPassword from './pages/ResetPassword';
import DashboardPage from './pages/DashboardPage';
import SignupPage from './pages/SignupPage';
import IssueBookPage from './pages/IssueBookPage';
import ReturnBookPage from './pages/ReturnBookPage';
import ManageBooksPage from './pages/ManageBooksPage';
import ManageMembersPage from './pages/ManageMembersPage';
import ViewLoansPage from './pages/ViewLoansPage';
import Layout from './components/Pagelayout';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      {/*<Toaster position="top-right" />*/}
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected layout */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="issue-book" element={<IssueBookPage />} />
          <Route path="return-book" element={<ReturnBookPage />} />
          <Route path="manage-book" element={<ManageBooksPage />} />
          <Route path="manage-member" element={<ManageMembersPage />} />
          <Route path="view-loan" element={<ViewLoansPage />} />
        </Route>

        {/* Default route */}
        <Route path="" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
