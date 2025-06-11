// src/App.tsx
import './App.css';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import './styles/kakaoOverlay.css';

import { RouterProvider } from 'react-router-dom';
import router from './router';

export const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
