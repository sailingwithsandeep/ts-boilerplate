import { MongoClient, MongoClientOptions } from 'mongodb';

class Mongo {
    private options: MongoClientOptions;

    private url: string;

    mongoClient!: MongoClient;

    constructor() {
        this.url = process.env.MONGO_URL as string;
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
        } catch (error: any) {
            log.error(`Error Occurred on mongo initialize. reason :${error.message}`);
        }
    }
}

export default Mongo;
