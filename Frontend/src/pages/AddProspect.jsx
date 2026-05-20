import { useState } from 'react';
import api from '../util/axios';
import AddForm from '../components/AddForm';
import TUNISIA_REGIONS from '../constants/tunisiaRegions';  
import './AddProspect.css'; 

const AddProspect = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    numeroTelephone: '',
    email: '',
    localisationProjet: '',
    detailsProjet: '',
    budgetDisponible: '',
    datePrevueLancement: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/form/add', formData);
      alert('✅ Votre demande a été envoyée avec succès !');
      // Reset form
      setFormData({
        nom: '', prenom: '', numeroTelephone: '', email: '',
        localisationProjet: '', detailsProjet: '', budgetDisponible: '',
        datePrevueLancement: ''
      });
    } catch (error) {
      alert('❌ Erreur lors de l\'envoi de la demande');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-prospect-container">
      <div className="add-prospect-card">
        <div className="form-header">
          <div className="logo">
            <img 
              src="/assets/logo_blanc.png" 
              alt="Logo" 
              className="logo-image"
            />
          </div>
          <div className="header-content">
            <h1>PARLEZ-NOUS DE VOTRE PROJET</h1>
            <p>Recevez des conseils et des solutions adaptées à votre futur projet de construction.</p>
          </div>
        </div>
        <AddForm 
          formData={formData}
          loading={loading}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          regions={TUNISIA_REGIONS}
        />
      </div>
    </div>
  );
};

export default AddProspect;