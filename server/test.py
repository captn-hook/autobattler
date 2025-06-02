from openai import OpenAI
import base64
import os

api_key = os.getenv("KEY")

client = OpenAI(
    api_key=api_key
)

response = client.responses.create(
    model="gpt-4.1-mini",
    input="Generate a pokemon fusion of a magikarp and a pikachu",
    tools=[{"type": "image_generation"}],
)

# Save the image to a file
image_data = [
    output.result
    for output in response.output
    if output.type == "image_generation_call"
]
    
if image_data:
    image_base64 = image_data[0]
    with open("otter.png", "wb") as f:
        f.write(base64.b64decode(image_base64))