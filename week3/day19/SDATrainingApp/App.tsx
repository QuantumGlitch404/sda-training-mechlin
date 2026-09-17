import React, { useEffect } from 'react';
import { Provider } from 'react-redux';

import AppNavigator from './src/navigation/AppNavigator';
import { store } from './src/store';
import { offlineService } from './src/services/offlineService';
import { apiService } from './src/services/apiService';

export default function App() {
  useEffect(() => {
    apiService.initializeToken();
    offlineService.initialize();
  }, []);

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}