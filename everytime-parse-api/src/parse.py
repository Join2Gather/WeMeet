import numpy as np
import cv2
import math
import pprint
from typing import BinaryIO, List, Tuple, Union


def normal_round(n):
    if n - math.floor(n) < 0.5:
        return math.floor(n)
    return math.ceil(n)


def parse_img(img_url: str = "", img_file: BinaryIO = None, debug: bool = False):
    if img_url:
        img: np.ndarray = cv2.imread(img_url)
    elif img_file:
        file_bytes = np.fromstring(img_file.read(), dtype=np.uint8)
        img: np.ndarray = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    else:
        return []
    img_x, img_y, _ = img.shape
    reshaped: np.ndarray = np.reshape(img, (-1, 3))  # 2d rgb to 1d rgb
    colors: np.ndarray = np.unique(reshaped, axis=0)

    result_img = img.copy()
    result = {}

    week = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

    for day in week:
        result[day] = []

    padding_y = 80.0
    padding_x = 70.0

    one_hour_y = 180.0
    one_day_x = 177

    initial_hour = 9.0

    for color in colors:
        if len(set(color.tolist())) == 1:
            continue
        mask_color = cv2.inRange(img, color, color)
        contours, _ = cv2.findContours(
            mask_color, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        for contour in contours:
            x, y, w, h = map(int, cv2.boundingRect(contour))
            if x == 0 or y == 0:
                continue
            if img_x / 20 > w or img_y / 20 > h:
                continue

            starting_time = initial_hour + (y - padding_y) / one_hour_y
            end_time = starting_time + (h / one_hour_y)
            starting_time = round(starting_time, 2)
            end_time = round(end_time, 2)

            starting_hour = int(starting_time // 1)
            end_hour = int(end_time // 1)

            starting_minutes = 0
            end_minutes = 0

            if starting_time % 1.0:
                starting_minutes = normal_round(
                    (starting_time % 1.0) * 60.0)  # avoid banker's rounding
            if end_time % 1.0:
                end_minutes = normal_round((end_time % 1.0) * 60.0)
                if end_minutes >= 59:  # avoid IEEE 754 error
                    end_hour += 1
                    end_minutes = 0

            day_num = int((x - padding_x) // one_day_x) + 1
            day = week[day_num]

            result[day].append({'starting_hour': starting_hour, 'starting_minutes': starting_minutes,
                                'end_hour': end_hour, 'end_minutes': end_minutes})

            result_img = cv2.rectangle(
                result_img, (x, y), (x+w, y+h), (0, 0, 255), 2)

    for day in week:
        result[day].sort(key=lambda x: [v for v in x.values()])

    if debug:
        printer = pprint.PrettyPrinter(2)
        printer.pprint(result)
        for day, idx in result.items():
            print(
                f"{day}요일 수업 시작 시간: {idx}")

        cv2.imshow('img', result_img)
        cv2.waitKey()
        cv2.destroyAllWindows()

    return result


if __name__ == '__main__':
    parse_img(img_url='./assets/everytime.png', debug=True)
