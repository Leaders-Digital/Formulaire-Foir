import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS.trim(),
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export async function sendProspectionEmail({ to, subject, text, html }) {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"Building Team" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
}

export function buildProspectionEmailContent({
  nom,
  prenom,
  localisationProjet,
  detailsProjet,
  budgetDisponible,
  datePrevueLancement,
}) {
  const fullName = `${prenom || ""} ${nom || ""}`.trim();

  const subject = "Confirmation de votre demande - Building";

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de votre demande</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f8f9fa; font-family: 'Rubik', Arial, sans-serif;">
      <table width="100%" max-width="1000px" cellpadding="0" cellspacing="0" style="background-color:#f8f9fa; padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:white; border-radius:20px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: #1A1C20; padding: 40px 30px; text-align:center;">
                  <h1 style="color:#C9A960; font-family:'Teko', Arial, sans-serif; font-size:42px; margin:0; letter-spacing:2px;">
                    Confirmation de votre demande
                  </h1>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding:40px 40px 30px;"> 
                  <p style="font-size:17px; color:#333; line-height:1.6;">
                    Bonjour <strong>${fullName}</strong>,
                  </p>
                  <p style="font-size:17px; color:#333; line-height:1.6;">
                    Nous avons bien reçu votre demande de prospection. Merci pour votre confiance.
                  </p>

                  <div style="background:#f8f9fa; padding:25px; border-radius:12px; margin:25px 0;">
                    <h3 style="color:#C9A960; margin:0 0 15px 0; font-size:20px;">Détails de votre projet</h3>
                    
                    <p style="margin:12px 0;">
                      <strong style="color:#444;">Localisation :</strong> ${localisationProjet || "Non spécifiée"}
                    </p>
                    <p style="margin:12px 0;">
                      <strong style="color:#444;">Budget :</strong> ${budgetDisponible ? budgetDisponible.toLocaleString() + " TND" : "Non spécifié"}
                    </p>
                    <p style="margin:12px 0;">
                      <strong style="color:#444;">Date prévue de lancement :</strong> ${
                        datePrevueLancement
                          ? new Date(datePrevueLancement).toLocaleDateString("fr-FR")
                          : "Non spécifiée"
                      }
                    </p>
                  </div>

                  <div style="margin:25px 0;">
                    <strong style="color:#444;">Détails du projet :</strong><br>
                    <p style="background:#f8f9fa; padding:20px; border-radius:10px; white-space:pre-wrap; line-height:1.6;">
                      ${detailsProjet || "Aucun détail fourni."}
                    </p>
                  </div>

                  <hr style="border:1px solid #eee; margin:30px 0;">

                  <p style="text-align:center; color:#555; font-size:16px;">
                    Nous vous contacterons bientôt pour discuter des prochaines étapes.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#1A1C20; color:#ddd; text-align:center; padding:30px;">
                  <p style="margin:0 0 10px 0; font-size:16px;">
                    <strong>Équipe Building</strong>
                  </p>
                  <p style="margin:0; font-size:14px; opacity:0.8;">
                    Merci pour votre confiance • Nous construisons vos rêves
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
Bonjour ${fullName},

Nous avons bien reçu votre demande de prospection.

Localisation : ${localisationProjet || "Non spécifiée"}
Budget : ${budgetDisponible ? budgetDisponible.toLocaleString() + " TND" : "Non spécifié"}
Date prévue : ${datePrevueLancement ? new Date(datePrevueLancement).toLocaleDateString("fr-FR") : "Non spécifiée"}

Détails : ${detailsProjet || "Aucun détail fourni."}

Nous vous contacterons bientôt.

Merci pour votre confiance.
Équipe Building
  `;

  return { subject, text, html };
}