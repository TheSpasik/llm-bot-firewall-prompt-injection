import { useState } from 'react';
import Chat from './components/Chat.jsx';
import Products from './components/Products.jsx';
import SecurityLogs from './components/SecurityLogs.jsx';
import AttackTester from './components/AttackTester.jsx';
import OllamaStatus from './components/OllamaStatus.jsx';

const pages = [
  { id: 'chat', label: 'Chat' },
  { id: 'products', label: 'Products' },
  { id: 'logs', label: 'Security Logs' },
  { id: 'attacks', label: 'Attack Tester' },
  { id: 'status', label: 'Ollama Status' }
];

function App() {
  const [activePage, setActivePage] = useState('chat');

  function renderContent() {
    switch (activePage) {
      case 'products':
        return <Products />;
      case 'logs':
        return <SecurityLogs />;
      case 'attacks':
        return <AttackTester />;
      case 'status':
        return <OllamaStatus />;
      default:
        return <Chat />;
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Secure Local LLM Shop Assistant</h1>
          <p>Local Ollama chatbot with prompt injection protection.</p>
        </div>
      </header>

      <nav className="app-nav">
        {pages.map((page) => (
          <button
            key={page.id}
            className={activePage === page.id ? 'nav-button active' : 'nav-button'}
            onClick={() => setActivePage(page.id)}
          >
            {page.label}
          </button>
        ))}
      </nav>

      <main className="app-content">{renderContent()}</main>

      <footer className="app-footer">
        <span>Course project demo: secure local LLM chatbot for an electronics store.</span>
      </footer>
    </div>
  );
}

export default App;
