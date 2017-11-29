# AWS IoT MQTT Web Server 

## The device project

You must deploy this project at first.（On AWS EC2）

https://github.com/cncoder/water-iot

## Configure Your Device

``` Javascript

var thingShadows = AWSIoTData.thingShadow({
    keyPath: 'cert/private.pem',
   certPath: 'cert/certificate.pem',
     caPath: 'cert/rootca.pem',
   clientId: 'iot-flower-website',
       host: 'XXXX.iot.XXXX.amazonaws.com'
 });


// change the thingName . You can ignore it.

thingShadows.register( 'waterflower', {}, function() {

})

```

## Usage server.js examples

> npm install

``` Javascript
// change 3000 port
server.on('request', app);
    server.listen(3000, function () {
      console.log('Listening on http://localhost:3000');
    });

```
> node server.js

## Error handling best practices

## FAQ

## Changelog

We're using the GitHub [releases][changelog] for changelog entries.

## License

[MIT](LICENSE)
