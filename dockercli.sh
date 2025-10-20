# Volumes --------------------------------------------------
docker volume create shared_vol

# Networks -------------------------------------------------

docker network create shared_net -d bridge

docker network create db_net -d bridge

# Image Creation -------------------------------------------

# Node API
docker build ./NodeAPI/ -t node_api

# Python Client
docker build ./PythonClient/ -t python_client

# Containers -----------------------------------------------

# Database 
docker run -d --env-file ./db.env --network db_net --name db_service mysql

# Node API (also creating bind mount)
docker run -d -v ./NodeAPI/src/:/src/ -v shared_vol:/logs/:ro --network db_net --network shared_net --env-file ./db.env --env-file ./NodeAPI/.env --name node_api node_api

# Python Client

docker run -it -v shared_vol:/logs/:rw --network shared_net --env-file ./PythonClient/.env --name python_client python_client
