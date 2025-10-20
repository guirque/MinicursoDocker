import requests
import dotenv
import os
import time
from faker import Faker
import random
import math
from mpi4py import MPI
from datetime import datetime

#dotenv.load_dotenv('.env')

faker = Faker()
comm = MPI.COMM_WORLD

def log(msg):
    date = datetime.now()
    log_text = f'[Client {comm.Get_rank()} | {date.hour}:{date.minute}:{date.second}] {msg}'
    print(log_text)
    with open(os.path.join(os.getenv('LOG_PATH'), 'log.txt'), 'a') as log_file:
        log_file.write(log_text + '\n')

while True:

    try:
        # GET Request
        time.sleep(math.floor(5 + random.random() * 3))
        res_get = requests.get(f'{os.getenv('API_URL')}/')
        log(f'GET : {res_get.content.decode('utf-8')}')

        # POST Request
        time.sleep(math.floor(5 + random.random() * 7))
        res_post = requests.post(f'{os.getenv('API_URL')}/user', data={
            'username': faker.user_name(),
            'age': math.floor(20 + random.random() * 80),
            'email': faker.email()
        })
        log(f'POST : {res_post.json()}')

    except requests.exceptions.ConnectionError:
        log('A connection error ocurred')