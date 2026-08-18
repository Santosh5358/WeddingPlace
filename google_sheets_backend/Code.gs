const SHEET_ID = '1DjY4EfKEf0ZC8LQ_rC2H6m3kJkKRzhZ3hufcWCiJyTA';
const BOOKINGS_SHEET_NAME = 'Bookings';
const BLOCKED_DATES_SHEET_NAME = 'BlockedDates';
const BOOKINGS_HEADERS = [
  'Booking ID',
  'Created At',
  'Event Date',
  'Guest Count',
  'Full Name',
  'Email',
  'Phone',
  'Event Type',
  'Message',
  'Status'
];
const BLOCKED_DATES_HEADERS = ['Event Date', 'Reason'];

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    const params = (e && e.parameter) ? e.parameter : {};
    const action = String(params.action || '').trim();

    // Ensure the spreadsheet always has required tabs + headers.
    ensureTemplate();

    if (action === 'initTemplate') {
      return jsonResponse({
        success: true,
        message: 'Template initialized successfully.',
        sheets: [BOOKINGS_SHEET_NAME, BLOCKED_DATES_SHEET_NAME]
      });
    }

    if (action === 'checkAvailability') {
      const eventDate = normalizeDateKey(params.eventDate);
      if (!eventDate) {
        return jsonResponse({ success: false, available: false, message: 'Event date is required.' });
      }

      const availability = checkAvailability(eventDate);
      return jsonResponse({ success: true, available: availability.available, message: availability.message });
    }

    if (action === 'checkInquiryStatus') {
      const eventDate = normalizeDateKey(params.eventDate);
      const email = String(params.email || '').trim();
      const phone = String(params.phone || '').trim();

      if (!eventDate) {
        return jsonResponse({ success: false, found: false, message: 'Event date is required.' });
      }

      if (!email && !phone) {
        return jsonResponse({ success: false, found: false, message: 'Please provide phone number or email address.' });
      }

      const inquiry = findInquiryStatus(eventDate, email, phone);
      if (!inquiry.found) {
        return jsonResponse({
          success: true,
          found: false,
          message: 'No inquiry found for these details.'
        });
      }

      return jsonResponse({
        success: true,
        found: true,
        bookingId: inquiry.bookingId,
        status: inquiry.status,
        message: 'Inquiry found. Current status: ' + inquiry.status + '. Reference: ' + inquiry.bookingId
      });
    }

    if (action === 'createBooking') {
      const payload = {
        eventDate: normalizeDateKey(params.eventDate),
        guestCount: String(params.guestCount || '').trim(),
        fullName: String(params.fullName || '').trim(),
        email: String(params.email || '').trim(),
        phone: String(params.phone || '').trim(),
        eventType: String(params.eventType || '').trim(),
        message: String(params.message || '').trim()
      };

      if (!payload.eventDate || !payload.fullName || !payload.phone) {
        return jsonResponse({ success: false, message: 'Event date, full name, and phone are required.' });
      }

      const availability = checkAvailability(payload.eventDate);
      if (!availability.available) {
        return jsonResponse({ success: false, message: availability.message });
      }

      const bookingId = saveBooking(payload);
      return jsonResponse({
        success: true,
        bookingId: bookingId,
        status: 'Pending',
        message: 'Your inquiry has been submitted and is pending confirmation. Reference: ' + bookingId
      });
    }

    return jsonResponse({ success: false, message: 'Invalid action.' });
  } catch (error) {
    return jsonResponse({ success: false, message: 'Server error: ' + error.message });
  }
}

function saveBooking(payload) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getOrCreateSheet(BOOKINGS_SHEET_NAME, BOOKINGS_HEADERS);

    const bookingId = 'BK-' + Utilities.getUuid().slice(0, 8).toUpperCase();
    const createdAt = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

    sheet.appendRow([
      bookingId,
      createdAt,
      payload.eventDate,
      payload.guestCount,
      payload.fullName,
      payload.email,
      payload.phone,
      payload.eventType,
      payload.message,
      'Pending'
    ]);

    return bookingId;
  } finally {
    lock.releaseLock();
  }
}

function checkAvailability(eventDateKey) {
  const blockedSheet = getOrCreateSheet(BLOCKED_DATES_SHEET_NAME, BLOCKED_DATES_HEADERS);
  const bookingsSheet = getOrCreateSheet(BOOKINGS_SHEET_NAME, BOOKINGS_HEADERS);

  const blockedValues = blockedSheet.getDataRange().getValues();
  for (let i = 1; i < blockedValues.length; i += 1) {
    const dateValue = normalizeDateKey(blockedValues[i][0]);
    if (dateValue === eventDateKey) {
      const reason = String(blockedValues[i][1] || '').trim();
      return {
        available: false,
        message: reason ? ('This date is unavailable: ' + reason) : 'This date is currently unavailable.'
      };
    }
  }

  const bookingValues = bookingsSheet.getDataRange().getValues();
  for (let i = 1; i < bookingValues.length; i += 1) {
    const existingDate = normalizeDateKey(bookingValues[i][2]);
    const status = String(bookingValues[i][9] || '').trim().toLowerCase();
    const isClosedStatus = status === 'cancelled' || status === 'rejected';

    if (existingDate === eventDateKey && !isClosedStatus) {
      return {
        available: false,
        message: 'This date already has an active booking request.'
      };
    }
  }

  return {
    available: true,
    message: 'Great news. Your date is available.'
  };
}

function findInquiryStatus(eventDateKey, email, phone) {
  const bookingsSheet = getOrCreateSheet(BOOKINGS_SHEET_NAME, BOOKINGS_HEADERS);
  const bookingValues = bookingsSheet.getDataRange().getValues();

  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedPhone = normalizePhone(phone);

  for (let i = bookingValues.length - 1; i >= 1; i -= 1) {
    const row = bookingValues[i];
    const existingDate = normalizeDateKey(row[2]);
    if (existingDate !== eventDateKey) {
      continue;
    }

    const existingEmail = String(row[5] || '').trim().toLowerCase();
    const existingPhone = normalizePhone(row[6]);

    const emailMatch = normalizedEmail && existingEmail === normalizedEmail;
    const phoneMatch = normalizedPhone && existingPhone === normalizedPhone;

    if (!emailMatch && !phoneMatch) {
      continue;
    }

    const bookingId = String(row[0] || '').trim() || 'N/A';
    const status = String(row[9] || '').trim() || 'Pending';
    return {
      found: true,
      bookingId: bookingId,
      status: status
    };
  }

  return { found: false };
}

function getOrCreateSheet(sheetName, headers) {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    sheet.appendRow(headers);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    return sheet;
  }

  const existingHeader = sheet.getRange(1, 1, 1, headers.length).getValues()[0].map((v) => String(v || '').trim());
  const expectedHeader = headers.map((v) => String(v || '').trim());
  const headerMismatch = existingHeader.join('||') !== expectedHeader.join('||');

  if (headerMismatch) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  return sheet;
}

function ensureTemplate() {
  getOrCreateSheet(BOOKINGS_SHEET_NAME, BOOKINGS_HEADERS);
  getOrCreateSheet(BLOCKED_DATES_SHEET_NAME, BLOCKED_DATES_HEADERS);
}

function normalizeDateKey(value) {
  if (!value) {
    return '';
  }

  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }

  const asString = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(asString)) {
    return asString;
  }

  // Accept DD-MM-YYYY or DD/MM/YYYY, but always store/use YYYY-MM-DD.
  const dmyMatch = asString.match(/^(\d{2})[-\/]((?:0[1-9])|(?:1[0-2]))[-\/](\d{4})$/);
  if (dmyMatch) {
    const day = Number(dmyMatch[1]);
    const month = Number(dmyMatch[2]);
    const year = Number(dmyMatch[3]);
    const parsedDmy = new Date(year, month - 1, day);

    const isValidDmy =
      parsedDmy.getFullYear() === year &&
      parsedDmy.getMonth() === month - 1 &&
      parsedDmy.getDate() === day;

    if (isValidDmy) {
      return [
        String(year),
        String(month).padStart(2, '0'),
        String(day).padStart(2, '0')
      ].join('-');
    }
  }

  // Also accept YYYY/MM/DD and normalize it to YYYY-MM-DD.
  const ymdSlashMatch = asString.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
  if (ymdSlashMatch) {
    return [ymdSlashMatch[1], ymdSlashMatch[2], ymdSlashMatch[3]].join('-');
  }

  const parsed = new Date(asString);
  if (!isNaN(parsed.getTime())) {
    return Utilities.formatDate(parsed, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }

  return '';
}

function normalizePhone(value) {
  return String(value || '').replace(/\D+/g, '');
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
