const ExcelJS = require("exceljs");
class ExcelExport {
  constructor() {
    this.workbook = new ExcelJS.Workbook();
    this.worksheet = this.workbook.addWorksheet("Sheet 1");
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

  async saveToFile(filename) {
    await this.workbook.xlsx.writeFile(filename);
  }
}

module.exports = ExcelExport;
