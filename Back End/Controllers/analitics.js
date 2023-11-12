const borrowBooks = require("../Models/borowBook");
const ErrorHandling = require("../Utils/errorHandling");
const asyncHandaler = require("../Utils/handelasync");

const ExcelExport = require("../Utils/cvs");
exports.analyticalDataBorrowingBooks = asyncHandaler(async (req, res, next) => {
  let { filename, workSheet, startDate, endDate, coulamAnalitics } = req.body;
  const analyticalData = await borrowBooks
    .aggregate([
      {
        $match: {
          [coulamAnalitics]: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "ISBN",
          foreignField: "ISBN",
          as: "ISBN",
        },
      },
    ])
    .exec();
  if (analyticalData.length === 0) {
    let err = new ErrorHandling(
      "No analytical data found for the specified period!",
      404
    );
    return next(err);
  }

  const excelExport = new ExcelExport(filename, workSheet);
  const headers = Object.keys(analyticalData[0]);
  excelExport.addHeaders(headers);
  excelExport.addData(analyticalData);
  await excelExport.saveToFile();

  res.attachment(filename).json({
    status: "success",
    data: {
      filename,
      workSheet,
    },
  });
});
