import subprocess
import time
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os
import datetime

load_dotenv()

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
        last_sent = datetime.datetime.now()
    except smtplib.SMTPException as e:
        print("Error sending email:", str(e))

def check_tmux_process(session_name):
    # Check if the tmux session exists
    session_exists = subprocess.run(['tmux', 'has-session', '-t', session_name], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if session_exists.returncode != 0:
        print(f"Session '{session_name}' does not exist.")
        return

    # Get the process status from the tmux session
    process_status = subprocess.run(['tmux', 'list-panes', '-t', session_name, '-F', '#F #{pane_pid} #{pane_current_command}'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    process_list = process_status.stdout.decode('utf-8').strip().split('\n')

    sleeper = 1

    for process_info in process_list:
        process_info_parts = process_info.split()
        if len(process_info_parts) >= 2:
            pid = process_info_parts[1]
            command = ' '.join(process_info_parts[2:])
            # Check if the process is still running
            process_running = subprocess.run(['ps', '-p', pid], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            if process_running.returncode == 0 and command == "npm":
                print(f"\033[32mProcess '{command}' is running.\033[0m")
            elif process_running.returncode == 0 and command == "bash":
                print(f"\033[31mProcess '{command}' is running..\033[0m")
                error_output = subprocess.run(['tmux', 'capture-pane', '-pt', session_name], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
                output = "Last output from 'npm':\n\n"
                if error_output.stdout != None:
                    output += f"stdout: {error_output.stdout.decode('utf-8')[-1000:]}"
                if error_output.stderr != None:
                    output += f"\nstderr:\n{error_output.stderr.decode('utf-8')[-1000:]}"
                email_message = f"The server crashed.\n\n{output}\n\n Executing fallback script."
                print(output)
                execute_script(fallback_script)
                send_email(sendgrid_api_key, sender_email, receiver_email, email_subject, email_message)
                sleeper = 1800
            else:
                # Retrieve the error output
                error_output = subprocess.run(['tmux', 'capture-pane', '-pt', session_name], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True)
                output = f"\033[31mProcess '{command}' has exited with error output:\n\033[0m"
                if error_output.stdout != None:
                    output += f"\nstdout: {error_output.stdout.decode('utf-8')[-1000:]}\n"
                if error_output.stderr != None:
                   output += f"\nstderr: {error_output.stderr.decode('utf-8')[-1000:]}"
                email_message = f"\033[31mThe server crashed.\n\n{output}\n\n Executing fallback script.\033[0m"
                print(output)
                execute_script(fallback_script)
                send_email(sendgrid_api_key, sender_email, receiver_email, email_subject, email_message)
                sleeper = 1800
            time.sleep(sleeper)


# Example usage
session_name = 'DynafoodServerDev' #'DevelopmentDynafood'
# Path to the script to execute if the API endpoint is inaccessible
fallback_script = "INSERT SCRIPT LATER HERE"

# SendGrid configuration
sendgrid_api_key = os.getenv("SENDGRID_KEY")
sender_email = "info.dynafood@gmail.com"
receiver_email = "semetiqcookiez@gmail.com" #TODO: INSERT EMAIL TO SEND TO HERE //use the dynafood crators email
email_subject = "Server Crashed"
last_sent = None
while True:
    check_tmux_process(session_name)
    if last_sent == None or last_sent > datetime.datetime.now() - datetime.timedelta(hours=24):
        send_email(sendgrid_api_key, sender_email, receiver_email, "Server Run Confirmation", "Server is currently runnning")