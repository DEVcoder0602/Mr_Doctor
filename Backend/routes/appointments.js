const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Appointment = require('../models/Appointment');
const { body, validationResult } = require('express-validator');
// ROUTE 1: Get All the Appointments using: GET "/api/appointments/getuser". Login required
router.get('/fetchallappointments', fetchuser, async (req, res) => {
    try {
        const appointments = await Appointment.find({ user: req.user.id });
        res.json(appointments)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE 2: Add a new Appointment using: POST "/api/appointments/addappointment". Login required
router.post('/addappointment', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),], async (req, res) => {
        try {

            const { title, description, tag } = req.body;

            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const appointment = new Appointment({
                title, description, tag, user: req.user.id
            })
            const savedAppointment = await appointment.save()

            res.json(savedAppointment)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }

        // ROUTE 3: Update an existing Appointment using: PUT "/api/appointments/updateappointment". Login required
router.put('/updateappointment/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // Create a newAppointment object
        const newAppointment = {};
        if (title) { newAppointment.title = title };
        if (description) { newAppointment.description = description };
        if (tag) { newAppointment.tag = tag };

    // Find the appointment to be updated and update it
    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) { return res.status(404).send("Not Found") }


    if (appointment.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }
    appointment = await Appointment.findByIdAndUpdate(req.params.id, { $set: newAppointment }, { new: true })
    res.json({ appointment });
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
})

// ROUTE 4: Delete an existing Appointment using: DELETE "/api/appointments/deleteappointment". Login required
router.delete('/deleteappointment/:id', fetchuser, async (req, res) => {
    try {
        // Find the appointment to be delete and delete it
        let appointment = await Appointment.findById(req.params.id);
        if (!appointment) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this Appointment
        if (appointment.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        appointment = await Appointment.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Appointment has been deleted", appointment: appointment });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
  
    })

module.exports = router 