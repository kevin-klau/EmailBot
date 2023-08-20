from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, Resource, reqparse

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
user = "ethan.rong@gmail.com"
passw = config.passw

prompt = f"""  Write an email (only include their first name from the name column) who works 
at  [BLACK_COMPANY]. The purpose of the email is to explain to [BLACK_CONTACT] about the opportunity to sponsor HackThe6ix Hackathon’s 5th year anniversary. HackThe6ix is held in Downtown Toronto every year and is the city’s biggest Hackathon inviting 200+ hackers from high schools and universities. This year our theme for the hackathon is AI and we have an emphasis for students to make AI apps using OpenAI’s API, Stable Diffusion and other generative AI. We would love for you to be a part of charging this AI revolution within the young population and sponsoring us to make this special annual event possible.

Summary of the Event:

HackThe6ix is a 36-hour hackathon scheduled for August 18th to August 20th 2023. Over that weekend, more than 200 students across Canada will build technical projects and pitch to judges. Last year at HackThe6ix, there were over 70 projects built, ranging from Metaverse-inspired projects, voice recognition applications to improve accessibility, to credit card fraud detection leveraging machine learning. HackThe6ix empowers students to nurture their curiosity, develop technological literacy in a rapidly-changing world, and network with companies that are at forefront of innovation.

Attached is a sponsorship package. 
 ‘ Sign the email signaturer 
with Hardeep Gambhir, include a link to Hardeep’s linkedin, https://www.linkedin.com/in/hardeep-gambhir/. Do not include a subject line. When you first mention HackThe6ix, 
make it link to 'https://hackthe6ix.com/', only write this link once. Write one sentence based on [BLACK_DESCRIP] 
about why this is a good fit for both of us. be concise. everything else should be the same as the quoted text. do not italicize anything. 
do not include any other links than the ones mentioned, this means, only include in the final message 
, URLs that are listed in this prompt. Do it in 100 words"""


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
email_post_args.add_argument(
    "user", type=str, help="Username needed", required=True)
email_post_args.add_argument(
    "passw", type=str, help="Password needed", required=True)
email_post_args.add_argument(
    "prompt", type=str, help="Needed Prompt", required=True)

# Log In For Usage


class Email(Resource):
    def post(self, recipientID):
        global user
        global passw
        global prompt

        print("HIII")
        user = email_post_args.parse_args()["user"]
        passw = email_post_args.parse_args()["passw"]
        prompt = email_post_args.parse_args()["prompt"]

        print(user, passw, prompt)

        return 200

    def get(self, recipientID):
        global user
        global passw
        global messages
        global df

        # Create the email message
        recipientID -= 1
        msg = MIMEMultipart()
        msg['From'] = user
        msg['To'] = df.loc[recipientID, 'Primary Contact Email']
        msg['Subject'] = f"{df.loc[recipientID, 'Job Type']} Position At {df.loc[recipientID, 'Employer Name']}"

        # Attach the HTML content as a separate part
        html_content = messages[recipientID]
        msg.attach(MIMEText(html_content, 'html'))

        # Send the email using Gmail's SMTP server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(user, passw)

        # Instead of attempting to access as_string()[0], use as_string() directly
        text = msg.as_string()

        server.sendmail(
            user, df.loc[recipientID, 'Primary Contact Email'], text)
        server.quit()
        print('Email sent successfully')


file_patch_args = reqparse.RequestParser()
file_patch_args.add_argument(
    "body", type=str, help="Body needed", required=True)

# Upload CSV File For Usage


class File(Resource):
    def post(self, recipientID):  # Upload File
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
        headers = ["Employer Name", "Description",
                   "Primary Contact", "Primary Contact Email", "Job Type"]

        if all(elem in headers for elem in cols):
            return {"response": "Header Missing"}, 400

        return {"response": "Success", "numsDisplay": df.shape[0]}, 200

    def get(self, recipientID):  # Grabs Data from Specific Index
        global df
        global prompt

        check = checkIfExists(recipientID)
        if check != True:
            return check

        LP_name = df.loc[recipientID, 'Employer Name']
        description = df.loc[recipientID, 'Description']
        contact_name = df.loc[recipientID, 'Primary Contact']
        contact_email = df.loc[recipientID, 'Primary Contact Email']
        job = df.loc[recipientID, 'Job Type']
        print("contact email: ", contact_email, job)

        response = openai.ChatCompletion.create(model="gpt-4", messages=[{"role": "user",
                                                                          "content": prompt + f"BLANK_CONTACT: {contact_name} BLANK_DESCRIP: {description} BLANK_COMPANY: {LP_name}"
                                                                          }], temperature=0, max_tokens=5000)

        # Extract and print the response
        if 'choices' in response:
            email_body = response['choices'][0]['message']["content"].strip()
            messages[recipientID] = email_body
            print(email_body)
        else:
            print(f"Error: {response['error']}")

        return {
            "subject": f"{job} Position At {LP_name}",
            "email": contact_email,
            "body": email_body
        }, 200

    def put(self, recipientID):  # Modifies Message
        global messages
        check = checkIfExists(recipientID)
        if check != True:
            return check

        try:
            print("BOHOUR")
            messages[recipientID-1] = file_patch_args.parse_args()["body"]
            print(file_patch_args.parse_args()["body"])
        except KeyError:
            return 400
        print(messages)
        return 200


api.add_resource(File, "/file/<int:recipientID>")
api.add_resource(Email, "/email/<int:recipientID>")
app.run(host="0.0.0.0", port=3000)
