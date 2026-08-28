/**
 * ==============================================================================
 * REMUSHA FINANCE - GOOGLE APPS SCRIPT WEB APP & SINKRONISASI
 * ==============================================================================
 * 
 * Skrip ini menyediakan:
 * 1. Web App API (doGet / doPost) untuk menerima/mengirim data langsung dari Web REMUSHA.
 * 2. Menu kustom "🕌 REMUSHA" di toolbar Google Sheets.
 * 3. Fitur hitung saldo otomatis dan pengurutan kronologis (tanggal lama di atas).
 */

const SUPABASE_URL = "https://pbxzrhzmtdfeldovqevz.supabase.co";
const SUPABASE_KEY = "sb_publishable_yb6iBTiYIXCT6dDRUvJ3qQ_GgKm2AH8";

/**
 * ------------------------------------------------------------------------------
 * A. WEB APP API ENDPOINTS (doGet & doPost)
 * ------------------------------------------------------------------------------
 */

// Handle GET Request: Mengembalikan seluruh data transaksi dalam format JSON
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    if (lastRow < 2) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
    const transactions = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (!row[1] && !row[2]) continue;

      let formattedDate = '';
      if (row[1] instanceof Date) {
        formattedDate = Utilities.formatDate(row[1], Session.getScriptTimeZone(), "yyyy-MM-dd");
      } else {
        formattedDate = String(row[1]);
      }

      transactions.push({
        id: i + 1,
        no: i + 1,
        tanggal: formattedDate,
        keterangan: String(row[2] || ''),
        pemasukan: Number(row[3]) || 0,
        pengeluaran: Number(row[4]) || 0,
        saldo: Number(row[5]) || 0,
        pj: String(row[6] || '')
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      count: transactions.length,
      data: transactions
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle POST Request: Menerima data input dari Web REMUSHA dan menyimpannya ke Spreadsheet
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    let body;

    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    } else {
      body = e.parameter;
    }

    const tanggal = body.tanggal || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
    const keterangan = body.keterangan || '';
    const pemasukan = Number(body.pemasukan) || 0;
    const pengeluaran = Number(body.pengeluaran) || 0;
    const pj = body.pj || 'Takmir';

    const lastRow = sheet.getLastRow();
    const newRowIndex = Math.max(lastRow + 1, 2);

    // Tambah baris baru
    sheet.appendRow([
      newRowIndex - 1,
      tanggal,
      keterangan,
      pemasukan,
      pengeluaran,
      0, // Saldo akan dihitung ulang otomatis di bawah
      pj
    ]);

    // Urutkan tanggal terlama di atas dan hitung ulang saldo
    sortTransactionsByDate();
    recalculateRunningBalance();

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data berhasil ditambahkan ke Google Sheets!'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}


/**
 * ------------------------------------------------------------------------------
 * B. MENU KUSTOM & FUNGSI GOOGLE SHEETS
 * ------------------------------------------------------------------------------
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🕌 REMUSHA')
    .addItem('📤 Kirim Data ke Supabase (Sync)', 'syncSheetToSupabase')
    .addItem('📥 Tarik Data dari Supabase', 'fetchSupabaseToSheet')
    .addSeparator()
    .addItem('📅 Urutkan Tanggal (Lama di Atas)', 'sortTransactionsByDate')
    .addItem('🧮 Hitung Ulang Saldo Otomatis', 'recalculateRunningBalance')
    .addToUi();
}

/**
 * 1. MENGIRIM SEMUA DATA SPREADSHEET KE SUPABASE
 */
function syncSheetToSupabase() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert('Pemberitahuan', 'Tidak ada data transaksi untuk dikirim.', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }

  sortTransactionsByDate();
  recalculateRunningBalance();

  const data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
  const transactionsToInsert = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rawDate = row[1];
    const keterangan = String(row[2] || '').trim();
    const pemasukan = Number(row[3]) || 0;
    const pengeluaran = Number(row[4]) || 0;
    const saldo = Number(row[5]) || 0;
    const pj = String(row[6] || '').trim();

    if (!rawDate && !keterangan) continue;

    let formattedDate = '';
    if (rawDate instanceof Date) {
      formattedDate = Utilities.formatDate(rawDate, Session.getScriptTimeZone(), "yyyy-MM-dd");
    } else {
      formattedDate = String(rawDate);
    }

    transactionsToInsert.push({
      tanggal: formattedDate,
      keterangan: keterangan,
      pemasukan: pemasukan,
      pengeluaran: pengeluaran,
      saldo: saldo,
      pj: pj || 'Takmir'
    });
  }

  if (transactionsToInsert.length === 0) {
    SpreadsheetApp.getUi().alert('Pemberitahuan', 'Tidak ada baris data valid untuk disinkronkan.', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }

  try {
    const options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Prefer': 'return=representation'
      },
      payload: JSON.stringify(transactionsToInsert),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(SUPABASE_URL + '/rest/v1/transactions', options);
    const responseCode = response.getResponseCode();

    if (responseCode >= 200 && responseCode < 300) {
      SpreadsheetApp.getUi().alert('Berhasil! 🎉', `Berhasil mengirim ${transactionsToInsert.length} data transaksi ke database Supabase.`, SpreadsheetApp.getUi().ButtonSet.OK);
    } else {
      SpreadsheetApp.getUi().alert('Gagal Mengirim Data', `Status: ${responseCode}\nRespon: ${response.getContentText()}`, SpreadsheetApp.getUi().ButtonSet.OK);
    }
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error Koneksi', error.toString(), SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * 2. MENARIK DATA DARI SUPABASE KE SPREADSHEET (Urut Tanggal Lama di Atas)
 */
function fetchSupabaseToSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  try {
    const options = {
      method: 'get',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY
      },
      muteHttpExceptions: true
    };

    const url = SUPABASE_URL + '/rest/v1/transactions?select=*&order=tanggal.asc,id.asc';
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();

    if (responseCode !== 200) {
      SpreadsheetApp.getUi().alert('Gagal Mengambil Data', `Status: ${responseCode}\nRespon: ${response.getContentText()}`, SpreadsheetApp.getUi().ButtonSet.OK);
      return;
    }

    const transactions = JSON.parse(response.getContentText());

    if (!transactions || transactions.length === 0) {
      SpreadsheetApp.getUi().alert('Data Kosong', 'Tabel di database Supabase belum memiliki data.', SpreadsheetApp.getUi().ButtonSet.OK);
      return;
    }

    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, 7).clearContent();
    }

    const rows = [];
    for (let i = 0; i < transactions.length; i++) {
      const t = transactions[i];
      rows.push([
        i + 1,
        t.tanggal,
        t.keterangan,
        t.pemasukan || 0,
        t.pengeluaran || 0,
        t.saldo || 0,
        t.pj || ''
      ]);
    }

    sheet.getRange(2, 1, rows.length, 7).setValues(rows);
    sheet.getRange(2, 4, rows.length, 3).setNumberFormat('"Rp"#,##0');

    SpreadsheetApp.getUi().alert('Berhasil! 🎉', `Berhasil memuat ${rows.length} transaksi dari database Supabase.`, SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error', error.toString(), SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * 3. MENGURUTKAN BARIS BERDASARKAN TANGGAL TERLAMA DI ATAS (ASC)
 */
function sortTransactionsByDate() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  
  if (lastRow <= 2) return;

  const range = sheet.getRange(2, 1, lastRow - 1, 7);
  range.sort([{ column: 2, ascending: true }]);

  for (let i = 2; i <= lastRow; i++) {
    sheet.getRange(i, 1).setValue(i - 1);
  }
}

/**
 * 4. MENGHITUNG ULANG SALDO AKUMULASI DARI ATAS KE BAWAH
 */
function recalculateRunningBalance() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) return;

  const data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
  let currentBalance = 0;

  for (let i = 0; i < data.length; i++) {
    const pemasukan = Number(data[i][3]) || 0;
    const pengeluaran = Number(data[i][4]) || 0;
    currentBalance = currentBalance + pemasukan - pengeluaran;
    
    sheet.getRange(i + 2, 6).setValue(currentBalance);
    sheet.getRange(i + 2, 1).setValue(i + 1);
  }

  sheet.getRange(2, 4, data.length, 3).setNumberFormat('"Rp"#,##0');
}
