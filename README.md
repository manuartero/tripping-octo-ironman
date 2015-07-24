# tripping-octo-ironman

Flights project

***

### Installation guide

1. Check you've all global dependencies
2. Run the installation script: ```./install.sh```
3. Run the app: ```node dist/app.js```

### Global dependencies (```npm list -g --depth=0```):

    ├── npm@2.10.1
    ├── tsd@0.6.3
    |── typescript@1.5.0-beta
    ├── gulp@3.9.0
    └── mocha@2.2.5

### Developing notes:

Adding a dependency.

- Search for it in the [tsd repo](http://definitelytyped.org/tsd/)
- type ```tsd install {name} -s```
- type ```npm install --save {name}```

Compile & running.

- ```gulp```
