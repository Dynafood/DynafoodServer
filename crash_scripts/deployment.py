import subprocess
import time
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
import datetime
from dotenv import load_dotenv

load_dotenv()


# SendGrid configuration
sendgrid_api_key = os.getenv("SENDGRID_KEY")
sender_email = "info.dynafood@gmail.com"
receiver_email = "karl-erik.stoerzel@epitech.eu" #, karlstoerzel@gmail.com, niklas.scheffler@epitech.eu, marcel.taubert@epitech.eu, dynafoodcreators@gmail.com" #TODO: INSERT EMAIL TO SEND TO HERE //use the dynafood crators email
email_subject = "Deployment went live"

restart_script = "crash_fix.sh"

RED='\033[0;31m'
GREEN='\033[0;32m'
WHITE='\033[0m'

def execute_script(script_path):
    try:
        execution_output = subprocess.run(["bash", script_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print(execution_output.stdout.decode('utf-8').strip())
    except FileNotFoundError:
        print(f"Script not found at {script_path}")
    except subprocess.SubprocessError:
        print("Error executing the script.")

def send_email(api_key, sender, recipient, subject, message):
    global last_sent
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

def check_git_deploy():
    process_running = subprocess.run(['git', 'pull'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if process_running.returncode == 0 and process_running.stdout.decode().find("Already up to date.") != -1:
        print(GREEN + "No update detected" + WHITE)
    elif process_running.returncode == 0:
        print(RED + "Update detected" + WHITE)
        print(process_running.stdout)
        print(RED + "Update detected -> Updateing..." + WHITE)
        stop_crash_check()
        restart_server()
        start_crash_check()
        print(GREEN + "deployment completed")
        git_log = subprocess.run(['git', 'log', '--no-merges', '-5'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        send_email(sendgrid_api_key, sender_email, receiver_email, email_subject, git_log.stdout.decode())
    else:
        print(RED + "Error" + WHITE)
        print(process_running.stderr)
        print(process_running.stdout)

def restart_server():
    print(RED + "restarting server..." + WHITE)
    execute_script(restart_script)
    print(GREEN + "restarted server")

def start_crash_check():
    subprocess.run(['tmux', 'send-keys', '-t', "CrashReports", "python3 tmux_report.py", 'C-m'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print(GREEN + "restarted crash checker" + WHITE)

def stop_crash_check():
    subprocess.run(['tmux', 'send-keys', '-t', "CrashReports", 'C-c'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print(RED + "stopped crash checker" + WHITE)

while (True):
    check_git_deploy()
    time.sleep(10)