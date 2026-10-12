/**
 * Client intake → Google Sheet
 *
 * Receives submissions from the intake form (index.html) and appends one row
 * per submission to the "Responses" tab of the sheet this script is bound to.
 *
 * Columns are matched by header name, so adding or reordering questions in the
 * form never scrambles existing data: any new field gets a new column at the end.
 *
 * Setup (once): Extensions → Apps Script in the response sheet, paste this file,
 * then Deploy → New deployment → Web app, Execute as: Me, Who has access: Anyone.
 */

const SHEET_NAME = "Responses";
const NOTIFY_EMAIL = "travis.oh@apexsolutionconsulting.com"; // set to "" to turn off email alerts

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse(e.postData.contents);

    // Minimal sanity check: every real submission carries these.
    if (!data || !data.submitted_at || !data.P1_email) {
      return json_({ ok: false, error: "missing fields" });
    }

    const sheet = getSheet_();
    let headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0].filter(String);

    // Add a column for any field the sheet doesn't have yet.
    const missing = Object.keys(data).filter(k => headers.indexOf(k) === -1);
    if (missing.length) {
      sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]).setFontWeight("bold");
      headers = headers.concat(missing);
    }

    // Store every answer as plain text. A leading apostrophe stops answers that
    // start with = + - @ from being treated as formulas, and keeps "$60" or "55%"
    // exactly as the client typed it.
    const row = headers.map(h => {
      const v = (data[h] === undefined || data[h] === null) ? "" : String(data[h]);
      return v === "" ? "" : "'" + v;
    });
    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      const who = data.P2_business || data.client_name || data.client || "A client";
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: "New intake: " + who,
        body: who + " submitted the paid media audit intake.\n\n" +
              "Contact: " + (data.P1_name || "") + " <" + data.P1_email + ">\n" +
              "Website: " + (data.P2_website || "") + "\n\n" +
              "Responses sheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl()
      });
    }

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the web app URL in a browser to confirm it's live.
function doGet() {
  return json_({ ok: true, message: "Intake endpoint is live." });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1).setValue("submitted_at");
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
