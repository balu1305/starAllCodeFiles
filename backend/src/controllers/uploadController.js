/**
 * src/controllers/uploadController.js
 * ─────────────────────────────────────
 * Orchestrates the five ETL pipeline steps and builds the HTTP response.
 *
 * Called by: POST /upload
 */

const load       = require('../pipeline/load');
const extract    = require('../pipeline/extract');
const clean      = require('../pipeline/clean');
const reconcile  = require('../pipeline/reconcile');
const dbUpload   = require('../pipeline/dbUpload');
const { makePreview } = require('../utils/helpers');

/**
 * POST /upload
 *
 * Expects a multipart/form-data request with a single field named "file"
 * containing a .csv, .xlsx, or .xls spreadsheet.
 */
async function handleUpload(req, res, next) {
  try {
    console.log('='.repeat(50));
    console.log('  StarQ ETL Pipeline');
    console.log('='.repeat(50));

    const fileSizeKb = (req.file.buffer.length / 1024).toFixed(2);
    console.log(`  File: ${req.file.originalname}  (${fileSizeKb} KB)`);

    // ── Run the pipeline ───────────────────────────────────────────────────
    const rows                       = load(req.file.buffer, req.file.originalname);
    const { records, recordsOfCash } = extract(rows);
    const { df, df2 }                = clean(records, recordsOfCash);
    const { df: finalDf, df2: finalDf2 } = reconcile(df, df2);

    await dbUpload(finalDf, finalDf2);

    console.log('='.repeat(50));
    console.log('  Pipeline complete.');
    console.log('='.repeat(50));

    // ── Build response summary ─────────────────────────────────────────────
    const uniqueCustomers = new Set(finalDf.map(r => r.Customer)).size;
    const nullCount = finalDf.reduce((acc, row) =>
      acc + Object.values(row).filter(v => v === null).length, 0);

    res.status(200).json({
      status:       'success',
      filename:     req.file.originalname,
      file_size_kb: parseFloat(fileSizeKb),
      records: {
        rows:             finalDf.length,
        columns:          Object.keys(finalDf[0] || {}),
        unique_customers: uniqueCustomers,
        null_count:       nullCount,
        preview:          makePreview(finalDf),
      },
      dues: {
        rows:    finalDf2.length,
        columns: Object.keys(finalDf2[0] || {}),
        preview: makePreview(finalDf2),
      },
    });

  } catch (err) {
    next(err); // passes to global error handler in app.js
  }
}

module.exports = { handleUpload };
