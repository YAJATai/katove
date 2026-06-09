import urllib.request
import re
try:
    html = urllib.request.urlopen(urllib.request.Request("https://commons.wikimedia.org/wiki/File:Playboy_bunny.svg", headers={'User-Agent': 'Mozilla/5.0'})).read().decode('utf-8')
    match = re.search(r'href="(https://upload.wikimedia.org/wikipedia/commons/[^"]+\.svg)"', html)
    if match:
        svg_url = match.group(1)
        print(f"Found URL: {svg_url}")
        svg = urllib.request.urlopen(urllib.request.Request(svg_url, headers={'User-Agent': 'Mozilla/5.0'})).read().decode('utf-8')
        with open("playboy_bunny.svg", "w") as f:
            f.write(svg)
        print("Saved playboy_bunny.svg")
    else:
        print("URL not found in HTML")
except Exception as e:
    print("Error:", e)
