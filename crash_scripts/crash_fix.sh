RED='\033[0;31m'
GREEN='\033[0;32m'
WHITE='\033[0m'

# echo -e "{RED}kill npm process"
# tmux send-keys -t "DynafoodServerDev:1" C-c
# sleep 2
current_command=$(tmux list-panes -t "DynafoodServerDev:1" -F "#{pane_current_command}")

npm_string="npm"
if [[ "$cuttent_command" == *"$npm_string"* ]]; then
    echo "match"
else
    echo "no match"