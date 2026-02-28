# To run application you must have to download *docker swarm*  

## Create network for docker
    
    docker network create -d overlay hackathon-2026
    
## Build images
    
    docker build -t backend-hackathon-2026:1.0.0 ./backend
    
    docker build -t frontend-hackathon-2026:1.0.0 ./frontend
    
The building can take some time
    
## Start application 

    docker stack deploy -c stack.yml hackathon-2026

Frontend - http://127.0.0.1:8080/

Backend - http://127.0.0.1:8000/

Then to use application you must to create user

    http://127.0.0.1:8000/users/create?username={your username}&password={your password}
    
Do not forget user password because you cannot make more than 1
    
## Stop application

    docker stack rm hackathon-2026
