import { MongoClient, ServerApiVersion } from "mongodb";

function getCleanMongoUri() {
  let uri = (process.env.MONGODB_URI || "").trim();
  // Strip accidental "MONGODB_URI=" if the key was pasted into the value box in Vercel
  if (uri.startsWith("MONGODB_URI=")) {
    uri = uri.substring("MONGODB_URI=".length).trim();
  }
  // Strip accidental surrounding single or double quotes
  uri = uri.replace(/^["']|["']$/g, "").trim();
  return uri;
}

const uri = getCleanMongoUri();

if (!uri && process.env.NODE_ENV === "production" && typeof window === "undefined") {
  console.warn("⚠️ Warning: MONGODB_URI is not set or empty.");
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

// Fallback dummy for build time if URI is invalid to prevent build crashes
const validScheme = uri && (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"));
const effectiveUri = validScheme ? uri : "mongodb://localhost:27017/dummy-build-db";

if (!global._mongoClientPromise) {
  client = new MongoClient(effectiveUri, options);
  global._mongoClient = client;
  global._mongoClientPromise = validScheme
    ? client.connect()
    : Promise.reject(new Error("Invalid scheme, expected connection string to start with mongodb:// or mongodb+srv://"));
}

client = global._mongoClient;
clientPromise = global._mongoClientPromise;

const db = client.db("zabed-folio-db");

export { client, db, clientPromise };
export default clientPromise;

export async function getDb() {
  const connectedClient = await clientPromise;
  return connectedClient.db("zabed-folio-db");
}
