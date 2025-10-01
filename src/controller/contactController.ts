import { Request, Response } from "express";
import dotenv from "dotenv";
import { Contact } from "../models/contactModel"; 
import mailerSender from "../utils/sendEmail"; 

dotenv.config();

export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ message: "Name, email, and message are required." });
      return;
    }

    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await mailerSender(
        adminEmail,
        "New Contact Message Received",
        `<h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>`
      );
    }
    await mailerSender(
      email,
      "Thank you for contacting us",
      `<h3>Hello ${name},</h3>
       <p>Thank you for reaching out! We have received your message and will get back to you shortly.</p>
       <p><strong>Your Message:</strong></p>
       <p>${message}</p>
       <p>Best regards,<br/>Angelique</p>`
    );

    res.status(201).json({ message: "Contact message received and reply sent successfully." });
  } catch (error: any) {
    console.error("Error creating contact:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};