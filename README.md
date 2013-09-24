# Living Documentation with Javascript
This is the source code for JSCalc, the example application shown on my [Living Documentation with Javascript](http://dev.alexishevia.com/2013/09/living-documentation-with-javascript.html) post.

## Requirements
- [Vagrant](http://www.vagrantup.com/)

(If you prefer to use your local machine instead of a virtual machine, make sure to install Node.js and PhantomJS)


## Instructions
Clone the repository, then start the virtual machine
```
vagrant up
```
(This might take a while the first time, since it will download a complete Ubuntu 12.04 image)

SSH into the virtual machine
```
vagrant ssh
```

Start the frontend server
```
cd /vagrant
grunt server
```
Docs will be running on [http://localhost:3000/docs](http://localhost:3000/docs).

Specs will be running on [http://localhost:3000/specs](http://localhost:3000/specs).

Run headless specs
```
grunt specs
```

