# offline-push
This is just a simple demo proving what we can do with service workers.


## Start

npm install
npm start

open localhost:7001/index.html
enable messaging

hit http://localhost:7001/send-all?message=
with any message u want to send

CLOSE YOUR BROWSER WINDOW AND IT STILL WORKS!!

## Setup

	- set up app with google api manager
	- enable google cloud messaging api
	- pass api key to one of hte web-push libraries
	- generate vapid keys and share public with client
	- start sending better notifications online/offline with service workers!

## Links 

https://blog.mozilla.org/services/2016/04/04/using-vapid-with-webpush/
https://github.com/web-push-libs
https://console.developers.google.com
https://developers.google.com/cloud-messaging/
http://caniuse.com/#feat=serviceworkers

## Support
Currently we are limited to Chrome, Firefox and Android Browsers. IOS is in the works apparently and Im sure support will come soon enough for Desktop Safari and IE. Until then, we can just give the good stuff to those who support it. 