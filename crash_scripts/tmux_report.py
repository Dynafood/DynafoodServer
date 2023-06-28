import subprocess

def check_tmux_process(session_name, process_name):
    # Check if the tmux session exists
    session_exists = subprocess.run(['tmux', 'has-session', '-t', session_name], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if session_exists.returncode != 0:
        print(f"Session '{session_name}' does not exist.")
        return

    # Get the process status from the tmux session
    process_status = subprocess.run(['tmux', 'list-panes', '-t', session_name, '-F', '#F #{pane_pid} #{pane_current_command}'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    process_list = process_status.stdout.strip().split('\n')
    process_found = False

    for process_info in process_list:
        process_info_parts = process_info.split()
        if len(process_info_parts) >= 2:
            pid = process_info_parts[1]
            command = ' '.join(process_info_parts[2:])
            if command == process_name:
                process_found = True
                # Check if the process is still running
                process_running = subprocess.run(['ps', '-p', pid], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                if process_running.returncode == 0:
                    print(f"Process '{process_name}' is running.")
                else:
                    # Retrieve the error output
                    error_output = subprocess.run(['tmux', 'capture-pane', '-pt', session_name], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
                    print(f"Process '{process_name}' has exited with error output:\n{error_output.stdout}")
                break

    if not process_found:
        print(f"Process '{process_name}' not found in session '{session_name}'.")


# Example usage
session_name = 'DynafoodServerDev'
process_name = 'npm'
check_tmux_process(session_name, process_name)