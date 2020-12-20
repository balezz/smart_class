import os
import socket
from threading import Thread
from time import sleep

from constants import BUFFER_SIZE, SERVER_HOST_PORT, STATES


class Server:
    def __init__(self,
                 address=SERVER_HOST_PORT,
                 buffer_size=BUFFER_SIZE):
        self.address = address
        self.buffer_size = buffer_size
        try:
            self.socket.close()
        except:
            pass
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.socket.bind(SERVER_HOST_PORT)
        self.socket.listen(5)
        print(f'Server started at {self.address}')
        self.cv_client = None
        self.ui_client = None
        self.agent_state = 'None'

    def listen_incoming(self):
        try:
            while True:
                client, addr = self.socket.accept()
                print(f'client {addr} has connected')
                while True:
                    data = client.recv(self.buffer_size)
                    if data == b'cv':
                        self.cv_client = client
                        cv_thread = Thread(target=self.handle_cv)
                        cv_thread.daemon = True
                        cv_thread.start()
                        print('CV client accepted')
                        break
                    if data == b'ui':
                        self.ui_client = client
                        ui_thread = Thread(target=self.handle_ui)
                        ui_thread.daemon = True
                        ui_thread.start()
                        print('UI client connected')
                        say('Соединение установлено')
                        break
                    print(f'received {data}')
        except:
            self.socket.close()

    def handle_cv(self):
        while True:
            data = self.cv_client.recv(self.buffer_size)
            if data:
                msg = data.decode()
                self.process_cv(msg)

    def handle_ui(self):
        while True:
            data = self.ui_client.recv(self.buffer_size)
            if data:
                msg = data.decode()
                self.process_ui_message(msg)

    def process_cv(self, msg):
        if msg in STATES:
            self.agent_state = msg
            if msg == 'None':
                say('Я вас не вижу!')
                # sleep(1)

    def process_ui_message(self, msg):
        print('Processing message: ' + msg)
        echo = bytes(msg, 'utf-8')
        self.ui_client.send(echo)


def say(msg):
    os.system(f'echo "{msg}" | RHVoice-client -s Anna+CLB | aplay > /dev/null 2>&1')


def run():
    Server().listen_incoming()


if __name__ == '__main__':
    run()
