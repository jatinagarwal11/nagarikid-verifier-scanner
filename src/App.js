import React, { useState, useEffect, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './App.css';

function App() {
  const [result, setResult] = useState(null);
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

  const onScanSuccess = useCallback(async (decodedText) => {
    try {
      const data = JSON.parse(decodedText);
      const res = await fetch(`${API_BASE}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const verification = await res.json();
      setResult(verification);
    } catch (err) {
      setResult({ verified: false, error: 'Invalid QR' });
    }
  }, [API_BASE]);

  const onScanFailure = useCallback((error) => {
    console.warn(`Code scan error = ${error}`);
  }, []);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });
    scanner.render(onScanSuccess, onScanFailure);
    return () => scanner.clear();
  }, [onScanSuccess, onScanFailure]);

  return (
    <div className="scanner">
      <h1>NagarikID Verifier</h1>
      <div id="reader"></div>
      {result && (
        <div className="result">
          {result.verified ? (
            <>
              <h2>Identity Verified</h2>
              <p>Name: {result.name}</p>
              <p>DOB: {result.dob}</p>
              <p>National ID: {result.national_id}</p>
              <img src={result.photo_url} alt="Verified person's photo" />
            </>
          ) : (
            <h2>Verification Failed</h2>
          )}
        </div>
      )}
    </div>
  );
}

export default App;