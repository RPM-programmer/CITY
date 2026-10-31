const path = require("path");
const dbConfig = require(
  path.join(__dirname, "..", "..", "config", "db-init.js"),
);

const bookAppointment = {
  /**
   * Записать пациента к врачу на свободное время
   */
  async create(patientId, appointmentData) {
    const { doctorId, date, time } = appointmentData;

    const Appointment = dbConfig.models.Appointment || dbConfig.Appointment;
    const User = dbConfig.models.User || dbConfig.User;

    if (!doctorId || !date || !time) {
      throw new Error("Необходимо выбрать врача, дату и время приема");
    }

    const doctor = await User.findOne({
      where: { id: doctorId, role: "doctor" },
    });
    if (!doctor) {
      throw new Error(
        "Указанный сотрудник не найден или не имеет прав на прием",
      );
    }

    const isSlotBusy = await Appointment.findOne({
      where: {
        DoctorId: doctorId,
        date: date,
        time: time,
        status: "ожидается",
      },
    });

    if (isSlotBusy) {
      throw new Error(`Время ${time} на дату ${date} уже занято.`);
    }

    const isPatientDoubleBooked = await Appointment.findOne({
      where: {
        PatientId: patientId,
        DoctorId: doctorId,
        date: date,
        status: "ожидается",
      },
    });

    if (isPatientDoubleBooked) {
      throw new Error(`Вы уже записаны к этому специалисту на выбранную дату.`);
    }

    return await Appointment.create({
      date,
      time,
      status: "ожидается",
      PatientId: Number(patientId),
      DoctorId: Number(doctorId),
    });
  },
};

module.exports = bookAppointment;
