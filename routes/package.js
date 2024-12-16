const express = require("express");
const mongoose = require("mongoose");

const router = new express.Router();
const formData = require("../schemas/package");
const booking = require("../schemas/booking");

const easyinvoice = require("easyinvoice");

router.post("/package", async (req, res) => {
  const { place, price, desc, file, location, from, to } = req.body;
  console.log(req.body);

  try {
    const newUser = new formData({
      place,
      price,
      desc,
      image: file,
      location,
      from,
      to,
    });

    const storeData = await newUser.save();
    res.status(201).json({ status: 201, data: storeData });
  } catch (error) {
    console.error(error); // Log unexpected errors
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});
router.patch("/update", async (req, res) => {
  const { id, place, price, desc, file, location, from, to } = req.body;
  console.log(req.body);
  try {
    // Update the document
    const updatedData = await formData.findByIdAndUpdate(
      id,
      { $set: { place, price, desc, image: file, location, from, to } },
      { new: true, runValidators: true }
    );

    res.status(200).json({ status: 200, data: updatedData });
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

router.post("/getData", async (req, res) => {
  try {
    const newUser = await formData.find({});

    res.status(201).json({ status: 201, data: newUser });
  } catch (error) {
    console.error(error); // Log unexpected errors
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

router.post("/getData1", async (req, res) => {
  try {
    const newUser = await booking.find({});

    res.status(201).json({ status: 201, data: newUser });
  } catch (error) {
    console.error(error); // Log unexpected errors
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});


router.post("/checkBooking", async (req, res) => {
  const { clientId } = req.body;
  
  try {
    const booking1 = await booking.findOne({ clientId });
    if (booking1) {
      res.status(200).json({ isBooked: true });  // ClientId exists, already booked
    } else {
      res.status(200).json({ isBooked: false });  // ClientId does not exist
    }
  } catch (error) {
    console.error("Error checking booking:", error);
    res.status(500).json({ error: "Server error." });
  }
});


router.post("/bookNow", async (req, res) => {
  const { clientId } = req.body;

  try {
    const booking = await booking.findOne({ clientId });
    if (!booking) {
      await booking.create({ clientId });  // Create a new booking if not exists
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false, message: "Already booked." });
    }
  } catch (error) {
    console.error("Error booking:", error);
    res.status(500).json({ error: "Server error." });
  }
});



router.delete("/delPackage", async (req, res) => {
  const { elem } = req.body;
  const id = elem._id;
  try {
    const newUser = await formData.findByIdAndDelete(id);
    res.status(201).json({ status: 201, data: newUser });
  } catch (error) {
    console.error(error); // Log unexpected errors
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

router.post("/generate-invoice", async (req, res) => {
  const { person, email, name, mobile, travelDate, destination,clientId, tripData } =
    req.body;

  const place = tripData?.place; // Optional chaining to avoid errors if tripData is undefined
  const location = tripData?.location;
  const id = tripData?._id;
  const price = tripData?.price;
  const from = tripData?.from;
  const to = tripData?.to;

  console.log("Request Body:", req.body); // Debug request body

  try {
    const data = {
      documentTitle: "INVOICE",
      currency: "USD",
      taxNotation: "vat",
      marginTop: 25,
      marginRight: 25,
      marginLeft: 25,
      marginBottom: 25,
      sender: {
        company: "TOURLY",
        address: "Marvious, Main Street",
        zip: "12345",
        city: "Maldives",
        country: "India",
      },
      client: {
        company: `Name: ${String(name || "N/A")}`,
        address: `Mobile: ${String(mobile || "N/A")}`,
        zip: `Travelers: ${String(person || "0")}`,
      },
      invoiceNumber: "123",
      invoiceDate: new Date(Date.now()).toISOString().split("T")[0],

      // Custom details in the "products" array
      products: [
        {
          quantity: person, // Set a default quantity for simplicity
          description: `${place} - ${location}`, // Combine place and location
          price: price || 0, // Total price from tripData
          from: { from } || "N/A", // Include "from" in the product details
          to: to || "N/A", // Include "to" in the product details
        },
      ],

      bottomNotice: "Thank you, Happy Travelling!",

      // Custom layout
      customize: `
        .header {
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .details-section {
          margin: 20px 0;
        }
        .client-info {
          margin: 20px 0;
        }
      `,

      // Overwriting default template content
      translate: {
        total: "Total Amount",
        products: "Place", // Custom header for the "Place" column
        quantity: "Travelers", // Custom header for the "Location" column
        price: "Total", // Custom header for the "Total" column
        from: "From", // New field for the "From" column
        to: "To", // New field for the "To" column
      },
    };

    const result = await easyinvoice.createInvoice(data);

    const invoice = new booking({
      Name: name,
      email,
      number: mobile,
      travelers: person,
      clientId,
      place,
      location,
      userId: id,
    });

    await invoice.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=invoice-123.pdf"
    );
    res.send(Buffer.from(result.pdf, "base64"));
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).send("Error generating invoice");
  }
});

module.exports = router;
