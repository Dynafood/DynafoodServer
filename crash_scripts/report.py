import requests
import subprocess
import time
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from dotenv import dotenv_values

env_vars = dotenv_values('.env')

def check_api_endpoint(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return True
        else:
            return False
    except requests.exceptions.RequestException:
        return False

def execute_script(script_path):
    try:
        # subprocess.run(["python", script_path])
        print("execute new script")
    except FileNotFoundError:
        print(f"Script not found at {script_path}")
    except subprocess.SubprocessError:
        print("Error executing the script.")

def send_email(api_key, sender, recipient, subject, message):
    msg = MIMEMultipart()
    msg["From"] = sender
    msg["To"] = recipient
    msg["Subject"] = subject
    msg.attach(MIMEText(message, "plain"))

    try:
        with smtplib.SMTP("smtp.sendgrid.net", 587) as server:
            server.starttls()
            server.login("apikey", api_key)
            server.send_message(msg)
        print("Email sent successfully.")
    except smtplib.SMTPException as e:
        print("Error sending email:", str(e))

# API endpoint to check
api_endpoint = "http://localhost:8081/welcome"

# Path to the script to execute if the API endpoint is inaccessible
fallback_script = "fallback_script.py"

# SendGrid configuration
sendgrid_api_key = env_vars.get("SENDGRID_KEY")
sender_email = "info.dynafood@gmail.com"
receiver_email = "semetiqcookiez@gmail.com"
email_subject = "API endpoint is not accessible"
email_message = "The API endpoint is not accessible. Executing fallback script."
print(sendgrid_api_key)
while True:
    if check_api_endpoint(api_endpoint):
        print("API endpoint is accessible.")
        time.sleep(1)
    else:
        print("API endpoint is not accessible. Executing fallback script...")
        execute_script(fallback_script)
        send_email(sendgrid_api_key, sender_email, receiver_email, email_subject, email_message)
        time.sleep(60)
