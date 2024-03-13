import { Reports } from "../models/report.js";

export const sendReport = async (req, res) => {
  const reportId = req.query.id;
  console.log("Backend" + reportId);
  try {
    const report = await Reports.findById(reportId);
    if (report) {
      res.status(200).send({
        success: true,
        report,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error fetching report from DB",
    });
  }
};
