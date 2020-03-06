# import websocket libraries
import asyncio
import websockets
import keyboard
import json

# import key configurations
with open('keybindings.json') as keybindings_file:
    keybindings = json.load(keybindings_file)
with open('keyencodingmap.json') as keyencodingmap_file:
    keyencodingmap = json.load(keyencodingmap_file)

# merge key configs
encodedbindings = {}
for keybind in keyencodingmap:
    encodedbindings[keybind] = keybindings[keyencodingmap[keybind].split(
        ".")[0]][keyencodingmap[keybind].split(".")[1]]

# websocket handler


async def websocketsHandler(websocket, path):
    async for msg in websocket:
        if (msg[0] == "1"):
            keyboard.press(encodedbindings[msg[1]])
        else:
            keyboard.release(encodedbindings[msg[1]])


# websockets server
start_server = websockets.serve(websocketsHandler, "0.0.0.0", 1337)
print("Websockets Server is active on port 1337")
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
