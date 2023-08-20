import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import icon from './Logo.jpg';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  

  return (
    <div>
      <div style={{textAlign:"left", display: "flex"}}>
        <img src={icon} alt="" style={{width:"55px", marginBottom:"40px"}}/> 
        <h2 style={{paddingLeft:"15px", marginTop:'10px', fontSize:"30px"}}>Email Bot</h2>
      </div>
      <h1 style={{ fontWeight: "bold", paddingLeft: "50px", paddingRight: "50px", fontSize:"40px", marginBottom:"40px"}}>Upload Your .CSV/.XLXS File With The Columns: Name, Email, Company Name, About Them, About You, and Your Ask</h1>
      <label id="king" htmlFor="doc" style={{padding:"40px 250px 40px 250px", border:"5px dotted grey", borderRadius:"70px", backgroundColor:""}}>
        <img src="https://th.bing.com/th/id/OIP.PAwVQQ7Z_xYlGEmJZLFtmQAAAA?pid=ImgDet&rs=1" alt="" style={{width:"100px", marginBottom:"25px"}}/> 
        <div className="space-y-2">
            <h4 className="text-base font-semibold text-gray-700" style={{fontSize:"40px",fontWeight: "bold"}}>Upload Here</h4>
            <span className="text-sm text-gray-500">.CSV or .XLXS Only</span>
        </div>
        <input type="file" id="doc" name="doc" accept="png, jpg" hidden onChange={handleFileChange}/>
        
      </label>

      
    </div>
  )
}

export default App
