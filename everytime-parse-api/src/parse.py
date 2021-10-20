from typing import BinaryIO, List, Tuple, Union
import pprint
import math
import cv2
import numpy as np
import aiohttp
from lxml import etree
from datetime import datetime


async def login(session: aiohttp.ClientSession, id: str, password: str):
    data = {'userid': id, 'password': password, 'redirect': '/'}
    async with session.post('https://everytime.kr/user/login', data=data) as response:
        return response.status == 302 or response.status == 200


async def get_year_semester(session: aiohttp.ClientSession):
    async with session.post('https://api.everytime.kr/find/timetable/subject/semester/list') as response:
        data = await response.text()
    data = data.encode()
    parsed = etree.fromstring(data)

    datetime_format = '%Y-%m-%d'

    result = [semester for semester in parsed.xpath(
        '//response/semester') if datetime.strptime(semester.attrib['start_date'], datetime_format) <= datetime.now() <= datetime.strptime(semester.attrib['end_date'], datetime_format)]

    result = result[0]
    year, semester = result.attrib['year'], result.attrib['semester']

    return year, semester


async def get_table_id(session: aiohttp.ClientSession, year: str, semester: str):
    data = {'year': year, 'semester': semester}
    async with session.post('https://api.everytime.kr/find/timetable/table/list/semester', data=data) as response:
        data = await response.text()
    data = data.encode()
    parsed = etree.fromstring(data)

    id = parsed.xpath(
        '//response/table')[0].attrib['id']

    return id


def convert_time_to_minitues(time: int):
    # 에브리타임 response xml이 하드코딩되어 있다.
    return (time - 114) * 5 + (19 * 30)


def split_hour_and_minutes(minutes: int):
    hour, minutes = minutes // 60, minutes % 60
    return hour, minutes


async def get_times(session: aiohttp.ClientSession, table_id: any):
    data = {'id': table_id}
    async with session.post('https://api.everytime.kr/find/timetable/table', data=data) as response:
        data = await response.text()
    data = data.encode()
    parsed = etree.fromstring(data)

    data = parsed.xpath(
        '//response/table/subject/time/data')

    times = [tuple(map(int, (elem.attrib['starttime'], elem.attrib['endtime'])))
             for elem in data]
    times = [tuple(map(convert_time_to_minitues, e)) for e in times]
    times = [tuple(map(split_hour_and_minutes, e)) for e in times]

    week = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    days = [week[int(elem.attrib['day'])] for elem in data]

    times = [{'starting_hours': e[0][0], 'starting_minutes': e[0][1],
              'end_hours': e[1][0], 'end_minutes': e[1][1]} for e in times]

    week_result = {day: [] for day in week}

    for idx, time in enumerate(times):
        week_result[days[idx]].append(time)

    for key, value in week_result.items():
        week_result[key] = sorted(value, key=lambda x: list(x.values()))

    return week_result


async def get_result(id: str, password: str) -> dict:
    async with aiohttp.ClientSession() as session:
        login_result = await login(session, id, password)
        if not login_result:
            return {'error': 'login failed'}
        year, semester = await get_year_semester(session)
        table_id = await get_table_id(session, year, semester)
        return await get_times(session, table_id)


def normal_round(n):
    if n - math.floor(n) < 0.5:
        return math.floor(n)
    return math.ceil(n)


def parse_img(img_url: str = "", img_file: BinaryIO = None, debug: bool = True):
    if img_url:
        img: np.ndarray = cv2.imread(img_url)
    elif img_file:
        file_bytes = np.fromstring(img_file.read(), dtype=np.uint8)
        img: np.ndarray = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    else:
        return []
    img_y, img_x, _ = img.shape
    print(img_x, img_y)

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

            day_num = round((x - padding_x) / one_day_x)
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
