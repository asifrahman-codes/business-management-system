import { useEffect, useState } from "react";
import api from "../services/api";

function TestApi() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await api.get("/health");
        setMessage(response.data.message);
      } catch (error) {
        setMessage("Backend connection failed");
      }
    };

    checkApi();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-semibold">
        {message}
      </h1>
    </div>
  );
}

export default TestApi;