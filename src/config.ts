export interface ConfigProperties {
    db: string;
    baseUrl: string;
}

export var envs = {
    test: {
        db: "mongodb://localhost/tripping-octo-ironman-test",
        baseUrl: "localhost:3000"
    },
    dev: {
        db: "mongodb://localhost/tripping-octo-ironman",
        baseUrl: "localhost:3000"
    }
};

