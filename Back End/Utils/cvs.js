const ExcelJS = require("exceljs");

class ExcelExport {
  constructor(filename, workSheet) {
    this.workbook = new ExcelJS.Workbook();
    this.worksheet = this.workbook.addWorksheet(workSheet);
    this.filename = filename + ".xlsx";
  }
  addHeaders(headers) {
    this.worksheet.columns = headers.map((header) => ({
      header,
      key: header,
      width: 20,
    }));
  }
  addData(data) {
    data.forEach((rowData) => {
      this.worksheet.addRow(rowData);
    });
  }

  async saveToFile() {
    await this.workbook.xlsx.writeFile(this.filename);
  }
}

module.exports = ExcelExport;
