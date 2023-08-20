import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import icon from "./Logo.jpg";
import paperclip from "./paperclip.jpg";
import plus from "./plus.jpg";
import { getCSV, patchCSV, postCSV, sendEmail, logIn } from "./APICalls";
import Loading from "./assets/loading.gif"

let x = 1;

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

function InputStuff({ email, subject, body, active, pos, notif, setNotif }) {
  const [emailN, setEmail] = useState(email || "");
  const [subjectN, setSubject] = useState(subject || "");
  const [bodyN, setBody] = useState(body || "");  

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
      console.log(bodyN)
      const patchResp = await patchCSV(pos, bodyN);
      const resp = await sendEmail(pos); // send get request to api
      setNotif(true); // assuming this is the correct function to show the notification
  
      // Hide the notification after 3 seconds
      setTimeout(() => {
        setNotif(false);
      }, 3000);
  
    } catch (error) {
      console.log("Server Error:", error); // Log the error
    }
  };
  

  return (
    <div style={{ alignItems: "left", textAlign: "left" }}>
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

        <h3 style={{ textAlign: "left", fontSize: "20px", marginTop: "20px" }}>
          Body
        </h3>
        <textarea
          id="bodyInput"
          type="text"
          value={bodyN}
          style={{
            width: "1050px",
            height: "30vh",
            color: "#727272",
            border: "0px",
            borderRadius: "8px",
            fontSize: "15px",
            padding: "10px 10px 10px 10px",
            overflowX: "hidden",
          }}
          onChange={handleBody}
          disabled={!active}
        />
      
       

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
    </div>
  );
}

function App() {
  const [showNotification, setShowNotification] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null);
  const [numberEmails, setNumberEmails] = useState(1);
  const [pos, setPos] = useState(1);
  const [active, setActive] = useState(false);

  const [sendEmail, setSendEmail] = useState("Email Here");
  const [subject, setSubject] = useState("Subject Here");
  const [body, setBody] = useState("Body Here");

  const [userGmail, setUserGmail] = useState("Example@gmail.com");
  const [userPass, setUserPass] = useState("Enter Password Here");
  const [prompt, setPrompt] = useState("");

  const [loading, setLoading] = useState(false)

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setActive(true);
    setLoading(true)
    try {
      const response = await postCSV(file); // Upload to DF
      const data = await getCSV(pos-1); // GPT API Call (get method)

      console.log(response);
      console.log(data);

      x=response.numsDisplay;
      // SETTING BODY TEXT HERE
      setSendEmail(data.email);
      setSubject(data.subject);
      setBody(data.body);
      setNumberEmails(response.numsDisplay);
      x = response.numsDisplay;
    } catch (error) {
      console.log("Server Error");
    } finally {
      setLoading(false)
    }

    setActive(true);
    const targetElement = document.getElementById("Rest");

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRetrieval = async (num) => {
    setLoading(true)

    try {
      setSendEmail("Loading...");
      setSubject("Loading...");
      setBody("Loading...");

      const data = await getCSV(num);

      setSendEmail(data.email);
      setSubject(data.subject);
      setBody(data.body);

    } catch (error) {
      console.log("Server Error");
    } finally {
      setLoading(false)
    }
  };

  const handleUser = (event) => {
    setUserGmail(event.target.value);
  };

  const handlePass = (event) => {
    setUserPass(event.target.value);
  };

  const handleContinue = async () => {
    try{
      await logIn(userGmail, userPass, prompt);
    } catch (error) {
      console.log("server error")
    }

    const targetElement = document.getElementById("fileUpload");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }

  }

  const handleLeft = () =>{
    if(pos-1 >= 1){
      setPos(pos-1);
      handleRetrieval(pos);
    }
  }

  const handleRight = () =>{
    if(pos+1 <= x){
      setPos(pos+1);
      handleRetrieval(pos);
    }
  }

  return (
    <div>
      <div style={{marginBottom:"30px"}}>
        <div style={{textAlign:"left", display: "flex"}}>
          <img src={icon} alt="" style={{width:"55px", marginBottom:"40px"}}/> 
          <h2 style={{paddingLeft:"15px", marginTop:'10px', fontSize:"30px"}}>Mail Reach</h2>
        </div>

        <div style={{marginTop:"-15px",marginBottom:"10px", marginLeft:"20px"}}>
        <div style={{marginLeft:"50px",display:'flex',marginBottom:"10px", justifyContent:'left'}}>
          <h4 style={{fontSize:"30px"}}>Email:</h4>
          <input type="text" id="emailInput" className="userpass" onChange={handleUser} placeholder={userGmail} style={{marginLeft:"95px"}}/>

        </div>

        <div style={{marginLeft:"50px",display:'flex',marginBottom:"30px", justifyContent:'left',marginTop:"10px"}}>
          <h4 style={{fontSize:"30px"}}>Password:</h4>
            <input type="password" id="emailInput" className="userpass" onChange={handlePass} placeholder="Insert Password Here"/>
        </div>

        <h3>How Would You Like Your Emails Formatted?</h3>
        <textarea id="bodyInput" type="text" style={{width:"1100px", height:"300px", color:"#727272", border:"0px", borderRadius:"8px", fontSize:"16px", padding:"10px 20px 10px 20px", overflowX:'hidden'}} onChange={(event) => setPrompt(event.target.value)} 
       placeholder={
        'EXAMPLE: Write an email (only include their first name from the name column) who works ' +
        'at [company name]. The purpose of the email is to explain to [contact name] about the opportunity to sponsor HackThe6ix Hackathon’s 5th year anniversary. ' +
        'HackThe6ix is held in Downtown Toronto every year and is the city’s biggest Hackathon inviting 200+ hackers from high schools and universities. ' +
        'This year our theme for the hackathon is AI and we have an emphasis for students to make AI apps using OpenAI’s API, Stable Diffusion and other generative AI. ' +
        'We would love for you to be a part of charging this AI revolution within the young population and sponsoring us to make this special annual event possible.' +
        '\n\nSummary of the Event:\n\n' +
        'HackThe6ix is a 36-hour hackathon scheduled for August 18th to August 20th 2023. Over that weekend, more than 200 students across Canada will build technical projects and pitch to judges. ' +
        'Last year at HackThe6ix, there were over 70 projects built, ranging from Metaverse-inspired projects, voice recognition applications to improve accessibility, ' +
        'to credit card fraud detection leveraging machine learning. HackThe6ix empowers students to nurture their curiosity, develop technological literacy in a rapidly-changing world, ' +
        'and network with companies that are at forefront of innovation.' +
        '\n\nAttached is a sponsorship package. Sign the email signature with Hardeep Gambhir, include a link to Hardeep’s linkedin, ' +
        'https://www.linkedin.com/in/hardeep-gambhir/. Do not include a subject line. When you first mention HackThe6ix, ' +
        'make it link to \'https://hackthe6ix.com/\', only write this link once. Write one sentence based on {description} ' +
        'about why this is a good fit for both of us. be concise. everything else should be the same as the quoted text. do not italicize anything. ' +
        'do not include any other links than the ones mentioned, this means, only include in the final message, URLs that are listed in this prompt.'
    }
       />
        
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

      {
        loading === true &&
          <div>
            <h2> Loading.... </h2>
            <img 
              src={Loading} 
              alt="Loading GIF" 
              style={{ width: '100px', height: 'auto' }}
            />  
          </div>
      }


      <div id="Rest" style={{paddingTop:"30px", marginLeft:"80px"}}>
         <div style={{display:"flex"}}>
          <h2 style={{textAlign:'left', marginBottom:"20px", fontSize:"25px"}}>Edit Draft {pos}/{numberEmails}</h2>
          <button id="e" className="blueButton btn" style={{marginLeft:"750px", paddingTop:"5px", paddingBottom:"5px"}} onClick={handleLeft}>←</button>
          <button id="e" className="blueButton btn" style={{marginLeft:"20px", paddingTop:"5px", paddingBottom:"5px"}} onClick={handleRight}>→</button>
        </div> 
        <InputStuff key={pos} pos={pos} email={sendEmail} subject={subject} body={body} active={active} notif={showNotification} setNotif={setShowNotification}/>
      </div>

      { showNotification === true && 
          <div className="flex flex-">
            Email Sent Sucessfully!
          </div>
      }
    </div>
  )
}

export default App;
