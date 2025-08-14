import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Icons from '../src/components';

const App = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem' }}>
      {Object.entries(Icons).map(([name, Icon]) => {
        return (
          <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Icon width={48} height={48} />
            <span>{name}</span>
          </div>
        );
      })}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
