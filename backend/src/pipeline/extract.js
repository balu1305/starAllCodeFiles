/**
 * src/pipeline/extract.js
 * ────────────────────────
 * Step 2 of 5 — Extract
 *
 * Walks the raw row array produced by load.js and produces:
 *   • records      — line-item rows (one per title / book sold)
 *   • recordsOfCash — dues summary rows (one per customer bill)
 *
 * The raw spreadsheet has a custom layout where context fields
 * (Date, Bill No, Customer, etc.) appear above or beside the line items,
 * so we track "current" values as we iterate.
 */

const { parseDate } = require('../utils/helpers');

/**
 * @param {Array<Array<string|null>>} rows
 * @returns {{ records: object[], recordsOfCash: object[] }}
 */
function extract(rows) {
  console.log('[2/5] Extracting records …');

  const records       = [];
  const recordsOfCash = [];

  // Context carried forward as we scan rows
  let currentDate     = null;
  let currentBill     = null;
  let currentCustomer = null;
  let currentCity     = null;
  let currentAddress  = null;
  let currentContact  = null;
  let currentMobile   = null;

  for (let idx = 0; idx < rows.length; idx++) {
    const row     = rows[idx];
    const prevRow = idx > 0 ? rows[idx - 1] : row;

    // ── Detect date in col 0 ─────────────────────────────────────────────────
    const parsedDate = parseDate(row[0]);
    if (parsedDate) currentDate = parsedDate;

    // ── Detect bill number (contains "DC-") ──────────────────────────────────
    if (row[1] && String(row[1]).includes('DC-')) {
      currentBill = row[1];
    }

    // ── Detect labelled context fields (col 0 = label, col 1 = value) ────────
    const cell = String(row[0] ?? '').trim();
    if      (cell === 'Customer:') currentCustomer = row[1];
    else if (cell === 'Mobile:')   currentMobile   = row[1];
    else if (cell === 'City:')     currentCity     = row[1];
    else if (cell === 'Address:')  currentAddress  = row[1];
    else if (cell === 'Contact:')  currentContact  = row[1];

    // ── Detect dues summary row — "Total Due" appears anywhere in the row ─────
    const rowHasTotalDue = row.some(v => String(v ?? '').trim() === 'Total Due');
    if (rowHasTotalDue) {
      recordsOfCash.push({
        Customer:                  currentCustomer,
        Address:                   currentAddress,
        Contact:                   currentContact,
        Mobile:                    currentMobile,
        City:                      currentCity,
        'Total Amount to be Paid': prevRow[7],
        Collection:                prevRow[8],
        'Total Due':               row[8],
      });
    }

    // ── Detect line-item rows (col 2 is non-empty) ────────────────────────────
    const title = row[2];
    if (title !== null && title !== undefined && String(title).trim() !== '') {
      const t = String(title).trim();
      const skipTitles = new Set(['Title', 'B.F']);
      const skipContains = ['Cash', 'Cheque'];

      const shouldSkip =
        skipTitles.has(t) ||
        skipContains.some(s => t.includes(s));

      if (!shouldSkip) {
        records.push({
          Date:       currentDate,
          Bill_No:    currentBill,
          Customer:   currentCustomer,
          Address:    currentAddress,
          Contact:    currentContact,
          Mobile:     currentMobile,
          City:       currentCity,
          Title:      title,
          Copies:     row[3],
          Returns:    row[4],
          Net_Copies: row[5],
          Rate:       row[6],
          Amount:     row[7],
        });
      }
    }
  }

  console.log(`      ${records.length} line-item records extracted`);
  console.log(`      ${recordsOfCash.length} dues records extracted`);
  return { records, recordsOfCash };
}

module.exports = extract;
