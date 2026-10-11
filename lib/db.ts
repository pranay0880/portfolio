import { MongoClient, type Collection } from "mongodb";

export type SubmissionStatus = "RECEIVED" | "EMAIL_SENT" | "EMAIL_FAILED";

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
  ipAddress: string | null;
  userAgent: string | null;
  status: SubmissionStatus;
  createdAt: Date;
}

declare global {
  var __mongoClient: Promise<MongoClient> | undefined;
}

function getClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set.");

  // Cached on globalThis so dev hot-reloads and serverless warm starts reuse one connection.
  globalThis.__mongoClient ??= new MongoClient(uri).connect();
  return globalThis.__mongoClient;
}

export async function getDb() {
  return (await getClient()).db();
}

export async function getSubmissions(): Promise<Collection<ContactSubmission>> {
  const collection = (await getDb()).collection<ContactSubmission>("contact_submissions");
  await collection.createIndex({ ipAddress: 1, createdAt: -1 });
  return collection;
}
