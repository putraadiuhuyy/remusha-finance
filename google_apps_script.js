/**
 * ==============================================================================
 * REMUSHA FINANCE - GOOGLE APPS SCRIPT WEB APP & SINKRONISASI 2-ARAH
 * ==============================================================================
 * 
 * Skrip ini menyediakan:
 * 1. Web App API (doGet / doPost) untuk menerima/mengirim data langsung dari Web REMUSHA.
 * 2. Menu kustom "🕌 REMUSHA" di toolbar Google Sheets.
 * 3. Fitur format otomatis awalan "Rp" (membersihkan teks/string menjadi angka murni).
 * 4. Fitur hitung saldo otomatis dan pengurutan kronologis (tanggal lama di atas).
 * 5. Sinkronisasi Penuh (Mirror) ke Supabase: Jika data di Spreadsheet dihapus, data di web juga ikut terhapus saat disinkronkan.
 */

const SUPABASE_URL = "https://pbxzrhzmtdfeldovqevz.supabase.co";
const SUPABASE_KEY = "sb_publishable_yb6iBTiYIXCT6dDRUvJ3qQ_GgKm2AH8";

// Format Rupiah standar Google Sheets yang kompatibel untuk semua bahasa/locale:
const RUPIAH_NUMBER_FORMAT = '"Rp "#,##0;("Rp "#,##0);"-"';

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
        pemasukan: cleanNumber(row[3]),
        pengeluaran: cleanNumber(row[4]),
        saldo: cleanNumber(row[5]),
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
    const pemasukan = cleanNumber(body.pemasukan);
    const pengeluaran = cleanNumber(body.pengeluaran);
    const pj = body.pj || 'Admin Remusha';

    const lastRow = sheet.getLastRow();
    const newRowIndex = Math.max(lastRow + 1, 2);

    // Tambah baris baru
    sheet.appendRow([
      newRowIndex - 1,
      tanggal,
      keterangan,
      pemasukan,
      pengeluaran,
      0, // Saldo akan dihitung ulang otomatis
      pj
    ]);

    // 1. Urutkan berdasarkan tanggal ASC (tanggal lebih lama di atas)
    sortTransactionsByDate();

    // 2. Hitung ulang running balance dan format Rp
    recalculateRunningBalance();

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Transaksi berhasil dicatat dan diformat Rp di Google Sheets.'
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
 * B. MENU KHUSUS "🕌 REMUSHA" DI GOOGLE SHEETS
 * ------------------------------------------------------------------------------
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🕌 REMUSHA')
    .addItem('💰 Format Ulang Kolom Rp (Pemasukan, Pengeluaran, Saldo)', 'formatCurrencyRp')
    .addItem('🔄 Hitung Ulang Saldo & Urutkan Tanggal', 'recalculateAndSort')
    .addSeparator()
    .addItem('⬆️ Sinkronkan ke Web / Supabase (Mirror Data)', 'syncSheetToSupabase')
    .addItem('⬇️ Ambil Data dari Web / Supabase ke Sheet', 'fetchSupabaseToSheet')
    .addToUi();
}

/**
 * ------------------------------------------------------------------------------
 * C. FUNGSI UTAMA FORMAT RUPIAH & PENGURUTAN
 * ------------------------------------------------------------------------------
 */

// Helper untuk membersihkan nilai string (seperti "Rp 50.000" atau "50000") menjadi angka Number
function cleanNumber(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  // Hapus semua karakter kecuali angka, tanda minus, dan titik desimal
  const str = String(val).replace(/Rp|\s|\./gi, '').replace(',', '.');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

/**
 * 1. FORMAT AWALAN "Rp" PADA KOLOM PEMASUKAN, PENGELUARAN, DAN SALDO
 * Fungsi ini membersihkan nilai teks menjadi angka murni agar format number "Rp" bekerja 100%.
 */
function formatCurrencyRp() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  
  if (lastRow < 2) return;

  const numRows = lastRow - 1;
  const moneyRange = sheet.getRange(2, 4, numRows, 3); // Kolom D, E, F
  const moneyValues = moneyRange.getValues();

  // Bersihkan setiap cell agar menjadi tipe data Number murni
  for (let r = 0; r < moneyValues.length; r++) {
    moneyValues[r][0] = cleanNumber(moneyValues[r][0]); // Kolom D (Pemasukan)
    moneyValues[r][1] = cleanNumber(moneyValues[r][1]); // Kolom E (Pengeluaran)
    moneyValues[r][2] = cleanNumber(moneyValues[r][2]); // Kolom F (Saldo)
  }

  // Tuliskan kembali angka murni ke Spreadsheet
  moneyRange.setValues(moneyValues);

  // Terapkan format "Rp" #,##0
  moneyRange.setNumberFormat(RUPIAH_NUMBER_FORMAT);
  moneyRange.setHorizontalAlignment('right');

  // Rata Tengah untuk No (Kolom A) dan Tanggal (Kolom B)
  sheet.getRange(2, 1, numRows, 2).setHorizontalAlignment('center');
}

/**
 * 2. GABUNGAN: URUTKAN TANGGAL, HITUNG SALDO, DAN FORMAT RP
 */
function recalculateAndSort() {
  sortTransactionsByDate();
  recalculateRunningBalance();
  formatCurrencyRp();
  SpreadsheetApp.getUi().alert('Selesai! ✨', 'Tabel berhasil diurutkan berdasarkan tanggal lama di atas, saldo telah dihitung ulang, dan kolom telah diformat awalan Rp.', SpreadsheetApp.getUi().ButtonSet.OK);
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

  // Perbaiki penomoran urut No (Kolom 1)
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

  const numRows = lastRow - 1;
  const data = sheet.getRange(2, 1, numRows, 7).getValues();
  let currentBalance = 0;

  for (let i = 0; i < data.length; i++) {
    const pemasukan = cleanNumber(data[i][3]);
    const pengeluaran = cleanNumber(data[i][4]);
    currentBalance = currentBalance + pemasukan - pengeluaran;
    
    data[i][0] = i + 1; // No
    data[i][3] = pemasukan;
    data[i][4] = pengeluaran;
    data[i][5] = currentBalance; // Saldo baru
  }

  // Tulis kembali seluruh data yang sudah bersih & dihitung saldonya
  sheet.getRange(2, 1, numRows, 7).setValues(data);

  // Terapkan format Rp
  sheet.getRange(2, 4, numRows, 3).setNumberFormat(RUPIAH_NUMBER_FORMAT);
  sheet.getRange(2, 4, numRows, 3).setHorizontalAlignment('right');
  sheet.getRange(2, 1, numRows, 2).setHorizontalAlignment('center');
}

/**
 * ------------------------------------------------------------------------------
 * D. SINKRONISASI LENGKAP KE SUPABASE (MIRROR SYNC DENGAN PENGHAPUSAN OTOMATIS)
 * ------------------------------------------------------------------------------
 */

/**
 * MENGIRIM DATA DARI SPREADSHEET KE DATABASE SUPABASE (FULL MIRROR SYNC)
 * Jika baris di Spreadsheet dihapus, baris di web juga akan ikut terhapus.
 */
function syncSheetToSupabase() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  
  // 1. Bersihkan dan hitung ulang saldo
  if (lastRow >= 2) {
    sortTransactionsByDate();
    recalculateRunningBalance();
    formatCurrencyRp();
  }

  const transactionsToInsert = [];

  if (lastRow >= 2) {
    const data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rawDate = row[1];
      const keterangan = row[2];
      const pemasukan = cleanNumber(row[3]);
      const pengeluaran = cleanNumber(row[4]);
      const saldo = cleanNumber(row[5]);
      const pj = row[6];

      if (!rawDate && !keterangan) continue;

      let formattedDate = '';
      if (rawDate instanceof Date) {
        formattedDate = Utilities.formatDate(rawDate, Session.getScriptTimeZone(), "yyyy-MM-dd");
      } else {
        formattedDate = String(rawDate);
      }

      transactionsToInsert.push({
        tanggal: formattedDate,
        keterangan: String(keterangan || ''),
        pemasukan: pemasukan,
        pengeluaran: pengeluaran,
        saldo: saldo,
        pj: String(pj || 'Admin Remusha')
      });
    }
  }

  try {
    // 2. Hapus seluruh data lama di Supabase (agar data yang didelete di Sheet juga terdelete di Web)
    const deleteOptions = {
      method: 'delete',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY
      },
      muteHttpExceptions: true
    };

    // Filter id > 0 untuk menghapus seluruh row di tabel transactions
    UrlFetchApp.fetch(SUPABASE_URL + '/rest/v1/transactions?id=gt.0', deleteOptions);

    // 3. Masukkan data terbaru dari Spreadsheet (jika ada data)
    if (transactionsToInsert.length > 0) {
      const insertOptions = {
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

      const response = UrlFetchApp.fetch(SUPABASE_URL + '/rest/v1/transactions', insertOptions);
      const responseCode = response.getResponseCode();

      if (responseCode >= 200 && responseCode < 300) {
        SpreadsheetApp.getUi().alert('Berhasil Sinkronisasi! 🎉', `Database web telah disinkronkan dengan Google Sheets (${transactionsToInsert.length} data aktif). Baris yang dihapus di sheet kini telah terhapus di web.`, SpreadsheetApp.getUi().ButtonSet.OK);
      } else {
        SpreadsheetApp.getUi().alert('Gagal Mengirim Data', `Status: ${responseCode}\nRespon: ${response.getContentText()}`, SpreadsheetApp.getUi().ButtonSet.OK);
      }
    } else {
      SpreadsheetApp.getUi().alert('Database Dibersihkan', 'Spreadsheet kosong. Seluruh data transaksi di database web telah dikosongkan.', SpreadsheetApp.getUi().ButtonSet.OK);
    }
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error Koneksi', error.toString(), SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * MENARIK DATA DARI SUPABASE KE SPREADSHEET (Urut Tanggal Lama di Atas)
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
        cleanNumber(t.pemasukan),
        cleanNumber(t.pengeluaran),
        cleanNumber(t.saldo),
        t.pj || ''
      ]);
    }

    sheet.getRange(2, 1, rows.length, 7).setValues(rows);
    sheet.getRange(2, 4, rows.length, 3).setNumberFormat(RUPIAH_NUMBER_FORMAT);
    sheet.getRange(2, 4, rows.length, 3).setHorizontalAlignment('right');
    sheet.getRange(2, 1, rows.length, 2).setHorizontalAlignment('center');

    SpreadsheetApp.getUi().alert('Berhasil! 🎉', `Berhasil memuat ${rows.length} transaksi dari database Supabase dengan format Rp.`, SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error', error.toString(), SpreadsheetApp.getUi().ButtonSet.OK);
  }
}
