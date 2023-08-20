import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import icon from "./Logo.jpg";
import paperclip from "./paperclip.jpg";
import plus from "./plus.jpg";
import { getCSV, postCSV, sendEmail} from "./APICalls"

function FileContain({ text }) {
  return (
    <div
      style={{
        backgroundColor: "#F0F0F0",
        borderRadius: "8px",
        marginBottom: "10px",
        padding: "3px 10px 3px 10px",
        display: "inline-block",
        marginRight: "15px",
      }}
    >
      <img
        src={paperclip}
        style={{
          width: "20px",
          height: "20px",
          marginRight: "10px",
          marginTop: "2px",
          marginBottom: "5px",
          display: "inline-block",
        }}
      />
      <p
        style={{
          display: "inline-block",
          marginBottom: "0px",
          fontSize: "15px",
        }}
      >
        {text}
      </p>
    </div>
  );
}

function InputStuff({ email, subject, body, active, pos }) {
  const [emailN, setEmail] = useState(email);
  const [subjectN, setSubject] = useState(subject);
  const [bodyN, setBody] = useState(body);

  useEffect(() => {
    setEmail(email);
    setSubject(subject);
    setBody(body);
  }, [email, body, subject]);

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleSubject = (event) => {
    setSubject(event.target.value);
  };

  const handleBody = (event) => {
    setBody(event.target.value);
  };

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const newSelectedFiles = [
      ...selectedFiles,
      ...Array.from(event.target.files),
    ];
    setSelectedFiles(newSelectedFiles);
  };

  const handleCancel = (event) => {};

  const handleSend = async () => {
    try {
      await sendEmail(pos); // send get request to api
    } catch (error) {
      console.log("Server Error");
    }

  };

  return (
    <div style={{alignItems:'left', textAlign:"left"}}>
    <div style={{ alignItems: "left", textAlign: "left" }}>
      <h3 style={{ textAlign: "left", fontSize: "20px" }}>Email</h3>
      <input
        id="emailInput"
        type="text"
        value={emailN}
        style={{
          width: "1050px",
          color: "#727272",
          border: "0px",
          borderRadius: "8px",
          fontSize: "15px",
          padding: "10px 10px 10px 10px",
        }}
        onChange={handleEmail}
        disabled={true}
      />

      <h3 style={{ textAlign: "left", fontSize: "20px", marginTop: "20px" }}>
        Subject
      </h3>
      <input
        id="emailInput"
        type="text"
        value={subjectN}
        style={{
          width: "1050px",
          color: "#727272",
          border: "0px",
          borderRadius: "8px",
          fontSize: "15px",
          padding: "10px 10px 10px 10px",
        }}
        onChange={handleSubject}
        disabled={true}
      />

      <h3 style={{textAlign:"left", fontSize:"20px", marginTop:"20px"}}>Body</h3>
      <textarea id="bodyInput" type="text" value={bodyN} style={{width:"84vw", height:"30vh", color:"#727272", border:"0px", borderRadius:"8px", fontSize:"15px", padding:"10px 10px 10px 10px", overflowX:'hidden'}} onChange={handleBody} disabled={!active}/>

      <h4 style={{ fontSize: "17px", marginTop: "10px" }}>Attach File</h4>
      <div>
        <div style={{ marginLeft: "-30px", marginBottom: "-10px" }}>
          <ul>
            {selectedFiles.map((file, index) => (
              <FileContain key={index} text={file.name}></FileContain>
            ))}
          </ul>
        </div>

        <label
          id="kev"
          style={{
            backgroundColor: "#F0F0F0",
            borderRadius: "8px",
            marginBottom: "0px",
            padding: "3px 0px 3px 10px",
            display: "flex",
            width: "170px",
          }}
          disabled={!active}
        >
          <img
            src={plus}
            style={{
              width: "20px",
              height: "20px",
              marginRight: "10px",
              marginTop: "2px",
            }}
          />
          <p style={{ fontSize: "14px", height: "7px", marginTop: "2px" }}>
            Add More Files
          </p>
          <input
            disabled={!active}
            type="file"
            hidden
            multiple
            onChange={handleFileChange}
            style={{ height: "30px" }}
          />
        </label>

        <div
          style={{
            display: "flex",
            marginTop: "15px",
            alignItems: "right",
            marginRight: "50px",
            justifyContent: "flex-end",
          }}
        >
          <button
            style={{
              backgroundColor: "transparent",
              color: "#102DE9",
              fontWeight: "bold",
              paddingTop: "5px",
              paddingBottom: "5px",
            }}
            onClick={handleCancel}
            disabled={!active}
          >
            Cancel
          </button>
          <button
          id="e"
          className="blueButton btn"
            style={{
              marginLeft: "10px",
              paddingTop: "5px",
              paddingBottom: "5px",
            }}
            onClick={handleSend}
            disabled={!active}
          >
            Send
          </button>
        </div>
      </div>
    </div> </div>
  );
}

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [numberEmails, setNumberEmails] = useState(1);
  const [pos, setPos] = useState(0);
  const [active, setActive] = useState(false);

  const [sendEmail, setSendEmail] = useState("Email Here");
  const [subject, setSubject] = useState("Subject Here");
  const [body, setBody] = useState("Body Here");

  const [userGmail, setUserGmail] = useState("Example@gmail.com")
  const [userPass, setUserPass] = useState("Enter Password Here")

  const [prompt, setPrompt] = useState("")
  let x = 1;
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setActive(true);

    try {
      const response = await postCSV(file); // Upload to DF
      const data = await getCSV(pos); // GPT API Call (get method)

      console.log(response);
      console.log(data);

      x=response.numsDisplay;
      // SETTING BODY TEXT HERE
      setSendEmail(data.email);
      setSubject(data.subject);
      setBody(data.body);
      setNumberEmails(response.numsDisplay);


    } catch (error) {
      console.log("Server Error");
    }

    setActive(true);
    const targetElement = document.getElementById("Rest");

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
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

  const handleUser = (event) => {
    setUserGmail(event.target.value);
  };

  const handlePass = (event) => {
    setUserPass(event.target.value);
  };

  const handleContinue = () =>{
    const targetElement = document.getElementById("fileUpload");

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }

  }

  const handleLeft = () =>{
    if(pos-1 >= 1) setPos(pos-1);

  }

  const handleRight = () =>{
    if(pos+1 <= x) setPos(pos+1);
    
  }

  return (
    <div>
      <div style={{marginBottom:"100px"}}>
        <div style={{textAlign:"left", display: "flex"}}>
          <img src={icon} alt="" style={{width:"55px", marginBottom:"40px"}}/> 
          <h2 style={{paddingLeft:"15px", marginTop:'10px', fontSize:"30px"}}>Email Bot</h2>
        </div>

        <div style={{marginTop:"-15px",marginBottom:"10px", marginLeft:"20px"}}>
        <div style={{marginLeft:"50px",display:'flex',marginBottom:"10px", justifyContent:'left'}}>
          <h4 style={{fontSize:"30px"}}>Email:</h4>
          <input type="text" id="emailInput" className="userpass" onChange={handleUser} placeholder={userGmail} style={{marginLeft:"95px"}}/>

        </div>

        <div style={{marginLeft:"50px",display:'flex',marginBottom:"30px", justifyContent:'left',marginTop:"10px"}}>
          <h4 style={{fontSize:"30px"}}>Password:</h4>
            <input type="password" id="emailInput" className="userpass" onChange={handlePass} placeHolder="Insert Password Here"/>
        </div>

        <h3>How Would You Like Your Emails Formatted?</h3>
        <textarea id="bodyInput" type="text" style={{width:"1100px", height:"300px", color:"#727272", border:"0px", borderRadius:"8px", fontSize:"16px", padding:"10px 20px 10px 20px", overflowX:'hidden'}} onChange={(event) => setPrompt(event.target.value)} placeholder="For Example: Write an email to {contact_name} (only include their first name) who works at {LP_name}. {LP_name} could be dscribed as: {description}. The purpose of the email is to explain to {contact_name} about the opportunity to invest in The Residency. Copy this exactly 'The Residency aims to globally scale our approach to higher education. We keep the social experience of college by providing housing on college campuses, and we revamp the educational experience by utilizing AI, peer instruction, and project-based learning. Instead of tuition, we financially invest in our students. Instead of degrees, we use portfolios.\n Sam Altman, CEO of OpenAI, advises us as we leverage AI for our first program in Berkeley, CA, which targets founders and has drawn over 200 founders from Harvard, Stanford, and other prestigious institutions.\n Would love to find a time to chat.' Sign the email signaturer with Nick Linck, include a link to Nick's linkedin, https://www.linkedin.com/in/nick-linck-417b0ba9/ and his Twitter https://twitter.com/nick_linck. Do not include a subject line. When you first mention The Residency, make it link to 'https://www.livetheresidency.com/', only write this link once. Write one sentence based on {description} about why this is a good fit. be concise. everything else should be the same as the quoted text. do not italicize anything. do not include any other links than the ones mentioned, this means, only include in the final message, URLs that are listed in this prompt"/>
        
        </div>
        <button id="e" className="blueButton btn" style={{marginLeft:"10px", paddingTop:"5px", paddingBottom:"5px", marginBottom:"100px"}} onClick={handleContinue}>Continue</button>


        <h1 id="fileUpload" style={{ fontWeight: "bold", paddingLeft: "50px", paddingRight: "50px", fontSize:"40px", marginBottom:"40px", paddingTop:"75px"}}>Upload Your .CSV/.XLXS File With The Columns: Name, Email, Company Name, About Them, About You, and Your Ask</h1>
        <label id="king" htmlFor="doc" style={{padding:"40px 250px 40px 250px", border:"5px dotted grey", borderRadius:"70px", backgroundColor:""}}>
          <img src="https://th.bing.com/th/id/OIP.PAwVQQ7Z_xYlGEmJZLFtmQAAAA?pid=ImgDet&rs=1" alt="" style={{width:"100px", marginBottom:"25px"}}/> 
          <div className="space-y-2">
              <h4 className="text-base font-semibold text-gray-700" style={{fontSize:"40px",fontWeight: "bold"}}>Upload Here</h4>
              <span className="text-sm text-gray-500">.CSV or .XLXS Only</span>
          </div>
          <input type="file" id="doc" name="doc" accept="csv xlxs" hidden onChange={handleFileChange}/>
          
        </label>
      </div>

      <div id="Rest" style={{paddingTop:"30px", marginLeft:"80px"}}>
         <div style={{display:"flex"}}>
          <h2 style={{textAlign:'left', marginBottom:"20px", fontSize:"25px"}}>Edit Draft {pos}/{numberEmails}</h2>
          <button id="e" className="blueButton btn" style={{marginLeft:"750px", paddingTop:"5px", paddingBottom:"5px"}} onClick={handleLeft}>←</button>
          <button id="e" className="blueButton btn" style={{marginLeft:"20px", paddingTop:"5px", paddingBottom:"5px"}} onClick={handleRight}>→</button>
        </div> 
        <InputStuff key={pos} email={sendEmail} subject={subject} body={body} active={active}/>
      </div>



      
    </div>
  )
}

export default App;