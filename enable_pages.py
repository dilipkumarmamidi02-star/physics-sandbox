import urllib.request, json
token = open('.github_token').read().strip()
req = urllib.request.Request(
    'https://api.github.com/repos/dilipkumarmamidi02-star/physics-sandbox/pages',
    data=json.dumps({'source':{'branch':'gh-pages','path':'/'}}).encode(),
    headers={'Authorization': 'token ' + token, 'Content-Type': 'application/json', 'Accept': 'application/vnd.github.v3+json'},
    method='POST'
)
try:
    urllib.request.urlopen(req)
    print('Pages enabled!')
except Exception as e:
    print('Pages already enabled')
