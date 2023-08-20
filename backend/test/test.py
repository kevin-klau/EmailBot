import os
import pandas as pd
import openai
import config

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


api_key = config.key
openai.api_key = api_key

# Read the CSV file
data = pd.read_csv('./backend/test/file.csv')


for i in range(1, 3):
  # generate email based off of description
  LP_name = data.loc[i, 'Employer Name']
  description = data.loc[i, 'Description']
  contact_name = data.loc[i, 'Primary Contact']
  contact_email = data.loc[i, 'Primary Contact Email']
  print("contact email: ", contact_email)

  if i%2 == 0:
    prompt = f"Write an HTML formated email to {contact_name} (only include their first name) who works at {LP_name}. {LP_name} could be dscribed as: {description}. The purpose of the email is to explain to {contact_name} about the opportunity to invest in The Residency. Copy this exactly 'The Residency aims to globally scale our approach to higher education. We keep the social experience of college by providing housing on college campuses, and we revamp the educational experience by utilizing AI, peer instruction, and project-based learning. Instead of tuition, we financially invest in our students. Instead of degrees, we use portfolios.\n Sam Altman, CEO of OpenAI, advises us as we leverage AI for our first program in Berkeley, CA, which targets founders and has drawn over 200 founders from Harvard, Stanford, and other prestigious institutions.\n Would love to find a time to chat.' Sign the email signaturer with Nick Linck, include a link to Nick's linkedin, https://www.linkedin.com/in/nick-linck-417b0ba9/ and his Twitter https://twitter.com/nick_linck. Do not include a subject line. When you first mention The Residency, make it link to 'https://www.livetheresidency.com/', only write this link once. Write one sentence based on {description} about why this is a good fit. be concise. everything else should be the same as the quoted text. do not italicize anything. do not include any other links than the ones mentioned, this means, only include in the final message, URLs that are listed in this prompt"
  else:
    prompt = f"Write an HTML formated email to {contact_name} (only include their first name) who works at {LP_name}. {LP_name} could be dscribed as: {description}. The purpose of the email is to explain to {contact_name} about the opportunity to invest in The Residency. Copy this exactly 'The Residency aims to globally scale our approach to higher education. We keep the social experience of college by providing housing on college campuses, and we revamp the educational experience by utilizing AI, peer instruction, and project-based learning. Instead of tuition, we financially invest in our students. Instead of degrees, we use portfolios.\n Sam Altman, CEO of OpenAI, advises us as we leverage AI for our first program in Berkeley, CA, which targets founders and has drawn over 200 founders from Harvard, Stanford, and other prestigious institutions.\n Would love to find a time to chat. If convenient for you, you can grab a time here.' (link to https://usemotion.com/meet/nick-linck/meeting?d=30 where it says 'here') Sign the email signaturer with Nick Linck, include a link to Nick's linkedin, https://www.linkedin.com/in/nick-linck-417b0ba9/ and his Twitter https://twitter.com/nick_linck. Do not include a subject line. When you first mention The Residency, make it link to 'https://www.livetheresidency.com/', only write this link once. Write one sentence based on {description} about why this is a good fit. be concise. everything else should be the same as the quoted text. do not italicize anything. do not include any other links than the ones mentioned"

  messages = [{"role": "user", "content": prompt}]
  
  response = openai.ChatCompletion.create(model="gpt-4", messages=messages, temperature=0, max_tokens=5000)
  
  # Extract and print the response
  if 'choices' in response:
      email_body = response['choices'][0]['message']["content"].strip()
      print(email_body)
  else:
      print(f"Error: {response['error']}")

  #####################
  ### Sending Email ###
  #####################
  
  # Replace these with your email credentials
  email_sender = 'abhinav.kapooria@gmail.com'
  email_password = config.passw
  email_recipient = contact_email
  
  # Create the email message
  msg = MIMEMultipart()
  msg['From'] = email_sender
  msg['To'] = email_recipient
  msg['Subject'] = 'Intro to The Residency: Higher Ed that Works'
  
  msg.attach(MIMEText(email_body, 'html'))
  
  # Send the email using Gmail's SMTP server
  try:
      server = smtplib.SMTP('smtp.gmail.com', 587)
      server.starttls()
      server.login(email_sender, email_password)
      text = msg.as_string()
      server.sendmail(email_sender, email_recipient, text)
      server.quit()
      print('Email sent successfully')
  except Exception as e:
      print(f'Error: {e}')
      print('Failed to send the email')
  
