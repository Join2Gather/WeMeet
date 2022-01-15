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

    # result는 최신순으로 정렬되어 있음.
    result = parsed.xpath('//response/semester')

    if filtered := [semester for semester in result
                    if datetime.strptime(semester.attrib['start_date'], datetime_format) <= datetime.now() <= datetime.strptime(semester.attrib['end_date'], datetime_format)]:
        result = filtered
    else:
        # 현재 진행되는 학기가 없다면, 마지막에 끝난 학기를 불러온다.
        result = [semester for semester in result
                  if datetime.strptime(semester.attrib['end_date'], datetime_format) <= datetime.now()]

    result = result[0]
    year, semester = result.attrib['year'], result.attrib['semester']

    return year, semester


async def get_table_id(session: aiohttp.ClientSession, year: str, semester: str):
    data = {'year': year, 'semester': semester}
    async with session.post('https://api.everytime.kr/find/timetable/table/list/semester', data=data) as response:
        data = await response.text()
    data = data.encode()
    parsed = etree.fromstring(data)

    try:
        id = parsed.xpath(
            '//response/table')[0].attrib['id']
    except:
        return None

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

        week = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
        if table_id is None:
            return {day: [] for day in week}

        return await get_times(session, table_id)
