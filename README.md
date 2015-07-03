# tripping-octo-ironman

Flights project

***

### Installation guide

1. Check you've all global dependencies
2. Run the installation script: ```./install.sh```
3. Run the app: ```node dist/app.js``` 

### Global dependencies: 

    ├── npm@2.10.1
    ├── tsd@0.6.3
    └── typescript@1.5.0-beta

### Developing notes: 

Adding a dependency. 

- Search for it in the [repo](http://definitelytyped.org/tsd/)
- type ```tsd install {name} -s```
- type ```npm install --save {name}```

Compile & running.

- ```rm -R dist/ ; tsc ; node dist/app.js```


