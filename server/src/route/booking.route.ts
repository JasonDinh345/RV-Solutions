import { Router } from "express";
import { BookingService } from "../service/booking,service.js";
import pool from "../util/db.js";
import { BookingController } from "../controller/booking.controller.js";
const bookingRouter: Router = Router();
const bookingService: BookingService = new BookingService(pool)
const bookingController: BookingController = new BookingController(bookingService)
/** GET request to get all bookings relating to a RV/VIN */
bookingRouter.get("/RV/:vin", bookingController.getAllBookingToVIN.bind(bookingController))
/** GET request to get all bookings booked by an account */
bookingRouter.get("/account/:accountID", bookingController.getAllBookingsToAccount.bind(bookingController))
/** GET request the table of all bookings booked by an account*/
bookingRouter.get("/account/HTML/:accountID", bookingController.getAllBookingsToAccountHTML.bind(bookingController))
/** GET request to get a booking*/
bookingRouter.get("/:bookingID", bookingController.getBooking.bind(bookingController))
/** POST request to insert booking*/
bookingRouter.post("/", bookingController.insertBooking.bind(bookingController))
/** PATCH request to update booking*/
bookingRouter.patch("/:bookingID", bookingController.updateBooking.bind(bookingController))
/** DELETE request to delete booking*/
bookingRouter.delete("/:bookingID", bookingController.deleteBooking.bind(bookingController))

export default bookingRouter