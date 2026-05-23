/**
 * src/pipeline/reconcile.js
 * ──────────────────────────
 * Step 4 of 5 — Reconcile
 *
 * Ensures every customer that appears in the dues collection also has
 * at least one entry in the records collection.
 * If a customer is only in dues (e.g. balance carried forward with no new
 * transactions), a zero-value placeholder record is inserted so foreign-key
 * style joins work downstream.
 */

const { sanitizeDocs } = require('../utils/helpers');

/**
 * @param {object[]} df   - Cleaned line-item records
 * @param {object[]} df2  - Cleaned dues records
 * @returns {{ df: object[], df2: object[] }}
 */
function reconcile(df, df2) {
  console.log('[4/5] Reconciling customers …');

  const recordCustomers = new Set(df.map(r  => r.Customer));
  const duesCustomers   = new Set(df2.map(r => r.Customer));

  const missing = [...duesCustomers].filter(c => !recordCustomers.has(c));

  if (missing.length > 0) {
    console.log(`      Found ${missing.length} customer(s) in dues but not in records — inserting placeholders`);

    const placeholders = df2
      .filter(r => missing.includes(r.Customer))
      .map(r => ({
        Date:       new Date('1970-01-01'),
        Bill_No:    null,
        Customer:   r.Customer,
        Address:    r.Address,
        Contact:    r.Contact,
        Mobile:     r.Mobile,
        City:       r.City,
        Title:      null,
        Copies:     0,
        Returns:    0,
        Net_Copies: 0,
        Rate:       0,
        Amount:     0,
      }));

    df = [...df, ...placeholders];
  } else {
    console.log('      All customers are consistent ✓');
  }

  // Replace undefined → null so MongoDB doesn't silently drop keys
  df  = sanitizeDocs(df);
  df2 = sanitizeDocs(df2);

  const uniqueCustomers = new Set(df.map(r => r.Customer)).size;
  console.log(`      Final records: ${df.length} rows`);
  console.log(`      Unique customers: ${uniqueCustomers}`);

  return { df, df2 };
}

module.exports = reconcile;
