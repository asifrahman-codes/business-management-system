import { BrowserRouter, Routes, Route } from "react-router-dom";

import TestApi from "./pages/TestApi";

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">
        Business Management System
      </h1>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test-api" element={<TestApi />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;