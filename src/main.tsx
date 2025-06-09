import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { store } from './redux/store'
import { Provider } from 'react-redux'
import { SocketProvider } from './socket/socketProvider'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <SocketProvider>
     <App />
    </SocketProvider>
  </Provider>
)
