const mongoose = require("mongoose");
const nodeCron = require("node-cron");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");

const telecallerSchema = require("../schema/telecallerschema");
const adminSchema = require("../schema/Adminschema");
const leadSchema=require("../schema/leadschema")
const superadminDb = mongoose.createConnection(process.env.MONGODB_SUPERADMINURI);
const Admin = superadminDb.model("Admin", adminSchema);
const generatePDF = async (telecaller, history, Lead) => {
    return new Promise(async (resolve, reject) => {
      const reportsDir = "./reports";
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }
  
      const doc = new PDFDocument({ margin: 50 });
      const fileName = `${reportsDir}/${telecaller.username.replace(/[@.]/g, "_")}_${Date.now()}.pdf`;
      const stream = fs.createWriteStream(fileName);
  
      doc.pipe(stream);
  
      // **Add Company Logo (Optional)**
      const logoPath = "./logo.png";
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, { width: 100, align: "center" }).moveDown(1);
      }
  
      // **Report Header**
      doc
        .font("Helvetica-Bold")
        .fontSize(20)
        .text(`Daily Call Report - ${telecaller.username}`, { align: "center" })
        .moveDown();
  
      doc
        .font("Helvetica")
        .fontSize(12)
        .text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" })
        .moveDown(2);
  
      // **Draw a Line Separator**
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(2);
  
      // **Call History Table**
      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .text("Call History", { underline: true })
        .moveDown();
  
      for (const [index, entry] of history.entries()) {
        // Fetch lead details
        const lead = await Lead.findOne({ _id: entry.leadId });
  
        doc
          .font("Helvetica-Bold")
          .text(`Call ${index + 1}:`, { continued: true })
          .font("Helvetica")
          .text(`  (${entry.timestamp.toLocaleString()})`);
  
        if (lead) {
          doc
            .font("Helvetica-Bold")
            .text("Lead Name: ", { continued: true })
            .font("Helvetica")
            .text(lead.name || "N/A");
  
          doc
            .font("Helvetica-Bold")
            .text("Mobile Number: ", { continued: true })
            .font("Helvetica")
            .text(lead.mobilenumber || "N/A");
  
          doc
            .font("Helvetica-Bold")
            .text("Address: ", { continued: true })
            .font("Helvetica")
            .text(lead.address || "N/A");
        }
  
        doc
          .font("Helvetica-Bold")
          .text("Lead ID: ", { continued: true })
          .font("Helvetica")
          .text(entry.leadId);
  
        doc
          .font("Helvetica-Bold")
          .text("Action: ", { continued: true })
          .font("Helvetica")
          .text(entry.action);
  
        if (entry.notes) {
          doc
            .font("Helvetica-Bold")
            .text("Notes: ", { continued: true })
            .font("Helvetica")
            .text(entry.notes);
        }
  
        // **Draw a Line Separator between Entries**
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(2);
      }
  
      doc.end();
      stream.on("finish", () => resolve(fileName));
      stream.on("error", reject);
    });
  };
  
  

const sendEmail = async (adminEmail, filePath, telecallerName) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user:"sabarim6369@gmail.com",
        pass:"uieq qvys aybv ldot",
    },
  });

  let mailOptions = {
    from: "sabarim6369@gmail.com",
    to: adminEmail,
    subject: `Daily Report - ${telecallerName}`,
    text: "Attached is the daily call report.",
    attachments: [{ filename: "DailyReport.pdf", path: filePath }],
  };

  return transporter.sendMail(mailOptions);
};
// nodeCron.schedule("0 22 * * *", async () => {

nodeCron.schedule("* * * * *", async () => {
  console.log("Running Cron Job for Daily Reports");

  try {
    const admins = await Admin.find({});

    for (const admin of admins) {
      const adminDb = mongoose.createConnection(`${process.env.MONGODB_URIFORCRON}/${admin.databaseName}`);
      const Telecaller = adminDb.model("Telecaller", telecallerSchema);
      for (const telecallerData of admin.telecallers) {
        const telecaller = await Telecaller.findOne({ email: telecallerData.email });

        if (telecaller) {
          const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
          const history = telecaller.history.filter(entry =>
            entry.timestamp.toISOString().startsWith(today)
          );

          if (history.length > 0) {
            const Lead = adminDb.model("Lead", leadSchema);
            const pdfPath = await generatePDF(telecaller, history, Lead);
            
            await sendEmail(admin.email, pdfPath, telecaller.username);
            console.log(`Report sent to ${admin.email} for ${telecaller.username}`);
          }
        }
      }

      await adminDb.close();
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
