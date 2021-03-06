from typing import BinaryIO, List, Tuple, Union
import pprint
import math
import cv2
import numpy as np


def normal_round(n):
    if n - math.floor(n) < 0.5:
        return math.floor(n)
    return math.ceil(n)


def smoothen_minutes(minutes):
    if (remainder := minutes % 10) <= 3:
        return minutes - remainder
    elif remainder >= 7:
        return minutes - remainder + 10
    else:
        return minutes - remainder + 5


def get_coords(img, colors, is_mobile_image=False):
    coords = []
    for color in colors:
        if len(set(color.tolist())) != 1:
            continue

        mask_color = cv2.inRange(img, color, color)
        contours, _ = cv2.findContours(
            mask_color, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        for contour in contours:
            x, y, w, h = map(int, cv2.boundingRect(contour))
            if x <= 1 or y <= 1:
                continue
            if 50 > w or 50 > h:
                continue
            coords.append((x, y, w, h))

    coords.sort()
    padding_x, padding_y, _, _ = coords[0]
    coords.sort(key=lambda x: x[3], reverse=True)

    _, _, one_day_x, one_hour_y = coords[len(coords)//2]

    # add border height
    if is_mobile_image:
        one_hour_y += 2
    else:
        one_hour_y += 1

    return padding_x, padding_y, one_day_x, one_hour_y


def parse_img(img_url: str = "", img_file: BinaryIO = None, debug: bool = False):
    if img_url:
        img: np.ndarray = cv2.imread(img_url)
    elif img_file:
        file_bytes = np.fromstring(img_file.read(), dtype=np.uint8)
        img: np.ndarray = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    else:
        return []
    img_y, img_x, _ = img.shape

    # 일단 이걸로 판단할 수 있음
    # 더 좋은 해결책 TODO
    is_mobile_image = img_x != 960

    if is_mobile_image:
        width = 1038
    else:
        width = 960

    r = width / float(img_x)
    dim = (width, int(img_y * r))

    img = cv2.resize(img, dim)

    img_y, img_x, _ = img.shape

    reshaped: np.ndarray = np.reshape(img, (-1, 3))  # 2d rgb to 1d rgb
    colors: np.ndarray = np.unique(reshaped, axis=0)

    result_img = img.copy()
    result = {}

    week = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

    for day in week:
        result[day] = []

    padding_x, padding_y, one_day_x, one_hour_y = get_coords(
        img, colors, is_mobile_image)

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
            if 50 > w or 50 > h:
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
            starting_minutes, end_minutes = map(
                smoothen_minutes, [starting_minutes, end_minutes])

            day_num = round((x - padding_x) / one_day_x) + 1
            day = week[day_num]

            duplicate_list = [(idx, time) for idx, time in enumerate(result[day]) if
                              (time['starting_hour'] ==
                               starting_hour and abs(time['starting_minutes']-starting_minutes) <= 1) or
                              (time['end_hour'] == end_hour and abs(time['end_minutes']-end_minutes) <= 1)]

            dic = {'starting_hour': starting_hour, 'starting_minutes': starting_minutes,
                   'end_hour': end_hour, 'end_minutes': end_minutes}

            if duplicate_list:
                idx, duplicate = duplicate_list[0]
                starting_equals = duplicate['starting_hour'] == starting_hour and abs(
                    duplicate['starting_minutes']-starting_minutes) <= 1
                end_equals = duplicate['end_hour'] == end_hour and abs(
                    duplicate['end_minutes']-end_minutes) <= 1

                starting_includes = duplicate['starting_hour'] >= starting_hour and duplicate[
                    'starting_minutes'] >= starting_minutes
                end_includes = duplicate['end_hour'] <= end_hour and duplicate['end_minutes'] <= end_minutes

                if (starting_equals and end_includes) or (starting_includes and end_equals):
                    result[day][idx] = dic
                else:
                    continue
            else:
                result[day].append(dic)

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
