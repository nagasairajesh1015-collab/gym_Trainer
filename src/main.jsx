import React from 'react';
import { createRoot } from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import App from './App.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);

// Native (Android / iOS) setup. Does nothing in a normal browser.
if (Capacitor.isNativePlatform()) {
  Promise.all([import('@capacitor/status-bar'), import('@capacitor/splash-screen'), import('@capacitor/app')])
    .then(([{ StatusBar, Style }, { SplashScreen }, { App: CapApp }]) => {
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
      StatusBar.setBackgroundColor({ color: '#0b0c10' }).catch(() => {});
      SplashScreen.hide().catch(() => {});
      // Android back button: go to Home first, then exit the app
      CapApp.addListener('backButton', () => {
        const handled = window.__goBack && window.__goBack();
        if (!handled) CapApp.exitApp();
      });
    })
    .catch(() => {});
}
