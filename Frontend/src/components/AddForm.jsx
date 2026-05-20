import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faPhone, 
  faEnvelope, 
  faLocationDot, 
  faFileAlt, 
  faMoneyBillWave, 
  faCalendarAlt,
  faPaperPlane,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const AddForm = ({ formData, loading, handleChange, handleSubmit, regions }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredRegions, setFilteredRegions] = useState(regions);
  const [searchTerm, setSearchTerm] = useState(formData.localisationProjet || '');
  const inputRef = useRef(null);

  // Sync searchTerm when formData.localisationProjet changes (e.g., when form is reset)
  useEffect(() => {
    setSearchTerm(formData.localisationProjet || '');
  }, [formData.localisationProjet]);

  // Filter regions as user types
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRegions(regions);
    } else {
      const filtered = regions.filter(region =>
        region.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRegions(filtered);
    }
  }, [searchTerm, regions]);

  const handleRegionChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleChange({
      target: { name: 'localisationProjet', value }
    });
    setShowDropdown(true);
  };

  const selectRegion = (region) => {
    setSearchTerm(region);
    handleChange({
      target: { name: 'localisationProjet', value: region }
    });
    setShowDropdown(false);
  };

  const clearRegion = () => {
    setSearchTerm('');
    handleChange({
      target: { name: 'localisationProjet', value: '' }
    });
    inputRef.current?.querySelector('input')?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <form onSubmit={handleSubmit} className="prospect-form">
      <div className="form-row">
        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faUser} className="form-icon" />
            Nom
          </label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
            placeholder="Votre nom"
          />
        </div>
        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faUser} className="form-icon" />
            Prénom
          </label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
            placeholder="Votre prénom"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faPhone} className="form-icon" />
            Numéro de téléphone
          </label>
          <input
            type="tel"
            name="numeroTelephone"
            value={formData.numeroTelephone}
            onChange={handleChange}
            required
            placeholder="Ex: 98 123 456"
          />
        </div>
        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faEnvelope} className="form-icon" />
            Adresse e-mail
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="votre@email.com"
          />
        </div>
      </div>

      <div className="form-group">
        <label>
          <FontAwesomeIcon icon={faLocationDot} className="form-icon" />
          Localisation du projet
        </label>
        
        <div className="region-search-wrapper" ref={inputRef}>
          <div className="input-with-clear">
            <input
              type="text"
              name="localisationProjet"
              value={searchTerm}
              onChange={handleRegionChange}
              onFocus={() => setShowDropdown(true)}
              required
              placeholder="Tapez pour chercher une région..."
              autoComplete="off"
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-region-btn"
                onClick={clearRegion}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>

          {/* Dropdown Suggestions */}
          {showDropdown && (
            filteredRegions.length > 0 ? (
              <ul className="region-dropdown">
                {filteredRegions.map((region, index) => (
                  <li
                    key={index}
                    onClick={() => selectRegion(region)}
                    className="region-option"
                  >
                    <FontAwesomeIcon icon={faLocationDot} className="region-icon" />
                    {region}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="region-dropdown">
                <li className="region-option no-results">
                  Aucune région trouvée
                </li>
              </ul>
            )
          )}
        </div>
      </div>

      <div className="form-group">
        <label>
          <FontAwesomeIcon icon={faFileAlt} className="form-icon" />
          Détails du projet
        </label>
        <textarea
          name="detailsProjet"
          value={formData.detailsProjet}
          onChange={handleChange}
          required
          rows="4"
          placeholder="Décrivez votre projet : type de construction, surface, spécificités..."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faMoneyBillWave} className="form-icon" />
            Budget disponible (TND)
          </label>
          <input
            type="number"
            name="budgetDisponible"
            value={formData.budgetDisponible}
            onChange={handleChange}
            required
            placeholder="45000"
          />
        </div>
        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faCalendarAlt} className="form-icon" />
            Date prévue de lancement
          </label>
          <input
            type="date"
            name="datePrevueLancement"
            value={formData.datePrevueLancement}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Envoi en cours...' : 'Envoyer Ma Demande'}
        <FontAwesomeIcon icon={faPaperPlane} className="btn-icon" />
      </button>
    </form>
  );
};

export default AddForm;