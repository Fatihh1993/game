/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { ThemeProvider } from './theme';
import { name as appName } from './app.json';

const Root = () => (
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

AppRegistry.registerComponent(appName, () => Root);
