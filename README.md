# To run application you must have to download *docker*  

## Create network for docker
    
    docker network create -d overlay hackathon-2026
    
## Build images
    
    docker build -t backend-hackathon-2026:1.0.0 ./backend
    
    docker build -t frontend-hackathon-2026:1.0.0 ./frontend
    
The building can take some time
    
## Start application 

    docker stack deploy -c stack.yml hackathon-2026
    
## Stop application

    docker stack rm hackathon-2026
