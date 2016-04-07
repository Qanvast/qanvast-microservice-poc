Microservice POC
=================
The problem with building different APIs is that, there's a lot of overlap in terms of functionalities.

Most APIs require these functionalities:
* Authentication
* Access Control (ACL)
* Image upload & management
* Cross Origin Resource Sharing (CORS)
* Request throttling
* Request de-duplication

[Hapi.js](http://hapijs.com/) presents a extensible framework for us to build modular components that can be attached together to power different micro-services. With [`glue`](https://github.com/hapijs/glue), a server composer for hapi.js, we can now create new microservices using different bricks, just by declaring a configuration manifest.

This proof-of-concept project seeks to evaluate and determine the best way we can achieve this.

