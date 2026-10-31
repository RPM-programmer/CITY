const path = require("path");
const getSchedule = require(path.join(__dirname, "get-schedule"));
const patientAccess = require(path.join(__dirname, "patient-access"));
const conductExam = require(path.join(__dirname, "conduct-exam"));
const DoctorService = {
  getMySchedule: getSchedule.byDoctorId,
  getPatientHistory: patientAccess.getHistory,
  saveExamination: conductExam.saveResult,
};
module.exports = DoctorService;
