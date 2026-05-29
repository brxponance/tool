---
created: 2026-05-08T12:07:42 (UTC -04:00)
tags: [QRE,Quant Research Environment,FPE,FactSet Research Environment,Quant,Research]
source: https://developer.factset.com/api-catalog/factset-programmatic-environment-api#overview
author: FACTSET DEVELOPER
---

# FactSet Programmatic Environment

> ## Excerpt
> FactSet Programmatic Environment API

---
Overview

FactSet Programmatic Environment (FPE) API is an API for users to interact with FPE programmatically, streamlining the path from research to production.

FPE is a flexible open-source JupyterLab platform which provides programmatic access to industry-leading data and analytical applications.

FPE API provides endpoints to run python scripts developed in FPE remotely and upload external datasets programmatically to FPE.

Servers

Code Snippet

Building and Running Python Script

```
#!/usr/bin/env python
import pandas as pd
import numpy as np
import pandas as pd
import os
import io
import requests
import base64
import time

api_key = ''
# Store API key in a txt file
with open('api-key.txt') as f:
    api_key = f.read()
    
#username 
username = " "

# Assemble basic auth user + pass
auth = bytes(f"{username.upper()}:{api_key}", "utf-8")

headers = {
    'Authorization': 'Basic %s' % str(base64.b64encode(auth).decode('ascii'))
}
api = 'https://api.factset.com/analytics/quant/fpe'

# Load the script we want to run so we can send it to FPE
# Copy “sample python script” snippet to use here
script = ''
with open('./script_filename.py') as f:
    script = f.read()

# Start the FPE calculation
r = requests.post(
    api + '/v1/calculations', 
    headers=headers, 
    json={'script': script} # Using `json` will encode the script as needed
)
print('HTTP Status: {}'.format(r.status_code))

# Calculation returns JSON body
print("Calculation_id:", r.json()['id'])

# Calculation also returns a `Location` header which contains a relative URL for where to poll for calculation status
pollUrl = r.headers['Location']

# The unique id for this calculation. Used later to get the log and ouput
calculation_id = r.json()['id']

print("Polling url:", pollUrl)

# Poll for script completion
while True:
    #print("Polling for results...")
    r = requests.get(api + pollUrl, headers=headers)
    
    # Poll returns the same JSON body as the initial calculation but with an updated status
    print("Polling result:", r.json()['status'])
    
    # 200 means the calculation is done
    # 202 means the calculation is still going
    # Anything > 299 means some service error occured
    if r.status_code == 200:
        break
    elif r.status_code > 299:
        print('Pickup request failed: ' + r.status_code)
        raise SystemExit('Pickup request failed')
    time.sleep(10)
    
print("Run finished")
# Get script log 
logs = requests.get(
    api + '/v1/calculations/'+calculation_id+'/log', 
    headers=headers
)

print("Logs:" + logs.content.decode('utf8'))
# Get output (if there is any)
output = requests.get(
    api + '/v1/calculations/'+calculation_id+'/output', 
    headers=headers
)

# Content-Type will be whatever you set it to be in the script
print("Output type:", output.headers.get('Content-Type'))

df = pd.read_csv(io.StringIO(output.content.decode('utf8')),index_col=['date','symbol'])

#parquet example 
#df = pd.read_parquet(io.BytesIO(output.content))
```

Sample Code for File Upload

```
import requests
import base64
import time
#username and api key
username = ' '
api_key = ' '
# Assemble basic auth user + pass
auth = bytes(f"{username.upper()}:{api_key}", "utf-8")
headers = {
 'Authorization': 'Basic %s' % str(base64.b64encode(auth).decode('ascii'))
}
api = 'https://api.factset.com/analytics/quant/fpe'
# Uploading a file
# # Load the file
fileToUpload = ''
with open('./your files') as f:
    fileToUpload = f.read()

#set environment to upload files
# - interactive
# - batch
env = 'interactive'
#env = 'batch'
#set uploadUrl
uploadUrl = api + '/v1/files/' + env + '/' + 'my-file.csv'

#set uploadUrl for subdirectory 
import urllib.parse 
uploadUrl = api + '/v1/files/' + env + '/' + urllib.parse.quote("my-folder/my-file.csv", safe="")

r = requests.post(
 uploadUrl,
 headers=headers,
 data=fileToUpload)
print('HTTP Status: {}'.format(r.status_code))
upload_id = r.json()['id']
print("Upload id: " + upload_id)
pollUrl = r.headers['Location']
# Poll to see when the file is done uploading
while True:
    print("Polling for upload finish...")
    r = requests.get(api + pollUrl, headers=headers)
    if r.status_code == 200:
        break
    elif r.status_code > 299:
        print('Pickup request failed: ' + r.status_code)
        raise SystemExit('Pickup request failed')
    time.sleep(5)
print('Status: ' + r.json()['status'])
```

Sample Python Script

```
from fds.quant.screening import Screen
from fds.quant.universe import UnivLimit, IdentifierUniverse,ScreeningExpressionUniverse,ScreeningDocumentUniverse
from fds.quant.dates import TimeSeries, RelativeDate,Frequency
from fds.quant.output.dataframe import to_csv, to_parquet

dates = TimeSeries(start=RelativeDate.ONE_CALENDAR_YEAR_AGO, stop=RelativeDate.PREV_CLOSE, freq=Frequency.MONTHLY)

univ = ScreeningExpressionUniverse(expression=UnivLimit.SP500,time_series=dates)

screen = Screen(universe=univ, formulas=['P_PRICE(0)'], columns=['price'],entire_universe=True)

screen.calculate()

df = screen.data

to_csv(df)

#parquet example
#to_parquet(df)
```

Changelog

## v1

## Summary

-   Version 1.1.0 - Released on 09/01/2024
    

## Functionality Additions

-   Added support for multiple kernels to calculations \[v1.1.0\]
