import express from "express";
import {
  deleteAppointment,
  getAllAppointments,
  postAppointment,
  updateAppointmentStatus,
} from "../controller/appointmentController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middleware/auth.js";

const routerAppointment = express.Router();

routerAppointment.post("/post",isPatientAuthenticated,postAppointment);
routerAppointment.get("/getall", isAdminAuthenticated, getAllAppointments);
routerAppointment.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);
routerAppointment.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);

export default routerAppointment;