import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.toString());
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Brilliant Cloud App</h1>
      <hr />
      
      {loading && <p>Loading backend status...</p>}
      
      {error && (
        <div style={{ color: "red", border: "1px solid red", padding: "10px" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {data && (
        <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "5px" }}>
          <h3>Backend Response:</h3>
          <p><strong>Message:</strong> {data.message}</p>
          <p><strong>DB Status:</strong> {data.db_status === 1 ? "Connected (1)" : "Disconnected"}</p>
        </div>
      )}
      
      <p style={{ marginTop: "20px", fontSize: "0.8em", color: "#555" }}>
        Running on Minikube Cluster
      </p>
    </div>
  );
}

export default App;