RED='\033[0;31m'
printf "\033[0;31mstart script to create https server files...\033[0m\n"
openssl req -nodes -new -x509 -keyout https_server.key -out https_server.cert << EOF
de
berlin
berlin
dynafood
dev
dynafood_server
dynafoodcreators@gmail.com
EOF
printf "\n\033[0;32mDONE\033[0m"
