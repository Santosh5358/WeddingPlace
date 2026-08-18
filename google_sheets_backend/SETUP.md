# Google Sheets Booking Setup

1. Open Apps Script: https://script.google.com/
2. Create a new project and paste code from `google_sheets_backend/Code.gs`.
3. Save and click Deploy > New deployment.
4. Deployment type: Web app.
5. Execute as: Me.
6. Who has access: Anyone.
7. Deploy and copy the web app URL.
8. In these files, replace `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with that URL:
   - `gallery/code.html`
   - `home/code.html`
9. Run `./sync-pages.ps1` from project root to sync `index.html` files.

## Spreadsheet structure

No manual template creation is required.
The script auto-creates and repairs required sheets and headers in a blank spreadsheet.

Optional manual initialization:
- Open this URL once in browser after deployment:
- `YOUR_WEB_APP_URL?action=initTemplate`
- Example: `https://script.google.com/macros/s/....../exec?action=initTemplate`

The script auto-creates these sheets in your spreadsheet:
- `Bookings`
- `BlockedDates`

### `BlockedDates`
- Column A: Event Date (`YYYY-MM-DD`)
- Column B: Reason (optional)

If a date exists in `BlockedDates`, it will be unavailable.

### `Bookings`
The script appends each booking with status `Pending`.
A date is considered unavailable if there is an existing booking on that date with status not equal to `Cancelled` or `Rejected`.
