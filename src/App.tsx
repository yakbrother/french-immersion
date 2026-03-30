import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { FlashcardDeck } from './components/flashcards/FlashcardDeck';
import { ChatView } from './components/chat/ChatView';
import { GrammarView } from './components/grammar/GrammarView';
import { Dashboard } from './components/dashboard/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<FlashcardDeck />} />
          <Route path="chat" element={<ChatView />} />
          <Route path="grammar" element={<GrammarView />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
