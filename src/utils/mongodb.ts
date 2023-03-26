import {MongoClient, MongoClientOptions} from 'mongodb';
import config from "../../config";

const MONGODB_URI = String(config.mongo_db_bc_uri);
const MONGODB_DB  = String(config.mongo_db_bc_db);

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

if (!MONGODB_DB) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached: any = (global as any).mongo

if (!cached) {
  cached = (global as any).mongo = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts: MongoClientOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as MongoClientOptions

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      return {
        client,
        db: client.db(MONGODB_DB),
      }
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export async function loadNfts() {
  const {db} = await connectToDatabase();
  const nfts = await db.collection('nfts').find().toArray();
  return nfts;
} // Add a placeholder function to fetch NFT data from the database
export async function getNftById(nftId: string) {
  const {db} = await connectToDatabase();
  const nftsCollection = db.collection("nfts");

  const nftData = await nftsCollection.findOne({nftId: nftId});

  if (!nftData) {
    return null;
  }

  // Convert nftData to a plain JavaScript object
  const nftDataObject = JSON.parse(JSON.stringify(nftData));

  // Remove non-serializable properties if needed, e.g., _id
  delete nftDataObject._id;

  return nftDataObject;
}