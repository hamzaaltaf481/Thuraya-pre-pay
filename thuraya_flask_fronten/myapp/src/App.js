import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { Routes, Route } from "react-router-dom";
import New from "./New";
function App() {
  return (
    <>
      <Routes>
        <>
          <Route exact path="/" element={<New />} />
        </>
      </Routes>
    </>
  );
}

export default App;
