// App.js
import React from 'react';
import './App.css'
import { Provider } from 'react-redux';
import store from './state/store';
import AppRouter from './routing/AppRouter';
import { SubAppProvider } from './context/SubAppContext';

const App = () => {
  return (
    <Provider store={store}>
      <SubAppProvider>
        <div className="App">
          <AppRouter />
        </div>
      </SubAppProvider>
    </Provider>
  );
};

export default App;
