from multiprocessing import Process
from time import sleep
import cv_client, ui_client, tcp_server

p1 = Process(target=tcp_server.run)
p2 = Process(target=cv_client.run)
p3 = Process(target=ui_client.run)

if __name__ == '__main__':
    p1.start()
    sleep(1)
    p2.start()
    sleep(1)

    p3.start()
    p3.join()

    p2.terminate()
    p1.terminate()
