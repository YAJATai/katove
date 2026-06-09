import urllib.request
import json

url = "https://iconmonstr.com/wp-content/g/gd/makefg.php?i=assets/preview/2012/png/iconmonstr-cat-1.png&r=0&g=0&b=0" # just as test
req = urllib.request.Request("https://raw.githubusercontent.com/search?q=playboy.svg", headers={'User-Agent': 'Mozilla/5.0'})
# This won't work easily. Let's just grab the page source of a google image search or an SVG site
import re
try:
    html = urllib.request.urlopen(urllib.request.Request("https://commons.wikimedia.org/wiki/File:Playboy_logo.svg", headers={'User-Agent': 'Mozilla/5.0'})).read().decode('utf-8')
    match = re.search(r'href="(https://upload.wikimedia.org/wikipedia/commons/[^"]+\.svg)"', html)
    if match:
        svg_url = match.group(1)
        print(f"Found URL: {svg_url}")
        svg = urllib.request.urlopen(urllib.request.Request(svg_url, headers={'User-Agent': 'Mozilla/5.0'})).read().decode('utf-8')
        with open("playboy.svg", "w") as f:
            f.write(svg)
        print("Saved playboy.svg")
    else:
        print("URL not found in HTML")
except Exception as e:
    print("Error:", e)
