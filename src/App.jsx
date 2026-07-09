import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header, Footer } from './components/Layout';
import { UserProvider } from './context/UserContext';
import Home from './pages/Home';
import Browse from './pages/Browse';
import QuestionDetail from './pages/QuestionDetail';
import Questions from './pages/Questions';
import Answers from './pages/Answers';
import Comments from './pages/Comments';
import Companies from './pages/Companies';
import Technologies from './pages/Technologies';
import JobRoles from './pages/JobRoles';
import './App.css';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <Routes>
              {/* Learner-facing */}
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/questions/:id" element={<QuestionDetail />} />

              {/* Admin / content management */}
              <Route path="/admin/questions" element={<Questions />} />
              <Route path="/admin/answers" element={<Answers />} />
              <Route path="/admin/comments" element={<Comments />} />
              <Route path="/admin/companies" element={<Companies />} />
              <Route path="/admin/technologies" element={<Technologies />} />
              <Route path="/admin/roles" element={<JobRoles />} />

              {/* Legacy redirects */}
              <Route path="/questions" element={<Navigate to="/browse" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
