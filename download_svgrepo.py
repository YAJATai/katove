import urllib.request
import json

try:
    req = urllib.request.Request("https://www.svgrepo.com/download/331535/playboy.svg", headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    svg = urllib.request.urlopen(req).read().decode('utf-8')
    with open("playboy_bunny.svg", "w") as f:
        f.write(svg)
    print("Downloaded from svgrepo")
except Exception as e:
    print("Error:", e)
