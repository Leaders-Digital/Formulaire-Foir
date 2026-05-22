import Prospection from '../models/prospection.js';

import {
  buildProspectionEmailContent,
  sendProspectionEmail,
} from "../utils/mailer.js";

//router.post('/form/add', createProspection);
export const createProspection = async (req, res) => {
  try {
    const created = await Prospection.create(req.body);
    
    // Send confirmation email
    try {
      const emailContent = buildProspectionEmailContent({
        nom: created.nom,
        prenom: created.prenom,
        email: created.email,
        numeroTelephone: created.numeroTelephone,
        localisationProjet: created.localisationProjet,
        detailsProjet: created.detailsProjet,
        budgetDisponible: created.budgetDisponible,
        datePrevueLancement: created.datePrevueLancement,
      });
      
      await sendProspectionEmail({
        to: created.email,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
      });
      
      console.log(`📧 Confirmation email sent to ${created.email}`);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the request if email fails
    }
    
    res.status(201).json({
      success: true,
      message: 'Prospection created successfully',
      data: created
    });
  } catch (err) {
    res.status(400).json({
      message: 'Invalid prospection payload',
      error: err?.message,
    });
  }
};

//router.get('/form/list', listProspections);
export const listProspections = async (req, res) => {
  try {
    const items = await Prospection.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch prospections',
      error: err?.message,
    });
  }
};

// router.get('/stats', getProspectionStats);
export const getProspectionStats = async (req, res) => {
  try {
    const items = await Prospection.find();
    
    // Calculate distinct regions
    const distinctRegions = [...new Set(items.map(item => item.localisationProjet))];
    const regionsCount = distinctRegions.length;
    
    // Get last submission date
    const lastSubmission = items.length > 0 
      ? new Date(Math.max(...items.map(item => new Date(item.createdAt))))
      : null;
    
    res.json({
      totalVisitors: items.length,
      distinctRegions: regionsCount,
      lastSubmission: lastSubmission,
      regionsList: distinctRegions  
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch statistics',
      error: err?.message,
    });
  }
};