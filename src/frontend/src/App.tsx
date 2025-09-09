import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Markeatplace from "./screens/Marketplace";
import DashboardUser from "./screens/DashboardUser";
import Asset from "./screens/Asset";
import Authentication from "./screens/Authentication";
import Courting from "./screens/Courting";
import CourtingProblem from "./screens/CourtingProblem";
import { ModalProvider } from "./context/ModalContext";

function App() {
  return (
    <Router>
      <ModalProvider>
        <Routes>
          <Route path="/" element={<Markeatplace />} index />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/dashboard" element={<DashboardUser />} />
          <Route path="/asset/:assetid" element={<Asset />} />
          <Route path="/report" element={<Courting />} />
          <Route path="/report/:reportid" element={<CourtingProblem />} />
        </Routes>
      </ModalProvider>
    </Router>
  );
}

export default App;
