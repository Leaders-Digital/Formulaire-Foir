import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../util/axios';
import './ListProspects.css';

const ListProspects = () => {
  const [prospections, setProspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVisitors: 0,
    distinctRegions: 0,
    lastSubmission: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch both prospects and stats in parallel
      const [prospectsRes, statsRes] = await Promise.all([
        api.get('/form/list'),
        api.get('/form/stats')
      ]);
      
      setProspections(prospectsRes.data.data || prospectsRes.data);
      setStats(statsRes.data);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      
      // Fallback: Calculate stats from prospects data if stats endpoint fails
      try {
        const prospectsRes = await api.get('/form/list');
        const items = prospectsRes.data.data || prospectsRes.data;
        setProspections(items);
        
        // Calculate stats locally
        const distinctRegions = [...new Set(items.map(item => item.localisationProjet))];
        const lastSubmission = items.length > 0 ? items[0].createdAt : null;
        
        setStats({
          totalVisitors: items.length,
          distinctRegions: distinctRegions.length,
          lastSubmission: lastSubmission
        });
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Aucune soumission';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="list-container">
      {/* Header */}
      <div className="list-header">
        <div>
          <h1>LISTE DES VISITEURS</h1>
        </div>
        <button className="return-btn" onClick={() => navigate('/formulaire')}>
          <i className="fas fa-arrow-left"></i> RETOUR
        </button>
      </div>
      
      {/* Themed colored divider */}
      <div className="themed-divider">
        <div className="divider-line"></div>
      </div>

      {/* Stats Cards - Now with real data */}
      <div className="stats-row">
        <div className="stat-card">
          <h3>{stats.totalVisitors}</h3>
          <p>Total Visiteurs</p>
        </div>
        <div className="stat-card">
          <h3>{stats.distinctRegions}</h3>
          <p>Régions</p>
        </div>
        <div className="stat-card">
          <h3>{formatDate(stats.lastSubmission)}</h3>
          <p>Dernière Soumission</p>
        </div>
      </div>

      {/* Table or Empty State */}
      {loading ? (
        <div className="empty-state-container">
          <div className="empty-state-card">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Chargement des données...</p>
          </div>
        </div>
      ) : prospections.length === 0 ? (
        <div className="empty-state-container">
          <div className="empty-state-card">
            <i className="fas fa-folder-open"></i>
            <p>Aucune donnée trouvée</p>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="prospects-table">
            <thead>
              <tr>
                <th><i className="fas fa-user"></i> NOM & PRÉNOM</th>
                <th><i className="fas fa-phone"></i> TÉLÉPHONE</th>
                <th><i className="fas fa-envelope"></i> EMAIL</th>
                <th><i className="fas fa-map-marker-alt"></i> LOCALISATION</th>
                <th><i className="fas fa-money-bill-wave"></i> BUDGET</th>
                <th><i className="fas fa-calendar-alt"></i> LANCEMENT</th>
                <th><i className="fas fa-clock"></i> SOUMIS LE</th>
              </tr>
            </thead>
            <tbody>
              {prospections.map((item) => (
                <tr key={item._id}>
                  <td className="name-cell"><strong>{item.nom} {item.prenom}</strong></td>
                  <td>{item.numeroTelephone}</td>
                  <td>{item.email}</td>
                  <td>{item.localisationProjet}</td>
                  <td>{item.budgetDisponible.toLocaleString()} TND</td>
                  <td>{new Date(item.datePrevueLancement).toLocaleDateString('fr-FR')}</td>
                  <td>{new Date(item.createdAt).toLocaleString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListProspects;