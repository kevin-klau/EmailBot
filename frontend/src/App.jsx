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
            style={{
              marginLeft: "10px",
              backgroundColor: "#102DE9",
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [numberEmails, setNumberEmails] = useState(1);
  const [pos, setPos] = useState(0);
  const [active, setActive] = useState(false);

  const [sendEmail, setSendEmail] = useState("Email Here");
  const [subject, setSubject] = useState("Subject Here");
  const [body, setBody] = useState("Body Here");

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setActive(true);

    try {
      const response = await postCSV(file); // Upload to DF
      const data = await getCSV(pos); // GPT API Call (get method)

      console.log(response);
      console.log(data);

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

  return (
    <div>
      <div style={{ marginBottom: "100px" }}>
        <div style={{ textAlign: "left", display: "flex" }}>
          <img
            src={icon}
            alt=""
            style={{ width: "55px", marginBottom: "40px" }}
          />
          <h2
            style={{ paddingLeft: "15px", marginTop: "10px", fontSize: "30px" }}
          >
            Email Bot
          </h2>
        </div>
        <h1
          style={{
            fontWeight: "bold",
            paddingLeft: "50px",
            paddingRight: "50px",
            fontSize: "40px",
            marginBottom: "40px",
          }}
        >
          Upload Your .CSV/.XLXS File With The Columns: Name, Email, Company
          Name, About Them, About You, and Your Ask
        </h1>
        <label
          id="king"
          htmlFor="doc"
          style={{
            padding: "40px 250px 40px 250px",
            border: "5px dotted grey",
            borderRadius: "70px",
            backgroundColor: "",
          }}
        >
          <img
            src="https://th.bing.com/th/id/OIP.PAwVQQ7Z_xYlGEmJZLFtmQAAAA?pid=ImgDet&rs=1"
            alt=""
            style={{ width: "100px", marginBottom: "25px" }}
          />
          <div className="space-y-2">
            <h4
              className="text-base font-semibold text-gray-700"
              style={{ fontSize: "40px", fontWeight: "bold" }}
            >
              Upload Here
            </h4>
            <span className="text-sm text-gray-500">.CSV or .XLXS Only</span>
          </div>
          <input
            type="file"
            id="doc"
            name="doc"
            accept="csv xlxs"
            hidden
            onChange={handleFileChange}
          />
        </label>
      </div>

      <div
        id="Rest"
        style={{ paddingTop: "30px", height: "100vh", marginLeft: "5vw" }}
      >
        <h2
          style={{ textAlign: "left", marginBottom: "20px", fontSize: "25px" }}
        >
          Edit Draft {pos}/{numberEmails}
        </h2>
        <InputStuff
          email={sendEmail}
          subject={subject}
          body={body}
          active={active}
          pos={pos}
        />
      </div>
    </div>
  );
}

export default App;
