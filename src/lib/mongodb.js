import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,
  minPoolSize: 0,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClient = client;
  global._mongoClientPromise = client.connect();
}

client = global._mongoClient;
clientPromise = global._mongoClientPromise;

export { client, clientPromise };
export default clientPromise;

export async function getDb() {
  const connectedClient = await clientPromise;
  return connectedClient.db("zabed-folio-db");
}
