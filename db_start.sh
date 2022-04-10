#!/bin/bash

print_col() {
    tput bold
    tput setaf $1
    echo $2
    tput sgr0
}

if [ "$1" == "new" ]
    then 
    print_col 1 "DELETING DB AND ITS VOLUME ... => "
    docker-compose down --remove-orphans -v
    print_col 2 "REBUILDING DB ... => "
    docker-compose -f docker-compose.db.yaml up --build
else 
    print_col 2 "BUILDING DB ... => "
    docker-compose down --remove-orphans
    docker-compose -f docker-compose.db.yaml up -d --build
fi    
exit