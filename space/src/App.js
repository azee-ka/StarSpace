// App.js
import React from 'react';
import './App.css'
import { Provider } from 'react-redux';
import store from './state/store';
import AppRouter from './routing/AppRouter';

const App = () => {
  return (
    <Provider store={store}>
        <div className="App">
          <AppRouter />
        </div>
    </Provider>
  );
};

export default App;
