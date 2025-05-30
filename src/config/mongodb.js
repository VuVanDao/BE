//gBavtrTf4GpxVrAg
const mongoDb_uri = env.MONGODB_URI;
const databaseName = env.DATABASE_NAME;
import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "./environment";

let trelloDatabaseInstance = null;
const mongoClientInstance = new MongoClient(mongoDb_uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
export const CONNECT_DB = async () => {
  await mongoClientInstance.connect();
  trelloDatabaseInstance = mongoClientInstance.db(databaseName);
};
export const GET_DB = () => {
  if (!trelloDatabaseInstance) {
    throw new Error("Cannot connect your database");
  }
  return trelloDatabaseInstance;
};
export const CLOSE_DB = async () => {
  console.log("haha");
  await mongoClientInstance.close();
};
