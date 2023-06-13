import { MongoClient } from 'mongodb';
class Mongo {
    options;
    url;
    mongoClient;
    constructor() {
        this.url = process.env.MONGO_URL;
        this.options = {
            connectTimeoutMS: 2000,
        };
    }
    async initialize() {
        try {
            this.mongoClient = new MongoClient(this.url, this.options);
            await this.mongoClient.connect();
            log.debug(`MongoDB  initialized 🧬 `);
            global.db = this.mongoClient.db(process.env.DB);
        }
        catch (error) {
            log.error(`Error Occurred on mongo initialize. reason :${error.message}`);
        }
    }
}
export default Mongo;
