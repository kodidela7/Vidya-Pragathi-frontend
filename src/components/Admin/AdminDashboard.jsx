import React, { useState, useEffect } from 'react';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard({ token, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('jobs'); // 'jobs' | 'graduates'
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Graduate Registrations State (Paginated: 10 per page)
  const [graduates, setGraduates] = useState([]);
  const [totalGraduates, setTotalGraduates] = useState(0);
  const [graduatesLoading, setGraduatesLoading] = useState(false);
  const [gradSearchQuery, setGradSearchQuery] = useState('');
  const [gradDistrictFilter, setGradDistrictFilter] = useState('all');
  const [gradEducationFilter, setGradEducationFilter] = useState('all');
  const [gradCurrentPage, setGradCurrentPage] = useState(1);
  const [gradTotalPages, setGradTotalPages] = useState(1);
  const [selectedGraduate, setSelectedGraduate] = useState(null);

  // Helpdesk & Grievance Tickets State (Paginated: 10 per page)
  const [tickets, setTickets] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [openTicketsCount, setOpenTicketsCount] = useState(0);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketSearchQuery, setTicketSearchQuery] = useState('');
  const [ticketDistrictFilter, setTicketDistrictFilter] = useState('all');
  const [ticketStatusFilter, setTicketStatusFilter] = useState('all');
  const [ticketCategoryFilter, setTicketCategoryFilter] = useState('all');
  const [ticketCurrentPage, setTicketCurrentPage] = useState(1);
  const [ticketTotalPages, setTicketTotalPages] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const karnatakaDistrictsList = [
    'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban',
    'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga',
    'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan',
    'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal',
    'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga',
    'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Vijayanagara',
    'Yadgir', 'Other Karnataka District'
  ];

  // Filters for Jobs
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [statusTab, setStatusTab] = useState('all'); // 'all', 'active', 'closed'

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Pagination inside Admin Table
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const initialForm = {
    title: '',
    company: '',
    category: 'Engineering & Tech',
    job_type: 'Full Time',
    district: 'Tumakuru',
    taluk: '',
    qualification: '',
    experience: 'Freshers (0-1 yr)',
    passing_year: '2023 - 2026',
    salary: '',
    openings: '',
    deadline: '',
    apply_url: '',
    description: '',
    skills: '',
    status: 'active',
    source_note: 'Constituency Placement Desk'
  };

  const [formData, setFormData] = useState(initialForm);

  // Helper for authenticated requests with Bearer JWT
  const authFetch = async (url, options = {}) => {
    const defaultHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const res = await fetch(url, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers }
    });

    if (res.status === 401 || res.status === 403) {
      alert('Your admin session has expired. Please sign in again.');
      if (onLogout) onLogout();
      throw new Error('Session expired.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Operation failed.');
    }
    return data;
  };

  // Load jobs list
  const loadJobs = async () => {
    try {
      setIsLoading(true);
      let url = '/api/admin/jobs?';
      if (searchQuery.trim()) url += `search=${encodeURIComponent(searchQuery.trim())}&`;
      if (districtFilter !== 'all') url += `district=${encodeURIComponent(districtFilter)}&`;
      if (statusTab !== 'all') url += `status=${encodeURIComponent(statusTab)}&`;

      const res = await authFetch(url);
      setJobs(res.data || []);
      setCurrentPage(1);
    } catch (err) {
      console.error('Load Jobs Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [districtFilter, statusTab]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadJobs();
  };

  // Load graduates list (10 per page with query parameters)
  const loadGraduates = async (page = gradCurrentPage) => {
    try {
      setGraduatesLoading(true);
      let url = `/api/admin/graduates?page=${page}&limit=10&`;
      if (gradSearchQuery.trim()) url += `search=${encodeURIComponent(gradSearchQuery.trim())}&`;
      if (gradDistrictFilter !== 'all') url += `district=${encodeURIComponent(gradDistrictFilter)}&`;
      if (gradEducationFilter !== 'all') url += `education=${encodeURIComponent(gradEducationFilter)}&`;

      const res = await authFetch(url);
      setGraduates(res.data || []);
      setTotalGraduates(res.total || 0);
      setGradTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Load Graduates Error:', err);
    } finally {
      setGraduatesLoading(false);
    }
  };

  // Initial load of graduates count on mount
  useEffect(() => {
    loadGraduates(1);
  }, []);

  // Reload graduates when activeSection is graduates or filters/page change
  useEffect(() => {
    if (activeSection === 'graduates') {
      loadGraduates(gradCurrentPage);
    }
  }, [activeSection, gradCurrentPage, gradDistrictFilter, gradEducationFilter]);

  const handleGradSearchSubmit = (e) => {
    e.preventDefault();
    setGradCurrentPage(1);
    loadGraduates(1);
  };

  const handleDeleteGraduate = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove registration record for "${name}"?`)) return;
    try {
      await authFetch(`/api/admin/graduates/${id}`, { method: 'DELETE' });
      loadGraduates(gradCurrentPage);
    } catch (err) {
      alert(err.message || 'Failed to delete registration record.');
    }
  };

  const handleExportGraduatesCsv = () => {
    if (!graduates || graduates.length === 0) {
      alert('No graduate records available to export.');
      return;
    }

    const headers = ['Token ID', 'Full Name', 'Mobile', 'Email', 'District', 'Taluk', 'Education / Course', 'Career Interest', 'Registration Date'];
    const rows = graduates.map((g) => [
      `"${g.token_id || ''}"`,
      `"${g.full_name || ''}"`,
      `"${g.mobile || ''}"`,
      `"${g.email || ''}"`,
      `"${g.district || ''}"`,
      `"${g.taluk || ''}"`,
      `"${g.education || ''}"`,
      `"${g.career_interest || ''}"`,
      `"${g.created_at ? new Date(g.created_at).toLocaleString('en-IN') : ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VidyaPragathi_Graduate_Registrations_Page${gradCurrentPage}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Load tickets list (10 per page with query parameters)
  const loadTickets = async (page = ticketCurrentPage) => {
    try {
      setTicketsLoading(true);
      let url = `/api/admin/helpdesk?page=${page}&limit=10&`;
      if (ticketSearchQuery.trim()) url += `search=${encodeURIComponent(ticketSearchQuery.trim())}&`;
      if (ticketDistrictFilter !== 'all') url += `district=${encodeURIComponent(ticketDistrictFilter)}&`;
      if (ticketStatusFilter !== 'all') url += `status=${encodeURIComponent(ticketStatusFilter)}&`;
      if (ticketCategoryFilter !== 'all') url += `category=${encodeURIComponent(ticketCategoryFilter)}&`;

      const res = await authFetch(url);
      setTickets(res.data || []);
      setTotalTickets(res.total || 0);
      setTicketTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Load Tickets Error:', err);
    } finally {
      setTicketsLoading(false);
    }
  };

  // Initial load of tickets and open tickets counter
  useEffect(() => {
    loadTickets(1);
    authFetch('/api/admin/stats')
      .then((data) => {
        if (data && data.stats) {
          setOpenTicketsCount(data.stats.openTickets || 0);
        }
      })
      .catch((e) => console.warn('Stats fetch notice:', e.message));
  }, []);

  // Reload tickets when activeSection is helpdesk or filters/page change
  useEffect(() => {
    if (activeSection === 'helpdesk') {
      loadTickets(ticketCurrentPage);
    }
  }, [activeSection, ticketCurrentPage, ticketDistrictFilter, ticketStatusFilter, ticketCategoryFilter]);

  const handleTicketSearchSubmit = (e) => {
    e.preventDefault();
    setTicketCurrentPage(1);
    loadTickets(1);
  };

  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    try {
      await authFetch(`/api/admin/helpdesk/${ticketId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      );
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
      }
      loadTickets(ticketCurrentPage);
      // update open tickets counter
      authFetch('/api/admin/stats').then((d) => {
        if (d && d.stats) setOpenTicketsCount(d.stats.openTickets || 0);
      });
    } catch (err) {
      alert(err.message || 'Failed to update ticket status.');
    }
  };

  const handleDeleteTicket = async (id, ticketNumber) => {
    if (!window.confirm(`Are you sure you want to delete helpdesk ticket "${ticketNumber}"?`)) return;
    try {
      await authFetch(`/api/admin/helpdesk/${id}`, { method: 'DELETE' });
      if (selectedTicket && selectedTicket.id === id) {
        setSelectedTicket(null);
      }
      loadTickets(ticketCurrentPage);
    } catch (err) {
      alert(err.message || 'Failed to delete ticket record.');
    }
  };

  const handleExportTicketsCsv = () => {
    if (!tickets || tickets.length === 0) {
      alert('No helpdesk tickets available to export.');
      return;
    }

    const headers = ['Ticket ID', 'Candidate Name', 'Mobile', 'District', 'Category', 'Description', 'Status', 'Date Lodged'];
    const rows = tickets.map((t) => [
      `"${t.ticket_number || ''}"`,
      `"${(t.full_name || '').replace(/"/g, '""')}"`,
      `"${t.mobile || ''}"`,
      `"${t.district || ''}"`,
      `"${t.category || ''}"`,
      `"${(t.message || '').replace(/"/g, '""')}"`,
      `"${t.status || 'Open'}"`,
      `"${t.created_at ? new Date(t.created_at).toLocaleString('en-IN') : ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VidyaPragathi_Helpdesk_Tickets_Page${ticketCurrentPage}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenCreateModal = () => {
    setEditingJobId(null);
    setFormData(initialForm);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setEditingJobId(job.id);
    const deadlineFormatted = job.deadline ? job.deadline.split('T')[0] : '';
    setFormData({
      title: job.title || '',
      company: job.company || '',
      category: job.category || 'Engineering & Tech',
      job_type: job.job_type || 'Full Time',
      district: job.district || 'Tumakuru',
      taluk: job.taluk || '',
      qualification: job.qualification || '',
      experience: job.experience || 'Freshers (0-1 yr)',
      passing_year: job.passing_year || '',
      salary: job.salary || '',
      openings: job.openings || '',
      deadline: deadlineFormatted,
      apply_url: job.apply_url || '',
      description: job.description || '',
      skills: job.skills || '',
      status: job.status || 'active',
      source_note: job.source_note || ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmitJobForm = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.company || !formData.qualification || !formData.deadline || !formData.apply_url || !formData.description) {
      setFormError('Please fill in all mandatory fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingJobId) {
        await authFetch(`/api/admin/jobs/${editingJobId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await authFetch('/api/admin/jobs', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }

      setIsModalOpen(false);
      loadJobs();
    } catch (err) {
      console.error('Save Job Error:', err);
      setFormError(err.message || 'Failed to save opportunity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJob = async (jobId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await authFetch(`/api/admin/jobs/${jobId}`, {
        method: 'DELETE'
      });
      loadJobs();
    } catch (err) {
      alert(err.message || 'Failed to delete job.');
    }
  };

  const handleToggleStatus = async (job) => {
    const nextStatus = job.status === 'active' ? 'closed' : 'active';
    try {
      await authFetch(`/api/admin/jobs/${job.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus })
      });
      loadJobs();
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  // Pagination calculation
  const totalItems = jobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = jobs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className={styles.dashboardLayout}>
      {/* 1. Header Bar: Brand on Left, Candidate on Right */}
      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <button
            type="button"
            className={styles.mobileMenuBtn}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle navigation drawer"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              {isSidebarOpen ? 'close' : 'menu'}
            </span>
          </button>

          <div className={styles.brandBadge}>
            <div className={styles.brandLogoBox}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>school</span>
            </div>
            <div className={styles.brandInfo}>
              <span className={styles.brandName}>Vidya Pragati</span>
            </div>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.mlcProfile} title="K.M. Suresh — BJP Candidate">
            <img
              src="/images/candidate-portrait.jpeg"
              alt="K.M. Suresh MLC Candidate"
              className={styles.mlcAvatar}
              onError={(e) => {
                e.currentTarget.src = '/images/candidate-namaste.jpeg';
              }}
            />
            <div className={styles.mlcDetails}>
              <span className={styles.mlcName}>(ಕೆ.ಎಂ. ಸುರೇಶ್)</span>
              <span className={styles.mlcSub}>BJP Candidate • South-East Graduates</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Body Container with Fixed Sidebar */}
      <div className={styles.bodyContainer}>
        {/* Mobile Drawer Overlay */}
        {isSidebarOpen && (
          <div
            className={styles.mobileDrawerOverlay}
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar: Fixed with Pinned Logout at Bottom */}
        <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
          <nav className={styles.sidebarNav} aria-label="Sidebar Navigation">
            <button
              type="button"
              className={`${styles.navItem} ${activeSection === 'jobs' ? styles.navItemActive : ''}`}
              onClick={() => {
                setActiveSection('jobs');
                setIsSidebarOpen(false);
              }}
            >
              <span className={`material-symbols-outlined ${styles.navIcon}`}>business_center</span>
              <span>Job Portal</span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${activeSection === 'graduates' ? styles.navItemActive : ''}`}
              onClick={() => {
                setActiveSection('graduates');
                setIsSidebarOpen(false);
              }}
            >
              <span className={`material-symbols-outlined ${styles.navIcon}`}>school</span>
              <span>Graduate Registrations</span>
              {totalGraduates > 0 && (
                <span className={styles.navBadge}>{totalGraduates}</span>
              )}
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${activeSection === 'helpdesk' ? styles.navItemActive : ''}`}
              onClick={() => {
                setActiveSection('helpdesk');
                setIsSidebarOpen(false);
              }}
            >
              <span className={`material-symbols-outlined ${styles.navIcon}`}>support_agent</span>
              <span>Helpdesk & Tickets</span>
              {openTicketsCount > 0 && (
                <span className={styles.navBadge} style={{ background: '#ea580c' }}>{openTicketsCount}</span>
              )}
            </button>
          </nav>

          {/* End of Sidebar: Fixed Pinned Logout Button */}
          <div className={styles.sidebarBottom}>
            <button
              type="button"
              className={styles.logoutBtn}
              onClick={onLogout}
              title="Sign Out"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* 3. Main Dashboard: Compact UI matching Reference Image 1 */}
        <main className={styles.mainContent}>
          {activeSection === 'jobs' ? (
            <>
              {/* Reference Toolbar: Title + Tabs + Search & Filter + Action Button */}
          <div className={styles.referenceToolbar}>
            <div className={styles.toolbarTitleGroup}>
              <h1 className={styles.portalTitle}>Opportunities</h1>

              {/* Status Pill Tabs [ALL] [ACTIVE] [CLOSED] */}
              <div className={styles.statusPillTabs}>
                <button
                  type="button"
                  className={`${styles.pillTabBtn} ${statusTab === 'all' ? styles.pillTabActive : ''}`}
                  onClick={() => setStatusTab('all')}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`${styles.pillTabBtn} ${statusTab === 'active' ? styles.pillTabActive : ''}`}
                  onClick={() => setStatusTab('active')}
                >
                  Active
                </button>
                <button
                  type="button"
                  className={`${styles.pillTabBtn} ${statusTab === 'closed' ? styles.pillTabActive : ''}`}
                  onClick={() => setStatusTab('closed')}
                >
                  Closed
                </button>
              </div>
            </div>

            {/* Right Controls: Search, District Filter, + Post Job */}
            <div className={styles.toolbarRightControls}>
              <form onSubmit={handleSearchSubmit} className={styles.compactSearchBox}>
                <span className={`material-symbols-outlined ${styles.compactSearchIcon}`}>search</span>
                <input
                  type="text"
                  className={styles.compactSearchInput}
                  placeholder="Search title, company, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              <div className={styles.districtFilterBtn}>
                <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#64748b' }}>filter_list</span>
                <select
                  className={styles.districtSelect}
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                >
                  <option value="all">All Districts</option>
                  <option value="Tumakuru">Tumakuru</option>
                  <option value="Kolar">Kolar</option>
                  <option value="Chitradurga">Chitradurga</option>
                  <option value="Chikkaballapur">Chikkaballapur</option>
                  <option value="Davanagere">Davanagere</option>
                </select>
              </div>

              <button
                type="button"
                className={styles.createJobBtn}
                onClick={handleOpenCreateModal}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                <span>Post Job</span>
              </button>
            </div>
          </div>

          {/* Table Container Card */}
          <div className={styles.tableContainerCard}>
            {/* Desktop / Tablet Compact Data Table */}
            <div className={styles.tableScrollWrapper}>
              <table className={styles.compactTable}>
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Position Title</th>
                    <th>Company / Employer</th>
                    <th>District</th>
                    <th>Eligibility</th>
                    <th>Pay Scale</th>
                    <th>Status</th>
                    <th>Deadline</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                        Loading opportunities...
                      </td>
                    </tr>
                  ) : paginatedJobs.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                        No opportunities found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedJobs.map((job) => (
                      <tr key={job.id}>
                        <td>
                          <span className={styles.idCell}>#{job.id}</span>
                        </td>
                        <td>
                          <span className={styles.jobTitleCell}>{job.title}</span>
                        </td>
                        <td>
                          <span className={styles.companyCell}>{job.company}</span>
                        </td>
                        <td>
                          <span className={styles.districtCell}>{job.district}</span>
                        </td>
                        <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={job.qualification}>
                          {job.qualification}
                        </td>
                        <td style={{ fontWeight: 500, color: '#0f172a', whiteSpace: 'nowrap' }}>
                          {job.salary || 'Govt / Norms'}
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(job)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            title="Toggle status"
                          >
                            {job.status === 'active' ? (
                              <span className={styles.badgeVerified}>
                                <span className={styles.statusDotGreen}></span>
                                Active
                              </span>
                            ) : job.status === 'closed' ? (
                              <span className={styles.badgeUnverified}>
                                <span className={styles.statusDotRed}></span>
                                Closed
                              </span>
                            ) : (
                              <span className={styles.badgeDraft}>
                                <span className={styles.statusDotGray}></span>
                                Draft
                              </span>
                            )}
                          </button>
                        </td>
                        <td style={{ color: '#64748b', whiteSpace: 'nowrap' }}>
                          {job.deadline ? job.deadline.split('T')[0] : 'Open'}
                        </td>
                        <td>
                          <div className={styles.actionIconsGroup} style={{ justifyContent: 'flex-end' }}>
                            <a
                              href={job.apply_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.actionIconBtn}
                              title="View Employer Application Link"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>visibility</span>
                            </a>
                            <button
                              type="button"
                              className={styles.actionIconBtn}
                              onClick={() => handleOpenEditModal(job)}
                              title="Edit Opportunity"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>edit</span>
                            </button>
                            <button
                              type="button"
                              className={`${styles.actionIconBtn} ${styles.actionIconBtnDanger}`}
                              onClick={() => handleDeleteJob(job.id, job.title)}
                              title="Delete Opportunity"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards Container (Visible on phones < 768px) */}
            <div className={styles.mobileCardsContainer}>
              {paginatedJobs.map((job) => (
                <div key={job.id} className={styles.mobileJobCard}>
                  <div className={styles.mobileCardTop}>
                    <div>
                      <div className={styles.mobileCardTitle}>{job.title}</div>
                      <div className={styles.mobileCardCompany}>{job.company}</div>
                    </div>
                    <div>
                      {job.status === 'active' ? (
                        <span className={styles.badgeVerified}>
                          <span className={styles.statusDotGreen}></span> Active
                        </span>
                      ) : (
                        <span className={styles.badgeUnverified}>
                          <span className={styles.statusDotRed}></span> Closed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.mobileCardMetaGrid}>
                    <div className={styles.mobileMetaItem}>
                      <span className={styles.mobileMetaLabel}>District</span>
                      <span className={styles.mobileMetaValue}>{job.district}</span>
                    </div>
                    <div className={styles.mobileMetaItem}>
                      <span className={styles.mobileMetaLabel}>Pay Scale</span>
                      <span className={styles.mobileMetaValue}>{job.salary || 'Norms'}</span>
                    </div>
                    <div className={styles.mobileMetaItem}>
                      <span className={styles.mobileMetaLabel}>Eligibility</span>
                      <span className={styles.mobileMetaValue}>{job.qualification}</span>
                    </div>
                    <div className={styles.mobileMetaItem}>
                      <span className={styles.mobileMetaLabel}>Deadline</span>
                      <span className={styles.mobileMetaValue}>{job.deadline ? job.deadline.split('T')[0] : 'Open'}</span>
                    </div>
                  </div>

                  <div className={styles.mobileCardBottom}>
                    <span className={styles.idCell}>ID: #{job.id}</span>
                    <div className={styles.actionIconsGroup}>
                      <a
                        href={job.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.actionIconBtn}
                        title="View Link"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>visibility</span>
                      </a>
                      <button
                        type="button"
                        className={styles.actionIconBtn}
                        onClick={() => handleOpenEditModal(job)}
                        title="Edit"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                      </button>
                      <button
                        type="button"
                        className={`${styles.actionIconBtn} ${styles.actionIconBtnDanger}`}
                        onClick={() => handleDeleteJob(job.id, job.title)}
                        title="Delete"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table Footer matching Reference: Showing 1-10 of X results & pagination */}
            <div className={styles.tableFooterRow}>
              <div className={styles.showingResultsText}>
                Showing {totalItems > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} results
              </div>

              {totalPages > 1 && (
                <div className={styles.paginationControls}>
                  <button
                    type="button"
                    className={styles.pageNavTextBtn}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      className={`${styles.pageChip} ${currentPage === pageNum ? styles.pageChipActive : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    className={styles.pageNavTextBtn}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
            </>
          ) : activeSection === 'graduates' ? (
            <>
              {/* Graduate Registrations Toolbar */}
              <div className={styles.referenceToolbar}>
                <div className={styles.toolbarTitleGroup}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <h1 className={styles.portalTitle}>Graduate Registrations</h1>
                    <span className={styles.navBadge} style={{ fontSize: '11px', padding: '0.2rem 0.6rem' }}>
                      {totalGraduates} Candidates
                    </span>
                  </div>
                </div>

                <div className={styles.toolbarRightControls}>
                  {/* Search: query params passed to API */}
                  <form onSubmit={handleGradSearchSubmit} className={styles.compactSearchBox}>
                    <span className={`material-symbols-outlined ${styles.compactSearchIcon}`}>search</span>
                    <input
                      type="text"
                      className={styles.compactSearchInput}
                      placeholder="Search name, phone, email, token..."
                      value={gradSearchQuery}
                      onChange={(e) => setGradSearchQuery(e.target.value)}
                    />
                  </form>

                  {/* District Filter (Ascending Alphabetical) */}
                  <div className={styles.districtFilterBtn}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#64748b' }}>location_on</span>
                    <select
                      className={styles.districtSelect}
                      value={gradDistrictFilter}
                      onChange={(e) => {
                        setGradDistrictFilter(e.target.value);
                        setGradCurrentPage(1);
                      }}
                    >
                      <option value="all">All Districts</option>
                      <option value="Bagalkot">Bagalkot</option>
                      <option value="Ballari">Ballari</option>
                      <option value="Belagavi">Belagavi</option>
                      <option value="Bengaluru Rural">Bengaluru Rural</option>
                      <option value="Bengaluru Urban">Bengaluru Urban</option>
                      <option value="Bidar">Bidar</option>
                      <option value="Chamarajanagar">Chamarajanagar</option>
                      <option value="Chikkaballapur">Chikkaballapur</option>
                      <option value="Chikkamagaluru">Chikkamagaluru</option>
                      <option value="Chitradurga">Chitradurga</option>
                      <option value="Dakshina Kannada">Dakshina Kannada</option>
                      <option value="Davanagere">Davanagere</option>
                      <option value="Dharwad">Dharwad</option>
                      <option value="Gadag">Gadag</option>
                      <option value="Hassan">Hassan</option>
                      <option value="Haveri">Haveri</option>
                      <option value="Kalaburagi">Kalaburagi</option>
                      <option value="Kodagu">Kodagu</option>
                      <option value="Kolar">Kolar</option>
                      <option value="Koppal">Koppal</option>
                      <option value="Mandya">Mandya</option>
                      <option value="Mysuru">Mysuru</option>
                      <option value="Raichur">Raichur</option>
                      <option value="Ramanagara">Ramanagara</option>
                      <option value="Shivamogga">Shivamogga</option>
                      <option value="Tumakuru">Tumakuru</option>
                      <option value="Udupi">Udupi</option>
                      <option value="Uttara Kannada">Uttara Kannada</option>
                      <option value="Vijayapura">Vijayapura</option>
                      <option value="Vijayanagara">Vijayanagara</option>
                      <option value="Yadgir">Yadgir</option>
                      <option value="Other Karnataka District">Other District</option>
                    </select>
                  </div>

                  {/* Education / Qualification Filter */}
                  <div className={styles.districtFilterBtn}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#64748b' }}>school</span>
                    <select
                      className={styles.districtSelect}
                      value={gradEducationFilter}
                      onChange={(e) => {
                        setGradEducationFilter(e.target.value);
                        setGradCurrentPage(1);
                      }}
                    >
                      <option value="all">All Courses</option>
                      <option value="BE / B.Tech">BE / B.Tech</option>
                      <option value="B.Com / BBA">B.Com / BBA</option>
                      <option value="B.Sc / BCA">B.Sc / BCA</option>
                      <option value="BA / MA / Humanities">BA / MA</option>
                      <option value="M.Tech / ME">M.Tech / ME</option>
                      <option value="MBA / MCA">MBA / MCA</option>
                      <option value="Diploma / Polytechnic">Diploma</option>
                      <option value="Medical / Nursing / Pharmacy">Medical</option>
                      <option value="Law / LL.B">Law</option>
                      <option value="Other Degree">Other</option>
                    </select>
                  </div>

                  {/* CSV Export Button */}
                  <button
                    type="button"
                    className={styles.exportCsvBtn}
                    onClick={handleExportGraduatesCsv}
                    title="Export all graduate registrations to CSV"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>download</span>
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Graduate Registrations Table Container Card */}
              <div className={styles.tableContainerCard}>
                {/* Desktop Compact Data Table */}
                <div className={styles.tableScrollWrapper}>
                  <table className={styles.compactTable}>
                    <thead>
                      <tr>
                        <th>Token ID</th>
                        <th>Candidate Name</th>
                        <th>Contact & WhatsApp</th>
                        <th>District</th>
                        <th>Course</th>
                        <th>Stream</th>
                        <th>Passout</th>
                        <th>Career Interest</th>
                        <th>Registered</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {graduatesLoading ? (
                        <tr>
                          <td colSpan="10" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                            Loading registered candidates...
                          </td>
                        </tr>
                      ) : graduates.length === 0 ? (
                        <tr>
                          <td colSpan="10" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                            No graduate registrations found matching your query.
                          </td>
                        </tr>
                      ) : (
                        graduates.map((grad) => (
                          <tr key={grad.id}>
                            <td>
                              <span className={styles.idCell}>{grad.token_id || `#KA-SE-${grad.id}`}</span>
                            </td>
                            <td>
                              <div className={styles.candidateNameCell}>
                                <div className={styles.candidateAvatarInitials}>
                                  {grad.full_name ? grad.full_name.charAt(0).toUpperCase() : 'G'}
                                </div>
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>{grad.full_name}</span>
                              </div>
                            </td>
                            <td>
                              <div className={styles.contactPhoneWrap}>
                                <span style={{ fontWeight: 500 }}>{grad.mobile}</span>
                                <a
                                  href={`https://wa.me/91${grad.mobile.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.whatsappActionLink}
                                  title={`Chat with ${grad.full_name} on WhatsApp`}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>chat</span>
                                </a>
                                <a
                                  href={`tel:${grad.mobile}`}
                                  className={styles.callActionLink}
                                  title={`Call ${grad.full_name}`}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>call</span>
                                </a>
                              </div>
                              {grad.email && (
                                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '0.15rem' }}>
                                  {grad.email}
                                </div>
                              )}
                            </td>
                            <td>
                              <span className={styles.districtPillBadge}>
                                {grad.district}
                                {grad.taluk ? ` (${grad.taluk})` : ''}
                              </span>
                            </td>
                            <td>
                              <span className={styles.courseBadge}>{grad.education}</span>
                            </td>
                            <td style={{ color: '#475569', fontSize: '11px', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={grad.stream || 'General'}>
                              {grad.stream || '-'}
                            </td>
                            <td style={{ color: '#0f172a', fontWeight: 500, fontSize: '11px' }}>
                              {grad.passout_year || '-'}
                            </td>
                            <td>
                              <div className={styles.interestSnippetCell} title={grad.career_interest}>
                                {grad.career_interest}
                              </div>
                            </td>
                            <td style={{ color: '#64748b', fontSize: '10px', whiteSpace: 'nowrap' }}>
                              {grad.created_at ? new Date(grad.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                            </td>
                            <td>
                              <div className={styles.actionIconsGroup} style={{ justifyContent: 'flex-end' }}>
                                <button
                                  type="button"
                                  className={styles.actionIconBtn}
                                  onClick={() => setSelectedGraduate(grad)}
                                  title="View Details"
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>visibility</span>
                                </button>
                                <button
                                  type="button"
                                  className={`${styles.actionIconBtn} ${styles.actionIconBtnDanger}`}
                                  onClick={() => handleDeleteGraduate(grad.id, grad.full_name)}
                                  title="Delete Record"
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards for Graduates */}
                <div className={styles.mobileCardsContainer}>
                  {graduatesLoading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      Loading candidates...
                    </div>
                  ) : graduates.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No graduate registrations found.
                    </div>
                  ) : (
                    graduates.map((grad) => (
                      <div key={grad.id} className={styles.mobileCard}>
                        <div className={styles.mobileCardTop}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                            <div className={styles.candidateAvatarInitials}>
                              {grad.full_name ? grad.full_name.charAt(0).toUpperCase() : 'G'}
                            </div>
                            <div>
                              <div className={styles.mobileJobTitle}>{grad.full_name}</div>
                              <div className={styles.mobileCompany}>
                                <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0284c7' }}>
                                  {grad.token_id || `#KA-SE-${grad.id}`}
                                </span>
                                {' • '}
                                <span>{grad.education}</span>
                              </div>
                            </div>
                          </div>
                          <span className={styles.districtPillBadge}>{grad.district}</span>
                        </div>

                        <div className={styles.mobileMetaGrid}>
                          <div className={styles.mobileMetaItem}>
                            <span className={styles.mobileMetaLabel}>Phone</span>
                            <a
                              href={`tel:${grad.mobile}`}
                              className={styles.mobileMetaValue}
                              style={{ color: '#0369a1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>call</span>
                              <span>{grad.mobile}</span>
                            </a>
                          </div>
                          <div className={styles.mobileMetaItem}>
                            <span className={styles.mobileMetaLabel}>Passout Year</span>
                            <span className={styles.mobileMetaValue}>{grad.passout_year || '-'}</span>
                          </div>
                          <div className={styles.mobileMetaItem} style={{ gridColumn: 'span 2' }}>
                            <span className={styles.mobileMetaLabel}>Career Interest</span>
                            <span className={styles.mobileMetaValue} style={{ fontSize: '11px', color: '#334155' }}>
                              {grad.career_interest}
                            </span>
                          </div>
                        </div>

                        <div className={styles.mobileCardBottom}>
                          <a
                            href={`https://wa.me/91${grad.mobile.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${grad.full_name}, from Karnataka Graduate Career Desk...`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.whatsappActionLink}
                            style={{
                              fontSize: '11px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              background: '#f0fdf4',
                              border: '1px solid #bbf7d0',
                              color: '#15803d',
                              padding: '0.3rem 0.65rem',
                              borderRadius: '6px',
                              fontWeight: 600,
                              textDecoration: 'none'
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chat</span>
                            <span>WhatsApp</span>
                          </a>
                          <div className={styles.actionIconsGroup}>
                            <button
                              type="button"
                              className={styles.actionIconBtn}
                              onClick={() => setSelectedGraduate(grad)}
                              title="View Details"
                              style={{ width: '32px', height: '32px' }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>visibility</span>
                            </button>
                            <button
                              type="button"
                              className={`${styles.actionIconBtn} ${styles.actionIconBtnDanger}`}
                              onClick={() => handleDeleteGraduate(grad.id, grad.full_name)}
                              title="Delete"
                              style={{ width: '32px', height: '32px' }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Compact Table Footer: Showing 10 per page with Query Parameters */}
                <div className={styles.tableFooterRow}>
                  <div className={styles.showingResultsText}>
                    Showing {totalGraduates > 0 ? (gradCurrentPage - 1) * 10 + 1 : 0}-{Math.min(gradCurrentPage * 10, totalGraduates)} of {totalGraduates} graduates (10 per page)
                  </div>

                  {gradTotalPages > 1 && (
                    <div className={styles.paginationControls}>
                      <button
                        type="button"
                        className={styles.pageNavTextBtn}
                        onClick={() => setGradCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={gradCurrentPage <= 1}
                      >
                        Previous
                      </button>

                      {Array.from({ length: Math.min(gradTotalPages, 7) }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          className={`${styles.pageChip} ${gradCurrentPage === pageNum ? styles.pageChipActive : ''}`}
                          onClick={() => setGradCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        type="button"
                        className={styles.pageNavTextBtn}
                        onClick={() => setGradCurrentPage((p) => Math.min(gradTotalPages, p + 1))}
                        disabled={gradCurrentPage >= gradTotalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Helpdesk & Grievances Toolbar */}
              <div className={styles.referenceToolbar}>
                <div className={styles.toolbarTitleGroup}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <h1 className={styles.portalTitle}>Helpdesk & Grievances</h1>
                    <span className={styles.navBadge} style={{ fontSize: '11px', padding: '0.2rem 0.6rem' }}>
                      {totalTickets} Tickets
                    </span>
                  </div>

                  {/* Clean Pill Tabs [ALL] [OPEN] [IN REVIEW] [RESOLVED] */}
                  <div className={styles.statusPillTabs}>
                    <button
                      type="button"
                      className={`${styles.pillTabBtn} ${ticketStatusFilter === 'all' ? styles.pillTabActive : ''}`}
                      onClick={() => { setTicketStatusFilter('all'); setTicketCurrentPage(1); }}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      className={`${styles.pillTabBtn} ${ticketStatusFilter === 'Open' ? styles.pillTabActive : ''}`}
                      onClick={() => { setTicketStatusFilter('Open'); setTicketCurrentPage(1); }}
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className={`${styles.pillTabBtn} ${ticketStatusFilter === 'In Review' ? styles.pillTabActive : ''}`}
                      onClick={() => { setTicketStatusFilter('In Review'); setTicketCurrentPage(1); }}
                    >
                      In Review
                    </button>
                    <button
                      type="button"
                      className={`${styles.pillTabBtn} ${ticketStatusFilter === 'Resolved' ? styles.pillTabActive : ''}`}
                      onClick={() => { setTicketStatusFilter('Resolved'); setTicketCurrentPage(1); }}
                    >
                      Resolved
                    </button>
                  </div>
                </div>

                <div className={styles.toolbarRightControls}>
                  {/* Search: query params passed to API */}
                  <form onSubmit={handleTicketSearchSubmit} className={styles.compactSearchBox}>
                    <span className={`material-symbols-outlined ${styles.compactSearchIcon}`}>search</span>
                    <input
                      type="text"
                      className={styles.compactSearchInput}
                      placeholder="Search ticket #, name, phone, issue..."
                      value={ticketSearchQuery}
                      onChange={(e) => setTicketSearchQuery(e.target.value)}
                    />
                  </form>

                  {/* District Filter (All 31 Districts) */}
                  <div className={styles.districtFilterBtn}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#64748b' }}>location_on</span>
                    <select
                      className={styles.districtSelect}
                      value={ticketDistrictFilter}
                      onChange={(e) => {
                        setTicketDistrictFilter(e.target.value);
                        setTicketCurrentPage(1);
                      }}
                    >
                      <option value="all">All Districts</option>
                      {karnatakaDistrictsList.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div className={styles.districtFilterBtn}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#64748b' }}>category</span>
                    <select
                      className={styles.districtSelect}
                      value={ticketCategoryFilter}
                      onChange={(e) => {
                        setTicketCategoryFilter(e.target.value);
                        setTicketCurrentPage(1);
                      }}
                    >
                      <option value="all">All Categories</option>
                      <option value="State Scholarship Delay">State Scholarship Delay</option>
                      <option value="Degree Verification">Degree Verification</option>
                      <option value="Job Fair Query">Job Fair Query</option>
                      <option value="AI Skilling Fellowship">AI Skilling Fellowship</option>
                      <option value="Civil Services Guidance">Civil Services Guidance</option>
                      <option value="General Support">General Support</option>
                    </select>
                  </div>

                  {/* Export CSV Button */}
                  <button
                    type="button"
                    className={styles.exportCsvBtn}
                    onClick={handleExportTicketsCsv}
                    title="Export all helpdesk tickets to CSV"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>download</span>
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Helpdesk Tickets Container Card */}
              <div className={styles.tableContainerCard}>
                {/* Desktop Table View */}
                <div className={styles.tableScrollWrapper}>
                  <table className={styles.compactTable}>
                    <thead>
                      <tr>
                        <th>Ticket #</th>
                        <th>Candidate Name</th>
                        <th>Contact & WhatsApp</th>
                        <th>District</th>
                        <th>Category</th>
                        <th>Concern Description</th>
                        <th>Status</th>
                        <th>Date Lodged</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ticketsLoading ? (
                        <tr>
                          <td colSpan="9" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                            Loading helpdesk tickets...
                          </td>
                        </tr>
                      ) : tickets.length === 0 ? (
                        <tr>
                          <td colSpan="9" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                            No helpdesk tickets found matching your query.
                          </td>
                        </tr>
                      ) : (
                        tickets.map((tkt) => (
                          <tr key={tkt.id}>
                            <td>
                              <span className={styles.idCell} style={{ color: '#0369a1', fontWeight: 600 }}>
                                {tkt.ticket_number}
                              </span>
                            </td>
                            <td>
                              <div className={styles.candidateNameCell}>
                                <div className={styles.candidateAvatarInitials}>
                                  {tkt.full_name ? tkt.full_name.charAt(0).toUpperCase() : 'T'}
                                </div>
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>{tkt.full_name}</span>
                              </div>
                            </td>
                            <td>
                              <div className={styles.contactPhoneWrap}>
                                <span style={{ fontWeight: 500 }}>{tkt.mobile}</span>
                                <a
                                  href={`https://wa.me/91${tkt.mobile.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${tkt.full_name}, regarding your helpdesk ticket #${tkt.ticket_number} on Karnataka Graduate Helpdesk...`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.whatsappActionLink}
                                  title={`Chat with ${tkt.full_name} on WhatsApp`}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>chat</span>
                                </a>
                                <a
                                  href={`tel:${tkt.mobile}`}
                                  className={styles.callActionLink}
                                  title={`Call ${tkt.full_name}`}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>call</span>
                                </a>
                              </div>
                            </td>
                            <td>
                              <span className={styles.districtPillBadge}>{tkt.district}</span>
                            </td>
                            <td>
                              <span className={styles.courseBadge} style={{ background: '#f8fafc', color: '#334155', borderColor: '#e2e8f0' }}>
                                {tkt.category}
                              </span>
                            </td>
                            <td>
                              <div className={styles.interestSnippetCell} title={tkt.message} style={{ maxWidth: '200px' }}>
                                {tkt.message}
                              </div>
                            </td>
                            <td>
                              <select
                                className={styles.statusSelectInline}
                                value={tkt.status || 'Open'}
                                onChange={(e) => handleUpdateTicketStatus(tkt.id, e.target.value)}
                                title="Update ticket status"
                              >
                                <option value="Open">🟡 Open</option>
                                <option value="In Review">🔵 In Review</option>
                                <option value="Resolved">🟢 Resolved</option>
                                <option value="Closed">⚪ Closed</option>
                              </select>
                            </td>
                            <td style={{ color: '#64748b', fontSize: '10px', whiteSpace: 'nowrap' }}>
                              {tkt.created_at ? new Date(tkt.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                            </td>
                            <td>
                              <div className={styles.actionIconsGroup} style={{ justifyContent: 'flex-end' }}>
                                <button
                                  type="button"
                                  className={styles.actionIconBtn}
                                  onClick={() => setSelectedTicket(tkt)}
                                  title="View Details"
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>visibility</span>
                                </button>
                                <button
                                  type="button"
                                  className={`${styles.actionIconBtn} ${styles.actionIconBtnDanger}`}
                                  onClick={() => handleDeleteTicket(tkt.id, tkt.ticket_number)}
                                  title="Delete Ticket"
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile & Tablet Cards View */}
                <div className={styles.mobileCardsContainer}>
                  {ticketsLoading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      Loading tickets...
                    </div>
                  ) : tickets.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No helpdesk tickets found.
                    </div>
                  ) : (
                    tickets.map((tkt) => (
                      <div key={tkt.id} className={styles.mobileCard}>
                        <div className={styles.mobileCardTop}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                            <div className={styles.candidateAvatarInitials}>
                              {tkt.full_name ? tkt.full_name.charAt(0).toUpperCase() : 'T'}
                            </div>
                            <div>
                              <div className={styles.mobileJobTitle}>{tkt.full_name}</div>
                              <div className={styles.mobileCompany}>
                                <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0284c7' }}>
                                  {tkt.ticket_number}
                                </span>
                                {' • '}
                                <span>{tkt.category}</span>
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span className={styles.districtPillBadge}>{tkt.district}</span>
                            <span className={tkt.status === 'Resolved' ? styles.statusBadgeResolved : tkt.status === 'In Review' ? styles.statusBadgeInReview : styles.statusBadgeOpen}>
                              {tkt.status || 'Open'}
                            </span>
                          </div>
                        </div>

                        <div className={styles.mobileMetaGrid}>
                          <div className={styles.mobileMetaItem}>
                            <span className={styles.mobileMetaLabel}>Phone</span>
                            <a
                              href={`tel:${tkt.mobile}`}
                              className={styles.mobileMetaValue}
                              style={{ color: '#0369a1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>call</span>
                              <span>{tkt.mobile}</span>
                            </a>
                          </div>
                          <div className={styles.mobileMetaItem}>
                            <span className={styles.mobileMetaLabel}>Date Lodged</span>
                            <span className={styles.mobileMetaValue}>
                              {tkt.created_at ? new Date(tkt.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '-'}
                            </span>
                          </div>
                          <div className={styles.mobileMetaItem} style={{ gridColumn: 'span 2' }}>
                            <span className={styles.mobileMetaLabel}>Concern / Issue</span>
                            <span className={styles.mobileMetaValue} style={{ fontSize: '11px', color: '#334155' }}>
                              {tkt.message}
                            </span>
                          </div>
                        </div>

                        <div className={styles.mobileCardBottom}>
                          <a
                            href={`https://wa.me/91${tkt.mobile.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${tkt.full_name}, regarding your helpdesk ticket #${tkt.ticket_number} on Karnataka Graduate Helpdesk...`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.whatsappActionLink}
                            style={{
                              fontSize: '11px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              background: '#f0fdf4',
                              border: '1px solid #bbf7d0',
                              color: '#15803d',
                              padding: '0.3rem 0.65rem',
                              borderRadius: '6px',
                              fontWeight: 600,
                              textDecoration: 'none'
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chat</span>
                            <span>WhatsApp</span>
                          </a>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <select
                              className={styles.statusSelectInline}
                              value={tkt.status || 'Open'}
                              onChange={(e) => handleUpdateTicketStatus(tkt.id, e.target.value)}
                            >
                              <option value="Open">Open</option>
                              <option value="In Review">Review</option>
                              <option value="Resolved">Resolved</option>
                              <option value="Closed">Closed</option>
                            </select>

                            <button
                              type="button"
                              className={styles.actionIconBtn}
                              onClick={() => setSelectedTicket(tkt)}
                              title="View Details"
                              style={{ width: '32px', height: '32px' }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>visibility</span>
                            </button>
                            <button
                              type="button"
                              className={`${styles.actionIconBtn} ${styles.actionIconBtnDanger}`}
                              onClick={() => handleDeleteTicket(tkt.id, tkt.ticket_number)}
                              title="Delete"
                              style={{ width: '32px', height: '32px' }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination Footer */}
                <div className={styles.tableFooterRow}>
                  <div className={styles.showingResultsText}>
                    Showing {totalTickets > 0 ? (ticketCurrentPage - 1) * 10 + 1 : 0}-{Math.min(ticketCurrentPage * 10, totalTickets)} of {totalTickets} tickets (10 per page)
                  </div>

                  {ticketTotalPages > 1 && (
                    <div className={styles.paginationControls}>
                      <button
                        type="button"
                        className={styles.pageNavTextBtn}
                        onClick={() => setTicketCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={ticketCurrentPage <= 1}
                      >
                        Previous
                      </button>

                      {Array.from({ length: Math.min(ticketTotalPages, 7) }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          className={`${styles.pageChip} ${ticketCurrentPage === pageNum ? styles.pageChipActive : ''}`}
                          onClick={() => setTicketCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        type="button"
                        className={styles.pageNavTextBtn}
                        onClick={() => setTicketCurrentPage((p) => Math.min(ticketTotalPages, p + 1))}
                        disabled={ticketCurrentPage >= ticketTotalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* 4. Fully Scrollable Post / Edit Job Modal */}
      {isModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            {/* Fixed Modal Header */}
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <span className="material-symbols-outlined" style={{ color: '#0f172a' }}>
                  {editingJobId ? 'edit_note' : 'add_business'}
                </span>
                <span>{editingJobId ? 'Edit Career Opportunity' : 'Post Career Opportunity'}</span>
              </div>
              <button
                type="button"
                className={styles.closeModalBtn}
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
              </button>
            </div>

            {/* Fully Scrollable Form Flex Layout */}
            <form className={styles.modalForm} onSubmit={handleSubmitJobForm}>
              <div className={styles.modalBody}>
                {formError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.6rem 0.85rem', borderRadius: '8px', fontSize: '11px', fontWeight: 500, marginBottom: '1rem' }}>
                    {formError}
                  </div>
                )}

                <div className={styles.formGrid}>
                  {/* Title */}
                  <div className={`${styles.formField} ${styles.formColFull}`}>
                    <label className={styles.formLabel}>Job Title *</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. Graduate Engineer Trainee (GET)"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  {/* Company */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Company / Recruiting Department *</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. Wistron Infocomm"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>

                  {/* Sector */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Sector / Category *</label>
                    <select
                      className={styles.formSelectInput}
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Engineering & Tech">Engineering & Tech</option>
                      <option value="Commerce & Banking">Commerce & Banking</option>
                      <option value="Government / KPSC Exams">Government / KPSC Exams</option>
                      <option value="Emerging AI & Digital Skills">Emerging AI & Digital Skills</option>
                      <option value="Healthcare & Allied">Healthcare & Allied</option>
                      <option value="Apprenticeship">Skill Apprenticeship</option>
                    </select>
                  </div>

                  {/* Employment Model */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Employment Model *</label>
                    <select
                      className={styles.formSelectInput}
                      value={formData.job_type}
                      onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                    >
                      <option value="Full Time">Full Time</option>
                      <option value="Internship / Apprenticeship">Internship / Apprenticeship</option>
                      <option value="Contractual">Contractual</option>
                      <option value="Government Notice">Government Notice</option>
                    </select>
                  </div>

                  {/* District */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Constituency District *</label>
                    <select
                      className={styles.formSelectInput}
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    >
                      <option value="Tumakuru">Tumakuru</option>
                      <option value="Kolar">Kolar</option>
                      <option value="Chitradurga">Chitradurga</option>
                      <option value="Chikkaballapur">Chikkaballapur</option>
                      <option value="Davanagere">Davanagere</option>
                      <option value="All Districts / Karnataka-Wide">All Districts / Karnataka-Wide</option>
                    </select>
                  </div>

                  {/* Taluk */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Taluk / Venue / Industrial Area</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. Narasapura Industrial Area"
                      value={formData.taluk}
                      onChange={(e) => setFormData({ ...formData, taluk: e.target.value })}
                    />
                  </div>

                  {/* Qualification */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Required Degree / Qualification *</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. BE / B.Tech or B.Com"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      required
                    />
                  </div>

                  {/* Experience */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Experience Requirement</label>
                    <select
                      className={styles.formSelectInput}
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    >
                      <option value="Freshers (0-1 yr)">Freshers (0-1 yr)</option>
                      <option value="Freshers">Freshers</option>
                      <option value="1-3 yrs">1-3 yrs</option>
                      <option value="No Prior Experience Required">No Prior Experience Required</option>
                      <option value="Experienced (3+ yrs)">Experienced (3+ yrs)</option>
                    </select>
                  </div>

                  {/* Batches */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Eligible Passing Batches</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. 2022 - 2026"
                      value={formData.passing_year}
                      onChange={(e) => setFormData({ ...formData, passing_year: e.target.value })}
                    />
                  </div>

                  {/* Salary */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Salary / Stipend Range</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. ₹3.8 LPA - ₹4.5 LPA"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    />
                  </div>

                  {/* Openings */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Estimated Openings / Vacancies</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. 120 Openings"
                      value={formData.openings}
                      onChange={(e) => setFormData({ ...formData, openings: e.target.value })}
                    />
                  </div>

                  {/* Deadline */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Application Deadline *</label>
                    <input
                      type="date"
                      className={styles.formInput}
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      required
                    />
                  </div>

                  {/* Apply URL */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Application Link or Portal URL *</label>
                    <input
                      type="url"
                      className={styles.formInput}
                      placeholder="https://company.com/apply"
                      value={formData.apply_url}
                      onChange={(e) => setFormData({ ...formData, apply_url: e.target.value })}
                      required
                    />
                  </div>

                  {/* Key Skills */}
                  <div className={`${styles.formField} ${styles.formColFull}`}>
                    <label className={styles.formLabel}>Key Skills / Search Keywords</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Comma-separated: SMT Testing, CAD, Python, Tally"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    />
                  </div>

                  {/* Description */}
                  <div className={`${styles.formField} ${styles.formColFull}`}>
                    <label className={styles.formLabel}>Job Description & Key Responsibilities *</label>
                    <textarea
                      className={styles.formTextarea}
                      placeholder="Describe the opportunity, key roles, shifts, and requirements..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  {/* Status */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Publishing Status</label>
                    <select
                      className={styles.formSelectInput}
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">Active (Visible on public portal)</option>
                      <option value="draft">Draft (Saved only in Admin)</option>
                      <option value="closed">Closed / Expired</option>
                    </select>
                  </div>

                  {/* Source Note */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Verification Source Note</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. Constituency Industrial Placement MoU"
                      value={formData.source_note}
                      onChange={(e) => setFormData({ ...formData, source_note: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Fixed Modal Footer - Always Visible */}
              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitJobBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : editingJobId ? 'Save Changes' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Compact Graduate Profile Modal */}
      {selectedGraduate && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedGraduate(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <span className="material-symbols-outlined" style={{ color: '#0f172a' }}>school</span>
                <span>Candidate Profile — {selectedGraduate.token_id || `#KA-SE-${selectedGraduate.id}`}</span>
              </div>
              <button
                type="button"
                className={styles.closeModalBtn}
                onClick={() => setSelectedGraduate(null)}
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.gradDetailGrid}>
                <div className={styles.gradDetailItem}>
                  <span className={styles.gradDetailLabel}>Full Name</span>
                  <span className={styles.gradDetailValue}>{selectedGraduate.full_name}</span>
                </div>

                <div className={styles.gradDetailItem}>
                  <span className={styles.gradDetailLabel}>Registration Token</span>
                  <span className={styles.gradDetailValue} style={{ fontFamily: 'monospace', color: '#0369a1' }}>
                    {selectedGraduate.token_id || `KA-SE-${selectedGraduate.id}`}
                  </span>
                </div>

                <div className={styles.gradDetailItem}>
                  <span className={styles.gradDetailLabel}>Mobile / WhatsApp</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span className={styles.gradDetailValue}>{selectedGraduate.mobile}</span>
                    <a
                      href={`https://wa.me/91${selectedGraduate.mobile.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.whatsappActionLink}
                      title="Open WhatsApp"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chat</span>
                    </a>
                  </div>
                </div>

                <div className={styles.gradDetailItem}>
                  <span className={styles.gradDetailLabel}>Email Address</span>
                  <span className={styles.gradDetailValue}>{selectedGraduate.email || 'Not provided'}</span>
                </div>

                <div className={styles.gradDetailItem}>
                  <span className={styles.gradDetailLabel}>District / Constituency</span>
                  <span className={styles.gradDetailValue}>{selectedGraduate.district}</span>
                </div>

                <div className={styles.gradDetailItem}>
                  <span className={styles.gradDetailLabel}>Taluk / City</span>
                  <span className={styles.gradDetailValue}>{selectedGraduate.taluk || 'Not provided'}</span>
                </div>

                <div className={styles.gradDetailItem}>
                  <span className={styles.gradDetailLabel}>Graduation Degree</span>
                  <span className={styles.gradDetailValue}>{selectedGraduate.education}</span>
                </div>

                <div className={styles.gradDetailItem}>
                  <span className={styles.gradDetailLabel}>Specialization / Stream</span>
                  <span className={styles.gradDetailValue}>{selectedGraduate.stream || 'General'}</span>
                </div>

                <div className={styles.gradDetailItem}>
                  <span className={styles.gradDetailLabel}>Year of Graduation</span>
                  <span className={styles.gradDetailValue}>{selectedGraduate.passout_year || 'Not provided'}</span>
                </div>

                <div className={styles.gradDetailItem}>
                  <span className={styles.gradDetailLabel}>Registration Date</span>
                  <span className={styles.gradDetailValue}>
                    {selectedGraduate.created_at
                      ? new Date(selectedGraduate.created_at).toLocaleString('en-IN')
                      : 'Recently registered'}
                  </span>
                </div>

                <div className={styles.gradDetailItem} style={{ gridColumn: 'span 2' }}>
                  <span className={styles.gradDetailLabel}>Primary Career Interest</span>
                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '0.55rem 0.75rem',
                      fontSize: '11px',
                      color: '#0f172a',
                      fontWeight: 500,
                      marginTop: '0.2rem'
                    }}
                  >
                    {selectedGraduate.career_interest}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter} style={{ justifyContent: 'space-between' }}>
              <a
                href={`https://wa.me/91${selectedGraduate.mobile.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedGraduate.full_name}, regarding your registration on the Karnataka South-East Constituency Graduate Career Portal...`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: '#22c55e',
                  color: '#ffffff',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '11px',
                  fontWeight: 500
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>chat</span>
                <span>Connect on WhatsApp</span>
              </a>

              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setSelectedGraduate(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Helpdesk Ticket Details Modal */}
      {selectedTicket && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedTicket(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <span className="material-symbols-outlined" style={{ color: '#ea580c' }}>support_agent</span>
                <span>Ticket Details — {selectedTicket.ticket_number}</span>
              </div>
              <button
                type="button"
                className={styles.closeModalBtn}
                onClick={() => setSelectedTicket(null)}
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.gradDetailGrid}>
                <div className={styles.gradDetailItem}>
                  <span className={styles.gradDetailLabel}>Ticket Number</span>
                  <span className={styles.gradDetailValue} style={{ fontFamily: 'monospace', color: '#ea580c', fontWeight: 700 }}>
                    {selectedTicket.ticket_number}
                  </span>
                </div>

                <div className={styles.gradDetailItem}>
                  <span className={styles.gradDetailLabel}>Current Status</span>
                  <select
                    className={styles.statusSelectInline}
                    value={selectedTicket.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      handleUpdateTicketStatus(selectedTicket.id, newStatus);
                      setSelectedTicket({ ...selectedTicket, status: newStatus });
                    }}
                    style={{ marginTop: '0.2rem', padding: '0.35rem 0.6rem', fontSize: '12px' }}
                  >
                    <option value="Open">Open</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className={styles.gradDetailItem}>
                  <span className={styles.gradDetailLabel}>Applicant / Graduate</span>
                  <span className={styles.gradDetailValue} style={{ fontWeight: 600 }}>{selectedTicket.full_name}</span>
                </div>

                <div className={styles.gradDetailItem}>
                  <span className={styles.gradDetailLabel}>Mobile Contact</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span className={styles.gradDetailValue}>{selectedTicket.mobile}</span>
                    <a
                      href={`https://wa.me/91${selectedTicket.mobile.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.whatsappActionLink}
                      title="Open WhatsApp"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chat</span>
                    </a>
                    <a
                      href={`tel:${selectedTicket.mobile}`}
                      className={styles.callActionLink}
                      title="Call Applicant"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>call</span>
                    </a>
                  </div>
                </div>

                <div className={styles.gradDetailItem}>
                  <span className={styles.gradDetailLabel}>District</span>
                  <span className={styles.gradDetailValue}>{selectedTicket.district}</span>
                </div>

                <div className={styles.gradDetailItem}>
                  <span className={styles.gradDetailLabel}>Issue Category</span>
                  <span className={styles.gradDetailValue} style={{ color: '#0369a1', fontWeight: 600 }}>{selectedTicket.category}</span>
                </div>

                <div className={styles.gradDetailItem} style={{ gridColumn: 'span 2' }}>
                  <span className={styles.gradDetailLabel}>Submitted On</span>
                  <span className={styles.gradDetailValue} style={{ fontSize: '11px', color: '#64748b' }}>
                    {selectedTicket.created_at
                      ? new Date(selectedTicket.created_at).toLocaleString('en-IN')
                      : 'Recent'}
                  </span>
                </div>

                <div className={styles.gradDetailItem} style={{ gridColumn: 'span 2' }}>
                  <span className={styles.gradDetailLabel}>Grievance / Issue Description</span>
                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '0.85rem',
                      fontSize: '12px',
                      color: '#0f172a',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                      marginTop: '0.35rem'
                    }}
                  >
                    {selectedTicket.message || 'No description provided.'}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter} style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a
                  href={`https://wa.me/91${selectedTicket.mobile.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedTicket.full_name}, regarding your grievance ticket ${selectedTicket.ticket_number} submitted to Karnataka Graduate Helpdesk...`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: '#22c55e',
                    color: '#ffffff',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 500
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chat</span>
                  <span>WhatsApp Applicant</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteTicket(selectedTicket.id, selectedTicket.ticket_number);
                    setSelectedTicket(null);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: '#fff1f2',
                    border: '1px solid #fecdd3',
                    color: '#e11d48',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                  <span>Delete</span>
                </button>
              </div>

              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setSelectedTicket(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
