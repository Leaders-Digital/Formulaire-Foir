import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../util/axios';
import './ListProspects.css';

const ListProspects = () => {
  const [prospections, setProspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  
  const [hoveredRow, setHoveredRow] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
      const res = await api.get('/form/list');
      const items = res.data.data || res.data;
      
      setProspections(items);
      
      const distinctRegions = [...new Set(items.map(item => item.localisationProjet))];
      const lastSubmission = items.length > 0 ? items[0].createdAt : null;

      setStats({
        totalVisitors: items.length,
        distinctRegions: distinctRegions.length,
        lastSubmission: lastSubmission
      });
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatFrenchDate = (dateString) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatFrenchDateTime = (dateString) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredProspections = useMemo(() => {
    let result = [...prospections];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.nom?.toLowerCase().includes(term) ||
        item.prenom?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term) ||
        item.numeroTelephone?.includes(term)  ||
        item.detailsProjet?.includes(term)
      );
    }

    if (selectedRegion) {
      result = result.filter(item => item.localisationProjet === selectedRegion);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      result = result.filter(item => {
        const itemDate = new Date(item.createdAt);
        itemDate.setHours(0, 0, 0, 0);

        if (dateFilter === 'today') return itemDate.getTime() === now.getTime();
        if (dateFilter === 'lastWeek') {
          const lastWeek = new Date(now);
          lastWeek.setDate(lastWeek.getDate() - 7);
          return itemDate >= lastWeek && itemDate <= now;
        }
        if (dateFilter === 'lastMonth') {
          const lastMonth = new Date(now);
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          return itemDate >= lastMonth && itemDate <= now;
        }
        return true;
      });
    }

    return result;
  }, [prospections, searchTerm, selectedRegion, dateFilter]);

  // Track mouse position
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX + 15, y: e.clientY + 15 });
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <div>
          <h1>LISTE DES VISITEURS</h1>
        </div>
        <button className="return-btn" onClick={() => navigate('/formulaire')}>
          <i className="fas fa-arrow-left"></i>
          <span>RETOUR</span>
        </button>
      </div>

      <div className="themed-divider">
        <div className="divider-line"></div>
      </div>

      {/* Stats */}
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
          <h3>{stats.lastSubmission ? formatFrenchDate(stats.lastSubmission) : 'Aucune'}</h3>
          <p>Dernière Soumission</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        {/* Search */}
        <div className="search-wrapper">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            className="filter-input"
            placeholder="Rechercher par nom, prénom, email, téléphone."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Region Select */}
        <div className="select-wrapper">
          <i className="fas fa-map-marker-alt select-icon"></i>
          <select 
            className="filter-select"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >          
            <option value="" hidden>Filtrer par Région</option>
            <option value="">Toutes les régions</option>
            {[...new Set(prospections.map(p => p.localisationProjet))].map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* Date Filter Select */}
        <div className="select-wrapper">
          <i className="fas fa-filter select-icon"></i>
          <select 
            className="filter-select date-filter-select"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all" hidden>Filtrer par Date</option>
            <option value="all">Toutes les périodes</option>
            <option value="today">Ce jour</option>
            <option value="lastWeek">Dernière semaine</option>
            <option value="lastMonth">Le mois passé</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="empty-state-container">Chargement...</div>
      ) : filteredProspections.length === 0 ? (
        <div className="empty-state-container">
          <i className="fas fa-search"></i>
          <p>Aucun résultat trouvé</p>
        </div>
      ) : (
        <div className="table-container" onMouseMove={handleMouseMove}>
          <table className="prospects-table">
            <thead>
              <tr>
                <th><i className="fas fa-user"></i> NOM & PRÉNOM</th>
                <th><i className="fas fa-phone"></i> TÉLÉPHONE</th>
                <th><i className="fas fa-envelope"></i> EMAIL</th>
                <th><i className="fas fa-map-marker-alt"></i> LOCALISATION</th>
                <th><i className="fas fa-money-bill-wave"></i> BUDGET</th>
                <th><i className="fas fa-clock"></i> SOUMIS LE</th>
                <th><i className="fas fa-calendar-alt"></i> DATE DE LANCEMENT</th>
              </tr>
            </thead>
            <tbody>
              {filteredProspections.map((item) => (
                <tr 
                  key={item._id}
                  onMouseEnter={() => setHoveredRow(item)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className="prospect-row"
                >
                  <td className="name-cell"><strong>{item.nom} {item.prenom}</strong></td>
                  <td>{item.numeroTelephone}</td>
                  <td>{item.email}</td>
                  <td>{item.localisationProjet}</td>
                  <td>{item.budgetDisponible.toLocaleString()} TND</td>
                  <td>{formatFrenchDateTime(item.createdAt)}</td>
                  <td>{formatFrenchDate(item.datePrevueLancement)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Hover Details Card - Follows Mouse */}
          {hoveredRow && (
            <div 
              className="details-hover-card"
              style={{
                left: `${mousePosition.x}px`,
                top: `${mousePosition.y}px`,
              }}
            >
              <h4>Détails du Projet</h4>
              <p>{hoveredRow.detailsProjet || "Aucun détail fourni."}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListProspects;