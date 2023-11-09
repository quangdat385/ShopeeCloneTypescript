import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useRouteElements from './useRoutrElements';
import { useContext, useEffect } from 'react';
import { AppContext } from './contexts/app.context';
import { LocalStorageEventTarget } from './utils/auth';
import ErrorBoundary from './components/ErrorBoundary';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  const routeElements = useRouteElements();
  const { reset } = useContext(AppContext);
  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', reset);
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', reset);
    };
  }, [reset]);
  return (
    <div>
      <HelmetProvider>
        <ErrorBoundary>
          {routeElements}
          <ToastContainer />
        </ErrorBoundary>
      </HelmetProvider>
    </div>
  );
}

export default App;
