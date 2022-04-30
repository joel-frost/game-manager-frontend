import Login from './components/User/Login';
import SignUp from './components/User/SignUp';
import Library from './components/Library';
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/library" element={<Library />} />
      </Routes>
    </div>
  );
}

export default App;
