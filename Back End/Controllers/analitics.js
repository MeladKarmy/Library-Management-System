const borrowBooks = require("../Models/borowBook");
const ErrorHandling = require("../Utils/errorHandling");
const asyncHandaler = require("../Utils/handelasync");

const ExcelExport = require("../Utils/cvs");
exports.ANALITICS = asyncHandaler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  const analyticalData = await borrowBooks.aggregate([
    {
      $match: {
        checkoutDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
      },
    },
    // Add more stages for specific analytics based on your requirements
  ]);

  if (analyticalData.length === 0) {
    throw new Error("No analytical data found for the specified period!");
  }

  const excelExport = new ExcelExport();
  const headers = Object.keys(analyticalData[0]);
  excelExport.addHeaders(headers);
  excelExport.addData(analyticalData);

  const filename = "analytical_report.xlsx";
  await excelExport.saveToFile(filename);

  // Send the file as a response
  res.attachment(filename).sendFile(filename);
});
