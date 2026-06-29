/**
 * Seed Script — Run once to:
 * 1. Create the admin user in MongoDB (via Better Auth)
 * 2. Migrate all existing JSON data into MongoDB collections
 *
 * Usage: npm run seed
 */

import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Config ────────────────────────────────────────────────────────────────

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://Zabedfolio:Tpu6kgayBvZZ6krP@cluster0.mldxc9s.mongodb.net/zabed-folio-db?appName=Cluster0";

const BETTER_AUTH_SECRET =
  process.env.BETTER_AUTH_SECRET || "nxKx5dYG3Ol5iN9ccErVU3cNG13PJERR";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "zabedfolio@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "zabedfolio_Admin_233122";
const ADMIN_NAME = "Zabed Mahmud";

// ─── Helpers ─────────────────────────────────────────────────────────────

function readJson(relativePath) {
  const abs = resolve(__dirname, "..", relativePath);
  return JSON.parse(readFileSync(abs, "utf-8"));
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function seed() {
  console.log("🌱  Connecting to MongoDB Atlas…");

  const mongoClient = new MongoClient(MONGODB_URI, {
    serverApi: {
      version: "1",
      strict: true,
      deprecationErrors: true,
    },
  });

  await mongoClient.connect();
  const db = mongoClient.db("zabed-folio-db");
  console.log("✅  Connected.");

  // ── 1. Create admin user via Better Auth ──────────────────────────────
  console.log("\n👤  Creating admin user…");

  const authInstance = betterAuth({
    database: mongodbAdapter(db, {
      client: mongoClient,
      dbName: "zabed-folio-db",
    }),
    emailAndPassword: { enabled: true },
    secret: BETTER_AUTH_SECRET,
    baseURL: "http://localhost:3000",
  });

  try {
    const result = await authInstance.api.signUpEmail({
      body: {
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      },
    });

    if (result?.user) {
      console.log(`✅  Admin user created: ${result.user.email}`);
    } else {
      console.log("⚠️   Admin may already exist or sign-up returned no user.");
      console.log("    Continuing with data migration…");
    }
  } catch (err) {
    if (err?.message?.toLowerCase().includes("already") || err?.status === 422) {
      console.log("⚠️   Admin user already exists — skipping user creation.");
    } else {
      console.error("❌  Error creating admin:", err?.message || err);
    }
  }

  // ── 2. Migrate Projects ──────────────────────────────────────────────
  console.log("\n📦  Migrating projects…");
  const dbJson = readJson("db.json");
  const projects = dbJson.projects || [];

  const projectsCol = db.collection("projects");
  await projectsCol.deleteMany({});
  if (projects.length > 0) {
    await projectsCol.insertMany(
      projects.map((p, i) => ({ ...p, order: i }))
    );
    console.log(`✅  Inserted ${projects.length} projects.`);
  }

  // ── 3. Migrate Skills ────────────────────────────────────────────────
  console.log("\n🛠   Migrating skills…");
  const skills = readJson("src/data/skills.json");
  const skillsCol = db.collection("skills");
  await skillsCol.deleteMany({});
  await skillsCol.insertMany(skills.map((s, i) => ({ ...s, order: i })));
  console.log(`✅  Inserted ${skills.length} skills.`);

  // ── 4. Migrate Learned Skills ─────────────────────────────────────────
  console.log("\n📚  Migrating learned skills…");
  const learnedSkills = readJson("src/data/learnedSkills.json");
  const learnedCol = db.collection("learnedSkills");
  await learnedCol.deleteMany({});
  await learnedCol.insertMany(learnedSkills.map((s, i) => ({ ...s, order: i })));
  console.log(`✅  Inserted ${learnedSkills.length} learned skills.`);

  // ── 5. Migrate Education ─────────────────────────────────────────────
  console.log("\n🎓  Migrating education…");
  const education = readJson("src/data/education.json");
  const eduCol = db.collection("education");
  await eduCol.deleteMany({});
  await eduCol.insertMany(education.map((e, i) => ({ ...e, order: i })));
  console.log(`✅  Inserted ${education.length} education entries.`);

  // ── 6. Migrate Experience ────────────────────────────────────────────
  console.log("\n💼  Migrating experience…");
  const experience = readJson("src/data/experience.json");
  const expCol = db.collection("experience");
  await expCol.deleteMany({});
  await expCol.insertMany(experience.map((e, i) => ({ ...e, order: i })));
  console.log(`✅  Inserted ${experience.length} experience entries.`);

  // ── 7. Migrate Process Steps ──────────────────────────────────────────
  console.log("\n⚙️   Migrating process steps…");
  const processSteps = readJson("src/data/processSteps.json");
  const processCol = db.collection("processSteps");
  await processCol.deleteMany({});
  await processCol.insertMany(processSteps.map((p, i) => ({ ...p, order: i })));
  console.log(`✅  Inserted ${processSteps.length} process steps.`);

  // ── Done ──────────────────────────────────────────────────────────────
  await mongoClient.close();
  console.log("\n🎉  Seed complete! Your MongoDB is ready.");
  console.log(`    Login at: http://localhost:3000/admin/login`);
  console.log(`    Email:    ${ADMIN_EMAIL}`);
  console.log(`    Password: ${ADMIN_PASSWORD}`);
}

seed().catch((err) => {
  console.error("Fatal error during seed:", err);
  process.exit(1);
});
