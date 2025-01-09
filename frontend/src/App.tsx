import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Index from './pages/employee/Index';
import Create from './pages/employee/Create';
import Edit from './pages/employee/Edit';
import PrivateRoute from './utils/PrivateRoute';
import AuthProvider from './context/AuthContext';
import React from 'react';
import Layout from './components/Layout';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';

const InnerApp: React.FC = () => (
  <Routes>
    {/* Public Route */}
    <Route path="/" element={<LoginPage />} />

    {/* Private Routes wrapped with Layout */}
    <Route
      element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }
    >
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/employees" element={<Index />} />
      <Route path="/employees/create" element={<Create />} />
      <Route path="/employees/:id/edit" element={<Edit />} />
      <Route path="/profile" element={<Profile />} />
    </Route>

    {/* 404 Route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App: React.FC = () => (
  <AuthProvider>
    <React.Suspense fallback={<div>Loading...</div>}>
      <Router>
        <InnerApp />
      </Router>
    </React.Suspense>
  </AuthProvider>
);

export default App;
