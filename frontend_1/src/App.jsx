import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import JoinCompany from './pages/JoinCompany';
import JoinExpert from './pages/JoinExpert';
import SignIn from './pages/SignIn';
import PrivacyDoc from './pages/PrivacyDoc';
import TermsOfService from './pages/TermsOfService';
import CompanyDashboard from './pages/CompanyDashboard';
import ExpertDashboard from './pages/ExpertDashboard';
import { AuthModalProvider } from './components/AuthModalContext';
import AuthModal from './components/AuthModal';

const AppContent = () => {
  const location = useLocation();
  const showNavbar = location.pathname === '/' || location.pathname === '/privacy-policy' || location.pathname === '/terms-of-service';
  const isDashboard = location.pathname === '/company-dashboard' || location.pathname === '/expert-dashboard';

  return (
    <AuthModalProvider>
      <div className="app-container">
        {showNavbar && <Navbar />}
        <AuthModal />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/join-company" element={<JoinCompany />} />
            <Route path="/join-expert" element={<JoinExpert />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/company-dashboard" element={<CompanyDashboard />} />
            <Route path="/expert-dashboard" element={<ExpertDashboard />} />
            <Route path="/privacy-policy" element={<PrivacyDoc />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/expert-dashboard" element={<ExpertDashboard />} />
          </Routes>
        </main>
      </div>
    </AuthModalProvider>
  );
};

function App() {
  console.log('App mounted');
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
