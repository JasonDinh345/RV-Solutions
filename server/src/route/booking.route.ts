import { Router } from "express";
import { BookingService } from "../service/booking,service.js";
import pool from "../util/db.js";
import { BookingController } from "../controller/booking.controller.js";
const bookingRouter: Router = Router();
const bookingService: BookingService = new BookingService(pool)
const bookingController: BookingController = new BookingController(bookingService)

bookingRouter.get("/RV/:vin", bookingController.getAllBookingToVIN.bind(bookingController))

bookingRouter.get("/account/:accountID", bookingController.getAllBookingsToAccount.bind(bookingController))

bookingRouter.get("/owner/:ownerID", bookingController.getAllBookingsToAccount.bind(bookingController))

bookingRouter.get("/:bookingID", bookingController.getBooking.bind(bookingController))

bookingRouter.post("/", bookingController.insertBooking.bind(bookingController))

bookingRouter.patch("/:bookingID", bookingController.updateBooking.bind(bookingController))

bookingRouter.delete("/:bookingID", bookingController.deleteBooking.bind(bookingController))

export default bookingRouter