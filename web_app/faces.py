import tflite_runtime.interpreter as tflite
import cv2
import numpy as np


face_classifier=cv2.CascadeClassifier('static/haarcascade_frontalface_default.xml')
interpreter = tflite.Interpreter('../train/model.tflite')
class_labels = ['Angry', 'Happy', 'Neutral', 'Sad', 'Surprise']

interpreter.allocate_tensors()
in_details = interpreter.get_input_details()
out_details = interpreter.get_output_details()
in_shape = in_details[0]['shape']


def predict(in_data):
    interpreter.set_tensor(in_details[0]['index'], in_data)
    interpreter.invoke()
    tf_pred = interpreter.get_tensor(out_details[0]['index'])
    return tf_pred


class DetectEmotion(object):
    def __init__(self):
        self.cap = cv2.VideoCapture(0)

    def __del__(self):
        self.cap.release()

    def get_frame(self):
        ret, frame = self.cap.read()
        gray=cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces=face_classifier.detectMultiScale(gray, 1.3, 5)
    
        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x,y), (x+w, y+h), (255, 0, 0), 2)
            roi_gray = gray[y:y+h,x:x+w]
            roi_gray = cv2.resize(roi_gray, (48, 48), interpolation=cv2.INTER_AREA)
            
            if np.sum([roi_gray]) != 0:
                roi = roi_gray.astype('float') / 255.0
                roi = np.array(roi, dtype=np.float32)
                roi = roi.reshape((1, 48, 48, 1))
                preds = predict(roi)

                label = class_labels[preds.argmax()]
                label_position = (x, y)
                print(label)
                cv2.putText(frame, label, label_position, cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 3)
            else:
                cv2.putText(frame, 'No Face Found', (20, 20), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 3)

        ret, jpeg = cv2.imencode('.jpg', frame)
        return jpeg.tobytes()
