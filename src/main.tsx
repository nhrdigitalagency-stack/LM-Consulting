import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root');

if (container) {
  const initialUrl = `${window.location.pathname}${window.location.search}`;
  const hasSsrMarkup =
    container.innerHTML.trim().length > 0 &&
    !container.innerHTML.includes('<!--SSR_OUTLET-->');

  if (hasSsrMarkup) {
    hydrateRoot(
      container,
      <StrictMode>
        <App initialUrl={initialUrl} />
      </StrictMode>
    );
  } else {
    createRoot(container).render(
      <StrictMode>
        <App initialUrl={initialUrl} />
      </StrictMode>
    );
  }
}
