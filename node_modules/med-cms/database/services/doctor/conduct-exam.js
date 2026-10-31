const path = require("path");
const dbConfig = require(
  path.join(__dirname, "..", "..", "config", "db-init.js"),
);

const conductExam = {
  async saveResult(examData) {
    const { appointmentId, complaints, objectively, doctorNotes, diseaseId } =
      examData;

    const Appointment = dbConfig.models.Appointment || dbConfig.Appointment;
    const Disease = dbConfig.models.Disease || dbConfig.Disease;

    if (!appointmentId) throw new Error("ID приема обязателен");

    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) throw new Error("Прием не найден");
    if (appointment.status === "завершен")
      throw new Error("Прием уже завершен");

    appointment.complaints = complaints;
    appointment.objectively = objectively;
    appointment.doctorNotes = doctorNotes;
    appointment.status = "завершен";

    if (diseaseId) {
      const disease = await Disease.findByPk(diseaseId);
      if (!disease) throw new Error("Болезнь не найдена в справочнике");

      appointment.DiseaseId = diseaseId;
      await disease.increment("casesCount", { by: 1 });
    }

    await appointment.save();
    return appointment;
  },
};

module.exports = conductExam;
