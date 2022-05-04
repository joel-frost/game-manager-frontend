import Login from './components/User/Login';
import SignUp from './components/User/SignUp';
import Library from './components/Library';
import Logout from './components/User/Logout';
import Profile from './components/User/Profile';
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={<Library />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/library" element={<Library />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
