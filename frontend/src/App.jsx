import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Experiences from './pages/Experiences';
import Birthday from './pages/Birthday';
import Proposal from './pages/Proposal';
import Anniversary from './pages/Anniversary';
import Sorry from './pages/Sorry';
import ThankYou from './pages/ThankYou';
import MissYou from './pages/MissYou';
import Puzzle from './pages/Puzzle';
import Friendship from './pages/Friendship';

// Workflows
import CreateCardPage from './pages/CreateCardPage';
import CardPreviewPage from './pages/CardPreviewPage';
import SuccessPage from './pages/SuccessPage';
import RecipientCardPage from './pages/RecipientCardPage';

// Admin & Auth
import Dashboard from './admin/Dashboard';
import Orders from './admin/Orders';
import Templates from './admin/Templates';
import Customers from './admin/Customers';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Marketing & Product Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/birthday" element={<Birthday />} />
          <Route path="/proposal" element={<Proposal />} />
          <Route path="/anniversary" element={<Anniversary />} />
          <Route path="/sorry" element={<Sorry />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/miss-you" element={<MissYou />} />
          <Route path="/puzzle" element={<Puzzle />} />
          <Route path="/friendship" element={<Friendship />} />

          {/* Creation & Publishing Flow */}
          <Route path="/create/:type" element={<CreateCardPage />} />
          <Route path="/preview/:id" element={<CardPreviewPage />} />
          <Route path="/success/:id" element={<SuccessPage />} />

          {/* Recipient Experience */}
          <Route path="/card/:slug" element={<RecipientCardPage />} />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/templates" element={<Templates />} />
          <Route path="/admin/customers" element={<Customers />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
