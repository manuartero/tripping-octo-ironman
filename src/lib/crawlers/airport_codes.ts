import Interfaces = require('../common/interfaces')

/**
 * AirportCodes.CrawlerResponse
 */
export interface CrawlerResponse {
    name: string,
    country: string,
    lat: number,
    lon: number,
    connections: string[]
}

/**
 * AirportsCodes.Crawler
 */
export class Crawler implements Interfaces.Crawler {

    parse(page: string): CrawlerResponse {
        // TODO
        return {
            name: "example",
            country: "example",
            lat: 0,
            lon: 0,
            connections: ["TEST"]
        }
    }

}