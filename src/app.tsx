import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import Home from './app/home';
import useId from './hooks/use-id';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
