const path = require("path");
const calcDistrict = require(path.join(__dirname, "calc-district"));
const getProfile = require(path.join(__dirname, "get-profile"));
const bookAppointment = require(path.join(__dirname, "book-appointment"));
const PatientService = {
  savePatientAddress: calcDistrict.saveAddress.bind(calcDistrict),
  getFullMyData: getProfile.getFullData,
  bookAppointment: bookAppointment.create.bind(bookAppointment),
};
module.exports = PatientService;
