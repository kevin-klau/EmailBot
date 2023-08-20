from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, Resource, reqparse, fields, marshal_with

import pandas as pd
import openai
import config

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


# FLASK API SETUP
app = Flask(__name__)
CORS(app)
api = Api(app)

# GLOBAL VARIABLES
user = ""
passw = ""
df = None
messages = {}

api_key = config.key
openai.api_key = api_key

# Checks If Record Number is Valid
def checkIfExists(targetID):
 # Check To See If Record Available
    try:
        if df == None:
            return {"response": "DataFrame Not Initialized"}
    except ValueError:
        if targetID >= df.shape[0]:
            return {"response": "DataFrame Not Initialized"}
    return True


email_post_args = reqparse.RequestParser()
email_post_args.add_argument("user", type=str, help="Username needed", required=True)
email_post_args.add_argument("passw", type=str, help="Password needed", required=True)

# Log In For Usage
class Email(Resource):
    def post(self, recipientID):
        global user
        global passw

        user = email_post_args.parse_args()["user"]
        passw = email_post_args.parse_args()["passw"]

        return 200

    def get(self, recipientID):
        global user
        global passw
        global messages
        global df

        # Create the email message
        msg = MIMEMultipart()
        msg['From'] = user
        msg['To'] = df.loc[recipientID, 'Primary Contact Email']
        msg['Subject'] = f"{df.loc[recipientID, 'Job Type']} Position At {df.loc[recipientID, 'Employer Name']}",
        msg.attach(MIMEText(messages[recipientID], 'html'))
        
        # Send the email using Gmail's SMTP server
        try:
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(user, passw)
            text = msg.as_string()
            server.sendmail(user, df.loc[recipientID, 'Primary Contact Email'], text)
            server.quit()
            print('Email sent successfully')
        except Exception as e:
            print(f'Error: {e}')
            print('Failed to send the email')
        
        return 200
  
        

file_patch_args = reqparse.RequestParser()
file_patch_args.add_argument("body", type=str, help="Body needed", required=True)

# Upload CSV File For Usage
class File(Resource):
    def post(self, recipientID): # Upload File
        global df

        try:
            uploaded_file = request.files['csv']
            if uploaded_file.filename[-4:] != ".csv":
                return {"response": "Not A CSV File"}, 415
        except KeyError:
            return {"response": "No File in the HTTP Body"}, 400

        # Check That Correct Headers Are Present
        df = pd.read_csv(uploaded_file)
        cols = df.columns.tolist()
        headers = ["Employer Name", "Description", "Primary Contact", "Primary Contact Email", "Job Type"]

        if all(elem in headers for elem in cols):
            return {"response": "Header Missing"}, 400
       
        return {"response": "Success", "numsDisplay": df.shape[0]}, 200

        
    def get(self, recipientID): # Grabs Data from Specific Index
        global df
        check = checkIfExists(recipientID)
        if check != True:
            return check

        if recipientID not in messages.keys():
            LP_name = df.loc[recipientID, 'Employer Name']
            description = df.loc[recipientID, 'Description']
            contact_name = df.loc[recipientID, 'Primary Contact']
            contact_email = df.loc[recipientID, 'Primary Contact Email']
            job = df.loc[recipientID, 'Job Type']
            print("contact email: ", contact_email, job)

            prompt = f"Write an HTML formated email to {contact_name} (only include their first name) who works at {LP_name}. {LP_name} could be dscribed as: {description}. The purpose of the email is to explain to {contact_name} about the opportunity to invest in The Residency. Copy this exactly 'The Residency aims to globally scale our approach to higher education. We keep the social experience of college by providing housing on college campuses, and we revamp the educational experience by utilizing AI, peer instruction, and project-based learning. Instead of tuition, we financially invest in our students. Instead of degrees, we use portfolios.\n Sam Altman, CEO of OpenAI, advises us as we leverage AI for our first program in Berkeley, CA, which targets founders and has drawn over 200 founders from Harvard, Stanford, and other prestigious institutions.\n Would love to find a time to chat.' Sign the email signaturer with Nick Linck, include a link to Nick's linkedin, https://www.linkedin.com/in/nick-linck-417b0ba9/ and his Twitter https://twitter.com/nick_linck. Do not include a subject line. When you first mention The Residency, make it link to 'https://www.livetheresidency.com/', only write this link once. Write one sentence based on {description} about why this is a good fit. be concise. everything else should be the same as the quoted text. do not italicize anything. do not include any other links than the ones mentioned, this means, only include in the final message, URLs that are listed in this prompt"
            messages[recipientID] = prompt

            response = openai.ChatCompletion.create(model="gpt-4", messages=[{"role": "user", "content": messages[recipientID]}], temperature=0, max_tokens=5000)
    
            # Extract and print the response
            if 'choices' in response:
                email_body = response['choices'][0]['message']["content"].strip()
                print(email_body)
            else:
                print(f"Error: {response['error']}")
        else:
            email_body = messages[recipientID]

        return {
            "subject": f"{job} Position At {LP_name}",
            "email": contact_email,
            "response": email_body
        }, 200
    
    def patch(self, recipientID): # Modifies Message
        global messages
        check = checkIfExists(recipientID)
        if check != True:
            return check
        
        try:
            messages[recipientID] = file_patch_args.parse_args()["body"]
        except KeyError:
            return 400
        
        return 200


api.add_resource(File, "/file/<int:recipientID>")
app.run(host="0.0.0.0", port=3000)


