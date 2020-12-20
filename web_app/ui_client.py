from threading import Thread
from tkinter import *
import socket
from constants import BUFFER_SIZE, SERVER_HOST_PORT, STATES


class Chat:
    def __init__(self):
        self.root = Tk()
        self.root.title('Chat Bot')
        self.root.geometry('400x500')
        self.root.resizable(width=FALSE, height=FALSE)

        self.file_menu = Menu(self.root)
        self.file_menu.add_command(label='New...')
        self.file_menu.add_command(label='Save As...')
        self.file_menu.add_command(label='Exit')

        self.main_menu = Menu(self.root)
        self.main_menu.add_cascade(label='File', menu=self.file_menu)
        self.main_menu.add_command(label='Edit')
        self.main_menu.add_command(label='Quit')
        self.root.config(menu=self.main_menu)

        self.chat_text = Text(self.root,
                              bd=1,
                              bg='black',
                              width='50',
                              height=8,
                              font=('Arial', 23),
                              foreground='#00ffff')
        self.chat_text.place(x=6, y=6, height=385, width=370)

        self.message_text = Entry(self.root,
                                  bd=0, bg='black',
                                  width='30',
                                  # height='4',
                                  font=('Arial', 23),
                                  foreground='#00ffff')
        self.message_text.place(x=128, y=400, height=88, width=260)
        self.message_text.bind('<Return>', self.send)

        self.scrollbar = Scrollbar(self.root, command=self.chat_text.yview, cursor='star')
        self.scrollbar.place(x=375, y=5, height=385)

        self.button = Button(self.root,
                             text="Send",
                             width="10",
                             height=5,
                             bd=0,
                             bg="#0080ff",
                             activebackground="#00bfff",
                             foreground='#ffffff',
                             font=("Arial", 12))
        self.button.place(x=6, y=400, height=88)
        self.button.bind('<Button-1>', self.send)

        self.agent_state = 'None'

        self.listen_thread = None
        self.sock = None
        self.connect()

    def run(self):
        self.root.mainloop()

    def send(self, event):
        """
        Send message to the server
        """
        msg = self.message_text.get()
        data = bytes(msg, 'utf-8')
        self.sock.send(data)
        self.new_text(msg, 'You: ')

    def new_text(self, msg, who):
        msg = msg.replace("\n", "").replace("<CRLF>", "\n") + "\n"
        self.chat_text.insert(END, who + msg)
        self.chat_text.see('end')
    
    def connect(self, host_port=SERVER_HOST_PORT):
        try:
            self.sock.close()
        except:
            pass

        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.connect(host_port)
        self.listen_thread = Thread(target=self.listen)
        self.listen_thread.daemon = True
        self.listen_thread.start()
        print("Successful connect to server")
        # register ui_thread on server
        self.sock.send(b'ui')

    def listen(self):
        """ Listen messages from server  """
        while True:
            try:
                raw_msg = self.sock.recv(BUFFER_SIZE)
                if raw_msg:
                    msg = raw_msg.decode()
                    if msg in STATES:
                        if msg != self.agent_state:
                            # agent state is changed
                            self.new_text(msg, 'Server: ')
                            self.agent_state = msg
                    else:
                        print(f'received {msg}')
                        self.new_text(msg, 'Server: ')

            except KeyboardInterrupt:
                print(f'socket {self.sock} closed')
                self.sock.close
            except socket.error as se:
                print('Error: ', se)


def run():
    Chat().run()


if __name__ == '__main__':
    run()
