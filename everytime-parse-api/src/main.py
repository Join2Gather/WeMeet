if __name__ == '__main__':
    from sys import path
    import os
    path.append(os.path.dirname(__file__))

from typing import Optional
from parse import parse_img
from fastapi import FastAPI, File, UploadFile, Response
from fastapi.encoders import jsonable_encoder as to_json
from fastapi.responses import JSONResponse
import uvicorn

app = FastAPI()


@app.post("/everytime")
async def parse_everytime(image: UploadFile = File(...)) -> Response:
    if not image.content_type.startswith('image'):
        return JSONResponse(to_json({'error': 'file is not image file.'}), status_code=400)
    result = parse_img(img_file=image.file)
    return JSONResponse(to_json({'result': result}), status_code=200)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8009)
