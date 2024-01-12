RED='\033[0;31m'
GREEN='\033[0;32m'
WHITE='\033[0m'

current_command=$(tmux list-panes -t "DynafoodServer:1" -F "#{pane_current_command}")

npm_string="npm"
while [ $current_command == $npm_string ] 
do
    echo -e "{RED}kill npm process"
    tmux send-keys -t "DynafoodServer:1" C-c
    sleep 1

    current_command=$(tmux list-panes -t "DynafoodServer:1" -F "#{pane_current_command}")

done
echo -e "{NC}no npm process found"
echo -e "{NC}restart server..."
tmux send-keys -t "DynafoodServer:1" "npm start" C-m
sleep 2

current_command=$(tmux list-panes -t "DynafoodServer:1" -F "#{pane_current_command}")

if [[ $current_command == $npm_string ]]; then
    echo -e "{GREEN}server restarted, npm running"
else 
    echo -e "{RED}restart not successfull!!!"
fi
