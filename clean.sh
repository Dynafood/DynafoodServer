#!/bin/bash

print_col() {
    tput bold
    tput setaf $1
    echo $2
    tput sgr0
}


print_col 4 "CLEANING... => "
docker-compose  down --remove-orphans
exit
