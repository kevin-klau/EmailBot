import { useState } from 'react';
import { getCSV, postCSV } from './APICalls';
import './App.css';

function App() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    try {
      const response = await postCSV(file);
      console.log(response);
    } catch (error) {
      console.log("Server Error");
    }
  };

  const handleRetrieval = async () => {
    try {
      const response = await getCSV(0);
      console.log(response);
    } catch (error) {
      console.log("Server Error");
    }
  }

  return (
    <div>
      <input
        type="file" 
        onChange={(event) => { 
          setFile(event.target.files[0]);
        }}
      />
      <button onClick={handleUpload}>
        submit
      </button>

      <button onClick={handleRetrieval}>
        get
      </button>
    </div>
  )
}

export default App;
