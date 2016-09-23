# WeatherLens

#### Displays current weather conditions and 5-day forecast for the selected location using the [Dark Sky API](https://darksky.net/poweredby/) and the Google Map Geolocation API

## Where?

#### You can see WeatherLens running at [spiral9.com/weatherlens](http://spiral9.com/weatherlens)

## Why?

* A coding challenge for an interview
* To demonstrate Angular, HTML, JS, LESS, Gulp, Bower, and Node chops

## How To Build?

### Prerequisites (and what versions are known to work): 

* Node v 5.6.0
* Bower v 1.7.9

### From the command line from project dir :

1. ``` $ npm install ```
2. ``` $ bower install ```
3. ``` $ gulp ```
4. open the newly created 'build' directory and open index.html in your favorite browser

## What are the project's known TODOs?

1. unit tests - I haven't written any yet!!
2. dynamic image service - it would be cool to load related background images by city and condition
3. test-and-tweak for longer named cities
4. test failure cases for city / state ( though 'monkey' and 'house' actually resolved to somewhere in the UK! )
