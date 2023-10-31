import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Root from "./routes/root";
import Document from "./routes/document";
import { Toaster } from "react-hot-toast";
import "./index.css"

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/document/:documentId" element={<Document />} />
      </Routes>

      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
};

export default App;
