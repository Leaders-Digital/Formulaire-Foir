//Backend\models\prospection.js
import mongoose from 'mongoose';

const TUNISIA_REGIONS = {
  TUNIS: 'Tunis',
  ARIANA: 'Ariana',
  BEN_AROUS: 'Ben Arous',
  MANOUBA: 'Manouba',
  NABEUL: 'Nabeul',
  ZAGHOUAN: 'Zaghouan',
  BIZERTE: 'Bizerte',
  BEJA: 'Béja',
  JENDOUBA: 'Jendouba',
  LE_KEF: 'Le Kef',
  SILIANA: 'Siliana',
  SOUSSE: 'Sousse',
  MONASTIR: 'Monastir',
  MAHDIA: 'Mahdia',
  SFAX: 'Sfax',
  KAIROUAN: 'Kairouan',
  KASSERINE: 'Kasserine',
  SIDI_BOUZID: 'Sidi Bouzid',
  GABES: 'Gabès',
  MEDENINE: 'Médenine',
  TATAOUINE: 'Tataouine',
  GAFSA: 'Gafsa',
  TOZEUR: 'Tozeur',
  KEBILIA: 'Kebilia'
};
const regionValues = Object.values(TUNISIA_REGIONS);


const prospectionSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    prenom: {
      type: String,
      required: true,
      trim: true,
    },
    numeroTelephone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    localisationProjet: {
      type: String,
      required: true,
      enum: regionValues, // Restricts to predefined regions
      trim: true,
    },
    detailsProjet: {
      type: String,
      required: true,
      trim: true,
    },
    budgetDisponible: {
      type: Number,
      required: true,
      min: 0,
    },
    datePrevueLancement: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'prospections',
  }
);

// Export the regions array for use in frontend
export const regions = regionValues;
export default mongoose.model('Prospection', prospectionSchema);