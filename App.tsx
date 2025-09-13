import React from 'react';
import { Header } from './components/Header';
import { Generator } from './components/Generator';
import { useTheme } from './hooks/useTheme';

const App: React.FC = () => {
  const [theme, toggleTheme] = useTheme();

  return (
    <div className="min-h-screen font-sans">
      <Header 
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        <Generator />
      </main>
    </div>
  );
};

export default App;
