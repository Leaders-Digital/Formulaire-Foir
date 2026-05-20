import Prospection from '../models/prospection.js';
import { buildProspectionEmailContent, sendProspectionEmail } from '../utils/mailer.js';

//router.post('/form/add', createProspection);
export const createProspection = async (req, res) => {
  try {
    const created = await Prospection.create(req.body);

    // Send email to the user who submitted the form
    const emailPayload = buildProspectionEmailContent(created);

    try {
      await sendProspectionEmail({
        to: created.email,
        ...emailPayload,
      });
    } catch (mailErr) {
      // Do not block prospection creation if email fails
      console.error('Failed to send prospection email:', mailErr);
      return res.status(201).json({
        ...created.toObject?.() ?? created,
        warning: 'Prospection created, but email could not be sent.',
      });
    }

    res.status(201).json(created);
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
    const items = await Prospection.find().sort({ createdAt: -1 }).limit(100);
    res.json(items);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch prospections',
      error: err?.message,
    });
  }
};

// backend/controllers/prospectionController.js
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