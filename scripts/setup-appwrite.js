/* scripts/setup-appwrite.js */
const path = require("path");
const fs = require("fs");
const sdk = require("node-appwrite");

const envPath = process.env.DOTENV_CONFIG_PATH || process.env.dotenv_config_path || path.resolve(process.cwd(), ".env.appwrite.local");
if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath });
  console.log("🔎 Loaded env from:", envPath);
}

const {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  APPWRITE_API_KEY,
  APPWRITE_DB_ID = "nutrition_db",
  APPWRITE_PROFILES_COLLECTION_ID = "profiles",
  APPWRITE_HEALTH_COLLECTION_ID = "health_profiles",
} = process.env;

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
  console.error("❌ Missing APPWRITE_* env vars"); process.exit(1);
}

const client = new sdk.Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID).setKey(APPWRITE_API_KEY);
const db = new sdk.Databases(client);

const ok = async (fn, label) => {
  try { await fn(); console.log(`+ ${label}`); }
  catch (e) {
    const c = e?.code || e?.response?.status;
    if (c === 409) console.log(`✓ ${label} exists`);
    else console.warn(`(!) ${label}:`, e?.message || e);
  }
};

async function ensureDb(id, name) {
  try { await db.get(id); console.log(`✓ db ${id}`); }
  catch { await db.create(id, name); console.log(`+ db ${id}`); }
}
async function ensureColl(id, cid, name) {
  try { await db.getCollection(id, cid); console.log(`✓ coll ${cid}`); }
  catch {
    await db.createCollection(
      id, cid, name,
      [sdk.Permission.create(sdk.Role.users())],
      true, // documentSecurity
      true  // enabled
    );
    console.log(`+ coll ${cid}`);
  }
}

async function main() {
  await ensureDb(APPWRITE_DB_ID, "Nutrition DB");

  // profiles: ONLY displayName + image
  await ensureColl(APPWRITE_DB_ID, APPWRITE_PROFILES_COLLECTION_ID, "Profiles");
  await ok(() => db.createStringAttribute(APPWRITE_DB_ID, APPWRITE_PROFILES_COLLECTION_ID, "displayName", 128, false), "profiles.displayName");
  await ok(() => db.createStringAttribute(APPWRITE_DB_ID, APPWRITE_PROFILES_COLLECTION_ID, "image", 2048, false), "profiles.image");

  // health_profiles: all PHI + flags + height/weight JSON
  await ensureColl(APPWRITE_DB_ID, APPWRITE_HEALTH_COLLECTION_ID, "Health Profiles");
  await ok(() => db.createStringAttribute(APPWRITE_DB_ID, APPWRITE_HEALTH_COLLECTION_ID, "dateOfBirth", 32, false), "health.dateOfBirth");
  await ok(() => db.createStringAttribute(APPWRITE_DB_ID, APPWRITE_HEALTH_COLLECTION_ID, "sex", 16, false), "health.sex");
  await ok(() => db.createStringAttribute(APPWRITE_DB_ID, APPWRITE_HEALTH_COLLECTION_ID, "activityLevel", 32, false), "health.activityLevel");
  await ok(() => db.createStringAttribute(APPWRITE_DB_ID, APPWRITE_HEALTH_COLLECTION_ID, "goal", 32, false), "health.goal");
  await ok(() => db.createJsonAttribute(APPWRITE_DB_ID, APPWRITE_HEALTH_COLLECTION_ID, "height", false), "health.height");
  await ok(() => db.createJsonAttribute(APPWRITE_DB_ID, APPWRITE_HEALTH_COLLECTION_ID, "weight", false), "health.weight");
  await ok(() => db.createJsonAttribute(APPWRITE_DB_ID, APPWRITE_HEALTH_COLLECTION_ID, "flags", false), "health.flags");
  await ok(() => db.createStringAttribute(APPWRITE_DB_ID, APPWRITE_HEALTH_COLLECTION_ID, "diets", 64, false, undefined, true), "health.diets[]");
  await ok(() => db.createStringAttribute(APPWRITE_DB_ID, APPWRITE_HEALTH_COLLECTION_ID, "allergens", 64, false, undefined, true), "health.allergens[]");
  await ok(() => db.createStringAttribute(APPWRITE_DB_ID, APPWRITE_HEALTH_COLLECTION_ID, "intolerances", 64, false, undefined, true), "health.intolerances[]");
  await ok(() => db.createStringAttribute(APPWRITE_DB_ID, APPWRITE_HEALTH_COLLECTION_ID, "dislikedIngredients", 64, false, undefined, true), "health.dislikedIngredients[]");
  await ok(() => db.createBooleanAttribute(APPWRITE_DB_ID, APPWRITE_HEALTH_COLLECTION_ID, "onboardingComplete", false), "health.onboardingComplete");

  console.log("✅ Schema enforced (additions). Remove extra attributes in Console for profiles.");
}
main().catch(e => { console.error("❌ setup failed:", e?.message || e); process.exit(1); });
