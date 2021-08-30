<<<<<<< HEAD
# Join2Gather
=======
# Auto_Overnight 🌕

학교 외박신청 자동화 App
Based in React Native

## API

모든 함수가 post를 사용합니다.
모든 입력은 JSON으로 보내면 됩니다.

tmGbn에서 / 1학기 : 1 / 2학기 : 2 / 여름학기 : 5 / 겨울학기 : 6

### login

로그인을 시도하는 함수입니다.

입력으로 id, password를 받습니다.

```
return {
    statusCode: 200,

    cookies: cookies( 예시 : '_SSO_Global_Logout_url=get%5Ehttps%3A%2F%2Fportal.kpu.ac.kr%3A443%2Fsso%2Flogout.jsp%24get%5Ehttps%3A%2F%2Fiis.kpu.ac.kr%3A443%2Fcom%2FSsoCtr%2Fj_logout.do%24; kalogin=WrZ4RIxYqeHryg==$server; JSESSIONID=f31FNbSitaFk0AkfuEwpUgqbkatUmmYGvvhakQT0Y97VSxEzp7ZtTOK0GCOy4FUO.amV1c19kb21haW4vanN2XzI=\r\n')

    name: userNm,
    stayoutlist: response(XML 형태)
};
```

로그인을 성공하면 statusCode, cookies, name, stayoutlist를 return 합니다.

name에는 학생 이름, stayoutlist에는 현재 학기의 외박신청내역이 담깁니다.

### sendStayOut

외박 신청을 하는 함수입니다.

입력으로 date, outStayAplyDt, cookies를 받습니다.

각각 외박신청한 날들의 정보, 오늘 날짜, 쿠키를 의미힙니다.

```
return {
    statusCode: 200,
    stayoutlist: response(XML 형태)
 }
```

외박신청에 성공하면 statusCode, stayoutlist를 return 합니다.

stayoutlist에는 현재 학기의 외박 신청 내역이 담깁니다.

### findStayOutList

외박신청내역 조회를 시도하는 함수입니다.

입력으로 yy, tmGbn, schregNo, userNm, cookies를 받습니다.

각각 년도, 학기, 학번(id), 학생이름, 쿠키를 의미합니다.

```
return {
    statusCode: 200,
    stayoutlist: response(XML 형태)
}
```

조회에 성공하면 statusCode, stayoutlist를 return 합니다.

stayoutlist에는 요청받은 년도, 학기의 외박 신청 내역이 담깁니다.

### findPointList

상벌점내역 조회를 시도하는 함수입니다.

입력으로 yy, tmGbn, schregNo, userNm, cookies를 받습니다.

각각 년도, 학기, 학번(id), 학생이름, 쿠키를 의미합니다.

```
return {
    statusCode: 200,
    pointlist: response(XML 형태)
}
```

조회에 성공하면 statusCode, pointlist를 return 합니다.

pointlist 요청받은 년도, 학기의 상벌점 내역이 담깁니다.
>>>>>>> 1977faa9a4319f05bb17f8cbf96932990571e8dc
