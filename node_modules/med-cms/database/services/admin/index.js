const path = require("path");
const createClinic = require(path.join(__dirname, "create-clinic"));
const manageStaff = require(path.join(__dirname, "manage-staff"));
const dbAnalytics = require(path.join(__dirname, "db-analytics"));
const AdminService = {
  createClinic: createClinic.create,
  getAllClinics: createClinic.getAll,
  createStaffAccount: manageStaff.createAccount,
  deleteAccount: manageStaff.deleteAccount,
  getSystemStats: dbAnalytics.getStats,
};
module.exports = AdminService;
