FROM python:slim

COPY requirements.txt .

RUN pip install -r requirements.txt

RUN apt update
RUN apt upgrade
RUN apt install mpich -y

COPY ./src/ ./src/

CMD ["mpiexec", "-n", "3", "python", "-u", "./src/main.py"]