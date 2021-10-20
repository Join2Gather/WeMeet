if __name__ == '__main__':
    from sys import path
    import os
    path.append(os.path.dirname(__file__))

from parse import get_result
from fastapi import FastAPI, Response
from fastapi.encoders import jsonable_encoder as to_json
from fastapi.responses import JSONResponse
import uvicorn

app = FastAPI(docs_url='/swagger')


@app.post("/everytime")
async def parse_everytime(id: str, password: str) -> None:
    result = await get_result(id, password)
    status_code = 200
    if 'error' in result.keys():
        status_code = 400
    return JSONResponse(result, status_code=status_code)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8009)
