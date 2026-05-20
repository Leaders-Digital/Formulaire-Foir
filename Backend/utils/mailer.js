import nodemailer from 'nodemailer';

export async function sendProspectionEmail({ to, subject, text, html }) {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    MAIL_FROM,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !MAIL_FROM) {
    throw new Error('Missing SMTP configuration. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM in Backend/.env');
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // common convention
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const mailOptions = {
    from: MAIL_FROM,
    to,
    subject: subject || 'Demande reçue',
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
}

export function buildProspectionEmailContent({ nom, prenom, localisationProjet, detailsProjet, budgetDisponible, datePrevueLancement }) {
  const fullName = [prenom, nom].filter(Boolean).join(' ').trim();
  const budgetStr = budgetDisponible !== undefined && budgetDisponible !== null ? `${budgetDisponible} TND` : '';
  const launchDate = datePrevueLancement ? new Date(datePrevueLancement).toLocaleDateString('fr-TN') : '';

  const subject = 'Votre demande a été envoyée avec succès';

  const text = [
    `Bonjour ${fullName || ''},`,
    '',
    `Nous avons bien reçu votre demande de prospection.`,
    '',
    `Région / Projet: ${localisationProjet || ''}`,
    `Détails: ${detailsProjet || ''}`,
    `Budget disponible: ${budgetStr}`,
    `Date prévue de lancement: ${launchDate}`,
    '',
    'Cordialement,',
    'Équipe Building',
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif;">
      <p>Bonjour <strong>${fullName || ''}</strong>,</p>
      <p>Nous avons bien reçu votre demande de prospection.</p>
      <hr/>
      <p><strong>Région / Projet:</strong> ${localisationProjet || ''}</p>
      <p><strong>Détails:</strong> ${detailsProjet || ''}</p>
      <p><strong>Budget disponible:</strong> ${budgetStr}</p>
      <p><strong>Date prévue de lancement:</strong> ${launchDate}</p>
      <hr/>
      <p>Cordialement,<br/>Équipe Building</p>
    </div>
  `;

  return { subject, text, html };
}

