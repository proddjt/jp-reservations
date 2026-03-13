import './App.css'
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dropzone/styles.css';
import MainPage from './components/layout/MainPage';
import Providers from './components/layout/Providers';

function App() {

  return (
    <Providers>
      <MainPage/>
    </Providers>
  )
}

export default App
