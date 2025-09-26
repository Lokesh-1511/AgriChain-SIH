import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.jsx'

// Clean up any existing service workers and clear problematic cache
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      console.log('Unregistering service worker:', registration.scope);
      registration.unregister();
    }
  }).catch(err => {
    console.log('Service worker cleanup error:', err);
  });
}

// Clear any problematic caches
if ('caches' in window) {
  caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.map(function(cacheName) {
        console.log('Deleting cache:', cacheName);
        return caches.delete(cacheName);
      })
    );
  }).catch(err => {
    console.log('Cache cleanup error:', err);
  });
}

// Debug localStorage state
console.log('Main: Checking localStorage state...');
console.log('agrichain-products:', !!localStorage.getItem('agrichain-products'));
console.log('agrichain-farmers:', !!localStorage.getItem('agrichain-farmers'));
console.log('agrichain-traces:', !!localStorage.getItem('agrichain-traces'));
console.log('agrichain-transactions:', !!localStorage.getItem('agrichain-transactions'));
console.log('agrichain-schemes:', !!localStorage.getItem('agrichain-schemes'));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
