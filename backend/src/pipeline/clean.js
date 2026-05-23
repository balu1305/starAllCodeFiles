/**
 * src/pipeline/clean.js
 * ──────────────────────
 * Step 3 of 5 — Clean
 *
 * Type-casts string values to their proper types (numbers, mobile strings).
 * Applies sensible defaults (0 for missing numeric fields).
 * Reports null counts for observability.
 */

const { toNumeric, cleanMobile } = require('../utils/helpers');

/**
 * @param {object[]} records       - Raw line-item records from extract()
 * @param {object[]} recordsOfCash - Raw dues records from extract()
 * @returns {{ df: object[], df2: object[] }}
 */
function clean(records, recordsOfCash) {
  console.log('[3/5] Cleaning data …');

  // ── Clean line-item records ────────────────────────────────────────────────
  const df = records.map(r => ({
    ...r,
    Copies:     toNumeric(r.Copies),
    Returns:    toNumeric(r.Returns)    ?? 0,
    Net_Copies: toNumeric(r.Net_Copies),
    Rate:       toNumeric(r.Rate)       ?? 0,
    Amount:     toNumeric(r.Amount)     ?? 0,
    Mobile:     cleanMobile(r.Mobile),
  }));

  // ── Clean dues records ─────────────────────────────────────────────────────
  const df2 = recordsOfCash.map(r => ({
    ...r,
    Collection:                toNumeric(r.Collection),
    'Total Due':               toNumeric(r['Total Due']),
    'Total Amount to be Paid': toNumeric(r['Total Amount to be Paid']),
    Mobile:                    cleanMobile(r.Mobile),
  }));

  // ── Observability ──────────────────────────────────────────────────────────
  const countNulls = arr =>
    arr.reduce((acc, row) =>
      acc + Object.values(row).filter(v => v === null || v === undefined).length, 0);

  console.log(`      Records: ${df.length} rows  | nulls: ${countNulls(df)}`);
  console.log(`      Dues:    ${df2.length} rows  | nulls: ${countNulls(df2)}`);

  return { df, df2 };
}

module.exports = clean;
