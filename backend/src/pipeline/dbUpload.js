/**
 * src/pipeline/dbUpload.js
 * ─────────────────────────
 * Step 5 of 5 — Upload
 *
 * Inserts cleaned records into MongoDB using the shared Db instance.
 * Writes are batched to avoid exceeding the 16 MB BSON document limit
 * and to reduce memory spikes on large files.
 */

const { getDb }                     = require('../config/db');
const { COL_RECORDS, COL_DUES, BATCH_SIZE } = require('../config/collections');

/**
 * Insert an array of documents into a collection in batches.
 * @param {import('mongodb').Collection} col
 * @param {object[]} docs
 * @param {number}   batchSize
 */
async function batchInsert(col, docs, batchSize) {
  for (let i = 0; i < docs.length; i += batchSize) {
    await col.insertMany(docs.slice(i, i + batchSize));
  }
}

/**
 * @param {object[]} df   - Final line-item records
 * @param {object[]} df2  - Final dues records
 */
async function dbUpload(df, df2) {
  console.log('[5/5] Uploading to MongoDB …');

  const db = await getDb();

  // ── Records ────────────────────────────────────────────────────────────────
  const recCol = db.collection(COL_RECORDS);
  await batchInsert(recCol, df, BATCH_SIZE);
  console.log(`      Inserted ${df.length} documents → '${COL_RECORDS}'`);

  // ── Dues ───────────────────────────────────────────────────────────────────
  const dueCol = db.collection(COL_DUES);
  await batchInsert(dueCol, df2, BATCH_SIZE);
  console.log(`      Inserted ${df2.length} documents → '${COL_DUES}'`);

  console.log('      Done ✓');
}

module.exports = dbUpload;
