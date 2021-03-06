import socket
from time import sleep
from constants import SERVER_HOST_PORT
from tflite_runtime.interpreter import Interpreter
import cv2
import numpy as np


face_classifier=cv2.CascadeClassifier('static/haarcascade_frontalface_default.xml')
interpreter = Interpreter('../train/model.tflite')
interpreter.allocate_tensors()
in_details = interpreter.get_input_details()
out_details = interpreter.get_output_details()
in_shape = in_details[0]['shape']


class_labels = ['Angry', 'Happy', 'Neutral', 'Sad', 'Surprise']
cap = cv2.VideoCapture(0)
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)


def predict(in_data):
    interpreter.set_tensor(in_details[0]['index'], in_data)
    interpreter.invoke()
    tf_pred = interpreter.get_tensor(out_details[0]['index'])
    return tf_pred


def send(msg):
    if CONNECTED:
        raw = bytes(msg, 'utf-8')
        try:
            sock.send(raw)
        except (BrokenPipeError, ConnectionRefusedError):
            sleep(1)
            connect()


def connect():
    print('Trying connect to server ... ')
    msg = sock.connect_ex(SERVER_HOST_PORT)
    if msg == 0:
        print('Connection OK')
        sock.send(b'cv')
        return True
    else:
        print('Connection failed')
        sleep(1)
        return False


def run():
    global CONNECTED
    CONNECTED = connect()
    while True:
        # sleep(0.1)
        ret, frame = cap.read()
        labels = []
        label = 'None'
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_classifier.detectMultiScale(gray, 1.3, 5)

        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
            roi_gray = gray[y:y+h, x:x+w]
            roi_gray = cv2.resize(roi_gray, (48, 48), interpolation=cv2.INTER_AREA)

            if np.sum([roi_gray]) != 0:
                roi = roi_gray.astype('float')/255.0
                roi = np.array(roi, dtype=np.float32)
                roi = roi.reshape((1, 48, 48, 1))
                preds = predict(roi)

                label = class_labels[preds.argmax()]
                label_position = (x, y)
                cv2.putText(frame, label, label_position, cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 3)
            else:
                cv2.putText(frame, 'No Face Found', (20, 20), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 3)
        send(label)
        cv2.imshow('Emotion Detector', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()
