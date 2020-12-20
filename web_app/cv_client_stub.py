import socket
import random
from time import sleep
from constants import SERVER_HOST_PORT, STATES

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)


def connect():
    print('Trying connect to server ... ')
    msg = sock.connect_ex(SERVER_HOST_PORT)
    if msg == 0:
        print('Connection OK')
        return True
    else:
        print('Connection failed')
        sleep(1)
        return False


def run():
    while True:
        if connect():
            sock.send(b'cv')
            while True:
                sleep(2)
                state = random.choice(STATES)
                raw = bytes(state, 'utf-8')
                try:
                    sock.send(raw)
                except (BrokenPipeError, ConnectionRefusedError):
                    sleep(1)
                    connect()
