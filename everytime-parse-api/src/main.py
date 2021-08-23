from typing import Optional
from parse import parse_img
from fastapi import FastAPI, File, UploadFile, Response
import uvicorn

app = FastAPI()

@app.post("/everytime")
async def parse_everytime(image: UploadFile = File(...)):
    if image.content_type != 'image/png':
        return Response({'error': 'file is not image file.'}, status_code=400)
    result = parse_img(img_file=image.file)
    return result

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8009)