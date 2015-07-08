export class AirportList {
    keys: string[];
    total: number;

    constructor() {
        this.keys = [];
    }

    toString() {
        return JSON.stringify(this);
    }
}