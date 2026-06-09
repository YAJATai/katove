import urllib.request
import re

url = "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs/brands/playboy.svg"
try:
    svg = urllib.request.urlopen(url).read().decode('utf-8')
    print("Found in FontAwesome")
except:
    pass

url2 = "https://raw.githubusercontent.com/iconic/open-iconic/master/svg/playboy.svg"
try:
    svg = urllib.request.urlopen(url2).read().decode('utf-8')
    print("Found in open-iconic")
except:
    pass

