import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'
import Navigation from './components/Navigation'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WordCloud from './components/wordCloud';
import ProfanityLogsForm from './components/ProfanityLogsForm';
import ProfanityTermsForm from './components/ProfanityTermsForm';
import ApiTokenRegisteredForm from './components/ApiTokenRegisteredForm';
import ApiTokenRenewalForm from './components/ApiTokenRenewalForm';
import UsersForm from './components/UsersForm';
import IdentifyProfanityForm from './components/IdentifyProfanityForm';
import CommentSection from './components/CommentSection';
import LibWordCloud from './components/libWordCloud';
import AudioTranscriber from './components/audioTranscriber';
import LiveMicTranscriber from './components/LiveMicTranscriber';


function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<LibWordCloud />} />
        <Route path="/profanity-logs" element={<ProfanityLogsForm />} />
        <Route path="/profanity-terms" element={<ProfanityTermsForm />} />
        <Route path="/api-token-registered" element={<ApiTokenRegisteredForm />} />
        <Route path="/api-token-renewal" element={<ApiTokenRenewalForm />} />
        <Route path="/users" element={<UsersForm />} />
        <Route path="/identify-profanity" element={<IdentifyProfanityForm />} />
          <Route path="/comments" element={<CommentSection />} />
          <Route path="/audio-transcriber" element={<LiveMicTranscriber />} />
      </Routes>
    </Router>
  )
}

export default App
