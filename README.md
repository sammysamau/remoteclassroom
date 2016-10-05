# tealsclassroom
TEALS Virtual Classroom for remote teaching

Try it now:
* [Starter Demo](http://tealsclassroom.appspot.com/starter)
* [Admin Demo](http://tealsclassroom.appspot.com/admin)

## Running your own copy of tealsclassroom

You can fork your own copy of tealsclassroom in three easy steps:

Begin by forking this project in github

### Pusher

Create an account with [pusher.com](https://pusher.com/)
and create an app

You will need to note the following: 
* APP_ID
* APP_KEY
* APP_SECRET

### App Engine

Create an account (if you don't already have one) with [appengine](https://appengine.google.com)
and create an app

### Configuration

There are two configuration files you'll need to touch: 
* app.yaml
* config_file.json

Edit app.yaml and be sure to update: 
* application, with your Google Appengine application id
* PUSHER_APP_ID, PUSHER_APP_KEY, and PUSHER_APP_SECRET with your pusher application details

Edit config_file.json: 
* student information and skype meetings
* application configuration, like app name, school name and course name

## License

MIT
