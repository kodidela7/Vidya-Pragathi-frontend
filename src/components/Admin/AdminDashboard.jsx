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

  // Job Melas & Skill Bootcamps State (Paginated: 10 per page)
  const [adminEvents, setAdminEvents] = useState([]);
  const [totalAdminEvents, setTotalAdminEvents] = useState(0);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [eventDistrictFilter, setEventDistrictFilter] = useState('all');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [eventStatusFilter, setEventStatusFilter] = useState('all');
  const [eventCurrentPage, setEventCurrentPage] = useState(1);
  const [eventTotalPages, setEventTotalPages] = useState(1);

  // Event Create / Edit Modal State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [isEventSubmitting, setIsEventSubmitting] = useState(false);
  const [eventFormError, setEventFormError] = useState('');

  const initialEventForm = {
    title: '',
    title_kn: '',
    event_type: 'Mega Job Mela',
    district: 'Tumakuru',
    venue: '',
    venue_kn: '',
    event_date: '',
    start_time: '9:30 AM',
    end_time: '5:00 PM',
    companies_count: 45,
    expected_openings: 1200,
    eligibility: 'All Degree Graduates',
    eligibility_kn: 'ಎಲ್ಲಾ ಪದವೀಧರರು',
    batches_eligible: '2020 - 2026',
    description: '',
    description_kn: '',
    entry_badge: 'Free E-Pass',
    banner_image: '',
    is_featured: false,
    status: 'Upcoming'
  };
  const [eventFormData, setEventFormData] = useState(initialEventForm);

  // Event Attendee Roster State
  const [rosterEvent, setRosterEvent] = useState(null);
  const [rosterAttendees, setRosterAttendees] = useState([]);
  const [rosterTotal, setRosterTotal] = useState(0);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [rosterSearch, setRosterSearch] = useState('');
  const [rosterStatus, setRosterStatus] = useState('all');
  const [rosterPage, setRosterPage] = useState(1);
  const [rosterTotalPages, setRosterTotalPages] = useState(1);

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

  // Load Events list (10 per page with filters & search)
  const loadAdminEvents = async (page = eventCurrentPage) => {
    try {
      setEventsLoading(true);
      let url = `/api/admin/events?page=${page}&limit=10&`;
      if (eventSearchQuery.trim()) url += `search=${encodeURIComponent(eventSearchQuery.trim())}&`;
      if (eventDistrictFilter !== 'all') url += `district=${encodeURIComponent(eventDistrictFilter)}&`;
      if (eventTypeFilter !== 'all') url += `type=${encodeURIComponent(eventTypeFilter)}&`;
      if (eventStatusFilter !== 'all') url += `status=${encodeURIComponent(eventStatusFilter)}&`;

      const res = await authFetch(url);
      setAdminEvents(res.data || []);
      setTotalAdminEvents(res.total || 0);
      setEventTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Load Admin Events Error:', err);
    } finally {
      setEventsLoading(false);
    }
  };

  // Initial load of events count
  useEffect(() => {
    loadAdminEvents(1);
  }, []);

  // Reload events when activeSection is 'events' or filters change
  useEffect(() => {
    if (activeSection === 'events') {
      loadAdminEvents(eventCurrentPage);
    }
  }, [activeSection, eventCurrentPage, eventDistrictFilter, eventTypeFilter, eventStatusFilter]);

  const handleEventSearchSubmit = (e) => {
    e.preventDefault();
    setEventCurrentPage(1);
    loadAdminEvents(1);
  };

  const handleOpenCreateEventModal = () => {
    setEditingEventId(null);
    setEventFormData(initialEventForm);
    setEventFormError('');
    setIsEventModalOpen(true);
  };

  const handleOpenEditEventModal = (ev) => {
    setEditingEventId(ev.id);
    const dateFormatted = ev.event_date ? ev.event_date.split('T')[0] : '';
    setEventFormData({
      title: ev.title || '',
      title_kn: ev.title_kn || '',
      event_type: ev.event_type || 'Mega Job Mela',
      district: ev.district || 'Tumakuru',
      venue: ev.venue || '',
      venue_kn: ev.venue_kn || '',
      event_date: dateFormatted,
      start_time: ev.start_time || '9:30 AM',
      end_time: ev.end_time || '5:00 PM',
      companies_count: ev.companies_count || 45,
      expected_openings: ev.expected_openings || ev.vacancies_count || 1200,
      eligibility: ev.eligibility || 'All Degree Graduates',
      eligibility_kn: ev.eligibility_kn || 'ಎಲ್ಲಾ ಪದವೀಧರರು',
      batches_eligible: ev.batches_eligible || '2020 - 2026',
      description: ev.description || '',
      description_kn: ev.description_kn || '',
      entry_badge: ev.entry_badge || 'Free E-Pass',
      banner_image: ev.banner_image || '',
      is_featured: ev.is_featured === 1 || ev.is_featured === true,
      status: ev.status || 'Upcoming'
    });
    setEventFormError('');
    setIsEventModalOpen(true);
  };

  const handleSubmitEventForm = async (e) => {
    e.preventDefault();
    setEventFormError('');

    if (!eventFormData.title.trim() || !eventFormData.district || !eventFormData.venue.trim() || !eventFormData.event_date) {
      setEventFormError('Please fill in Event Title, District, Venue, and Event Date.');
      return;
    }

    try {
      setIsEventSubmitting(true);
      if (editingEventId) {
        await authFetch(`/api/admin/events/${editingEventId}`, {
          method: 'PUT',
          body: JSON.stringify(eventFormData)
        });
      } else {
        await authFetch('/api/admin/events', {
          method: 'POST',
          body: JSON.stringify(eventFormData)
        });
      }

      setIsEventModalOpen(false);
      loadAdminEvents(eventCurrentPage);
    } catch (err) {
      console.error('Save Event Error:', err);
      setEventFormError(err.message || 'Failed to save event.');
    } finally {
      setIsEventSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete event "${title}"?\nAll associated entry pass registrations will also be removed.`)) {
      return;
    }

    try {
      await authFetch(`/api/admin/events/${id}`, { method: 'DELETE' });
      loadAdminEvents(eventCurrentPage);
    } catch (err) {
      alert(err.message || 'Failed to delete event.');
    }
  };

  // Attendee Roster Functions
  const handleOpenAttendeeRoster = (ev) => {
    setRosterEvent(ev);
    setRosterSearch('');
    setRosterStatus('all');
    setRosterPage(1);
    loadRosterAttendees(ev.id, 1, '', 'all');
  };

  const loadRosterAttendees = async (eventId, page = 1, search = rosterSearch, status = rosterStatus) => {
    try {
      setRosterLoading(true);
      let url = `/api/admin/events/${eventId}/attendees?page=${page}&limit=10&`;
      if (search.trim()) url += `search=${encodeURIComponent(search.trim())}&`;
      if (status !== 'all') url += `status=${encodeURIComponent(status)}&`;

      const res = await authFetch(url);
      setRosterAttendees(res.data || []);
      setRosterTotal(res.total || 0);
      setRosterTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Load Roster Error:', err);
    } finally {
      setRosterLoading(false);
    }
  };

  const handleUpdateAttendeeStatus = async (regId, newStatus) => {
    try {
      await authFetch(`/api/admin/event-registrations/${regId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      setRosterAttendees((prev) =>
        prev.map((a) => (a.id === regId ? { ...a, attendance_status: newStatus } : a))
      );
    } catch (err) {
      alert(err.message || 'Failed to update attendance status.');
    }
  };

  const handleExportRosterCsv = (eventId, eventTitle) => {
    if (!rosterAttendees || rosterAttendees.length === 0) {
      alert('No attendees registered for this event yet.');
      return;
    }

    const headers = ['Pass Token', 'Full Name', 'Mobile', 'Email', 'Education', 'Stream', 'Passout Year', 'District', 'Employment Status', 'Attendance Status', 'Registration Date'];
    const rows = rosterAttendees.map((a) => [
      `"${a.pass_token || ''}"`,
      `"${(a.full_name || '').replace(/"/g, '""')}"`,
      `"${a.mobile || ''}"`,
      `"${a.email || ''}"`,
      `"${a.education || ''}"`,
      `"${a.stream || ''}"`,
      `"${a.passout_year || ''}"`,
      `"${a.district || ''}"`,
      `"${a.employment_status || ''}"`,
      `"${a.attendance_status || 'Registered'}"`,
      `"${a.created_at ? new Date(a.created_at).toLocaleString('en-IN') : ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${(eventTitle || 'Event').replace(/[^a-zA-Z0-9]/g, '_')}_Attendees_Page${rosterPage}.csv`);
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
              src="/images/new_Images/Candidate Avatar.png"
              alt="K.M. Suresh MLC Candidate"
              className={styles.mlcAvatar}
              onError={(e) => {
                e.currentTarget.src = '/images/new_Images/Candidate Profile Namaste1.png';
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
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${activeSection === 'events' ? styles.navItemActive : ''}`}
              onClick={() => {
                setActiveSection('events');
                setIsSidebarOpen(false);
              }}
            >
              <span className={`material-symbols-outlined ${styles.navIcon}`}>event_available</span>
              <span>Job Melas & Bootcamps</span>
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
          ) : activeSection === 'helpdesk' ? (
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
          ) : activeSection === 'events' ? (
            <>
              {/* Job Melas & Skill Bootcamps Toolbar */}
              <div className={styles.referenceToolbar}>
                <div className={styles.toolbarTitleGroup}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <h1 className={styles.portalTitle}>Job Melas & Bootcamps</h1>
                    <span className={styles.navBadge} style={{ fontSize: '11px', padding: '0.2rem 0.6rem', background: '#ea580c' }}>
                      {totalAdminEvents} Scheduled Drives
                    </span>
                  </div>

                  {/* Status Pill Tabs [ALL] [UPCOMING] [ONGOING] [COMPLETED] */}
                  <div className={styles.statusPillTabs}>
                    <button
                      type="button"
                      className={`${styles.pillTabBtn} ${eventStatusFilter === 'all' ? styles.pillTabActive : ''}`}
                      onClick={() => { setEventStatusFilter('all'); setEventCurrentPage(1); }}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      className={`${styles.pillTabBtn} ${eventStatusFilter === 'Upcoming' ? styles.pillTabActive : ''}`}
                      onClick={() => { setEventStatusFilter('Upcoming'); setEventCurrentPage(1); }}
                    >
                      Upcoming
                    </button>
                    <button
                      type="button"
                      className={`${styles.pillTabBtn} ${eventStatusFilter === 'Ongoing' ? styles.pillTabActive : ''}`}
                      onClick={() => { setEventStatusFilter('Ongoing'); setEventCurrentPage(1); }}
                    >
                      Ongoing
                    </button>
                    <button
                      type="button"
                      className={`${styles.pillTabBtn} ${eventStatusFilter === 'Completed' ? styles.pillTabActive : ''}`}
                      onClick={() => { setEventStatusFilter('Completed'); setEventCurrentPage(1); }}
                    >
                      Completed
                    </button>
                  </div>
                </div>

                <div className={styles.toolbarRightControls}>
                  {/* Search: query params passed to API */}
                  <form onSubmit={handleEventSearchSubmit} className={styles.compactSearchBox}>
                    <span className={`material-symbols-outlined ${styles.compactSearchIcon}`}>search</span>
                    <input
                      type="text"
                      className={styles.compactSearchInput}
                      placeholder="Search title, venue, district..."
                      value={eventSearchQuery}
                      onChange={(e) => setEventSearchQuery(e.target.value)}
                    />
                  </form>

                  {/* District Filter (Constituency & Karnataka) */}
                  <div className={styles.districtFilterBtn}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#64748b' }}>location_on</span>
                    <select
                      className={styles.districtSelect}
                      value={eventDistrictFilter}
                      onChange={(e) => {
                        setEventDistrictFilter(e.target.value);
                        setEventCurrentPage(1);
                      }}
                    >
                      <option value="all">All Districts</option>
                      {karnatakaDistrictsList.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Type Filter */}
                  <div className={styles.districtFilterBtn}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#64748b' }}>category</span>
                    <select
                      className={styles.districtSelect}
                      value={eventTypeFilter}
                      onChange={(e) => {
                        setEventTypeFilter(e.target.value);
                        setEventCurrentPage(1);
                      }}
                    >
                      <option value="all">All Types</option>
                      <option value="Mega Job Mela">Mega Job Mela</option>
                      <option value="Skill Bootcamp">Skill Bootcamp</option>
                      <option value="Career Masterclass">Career Masterclass</option>
                    </select>
                  </div>

                  {/* + New Event Button */}
                  <button
                    type="button"
                    className={styles.createJobBtn}
                    onClick={handleOpenCreateEventModal}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                    <span>Create Event</span>
                  </button>
                </div>
              </div>

              {/* Events Container Card */}
              <div className={styles.tableContainerCard}>
                <div className={styles.tableScrollWrapper}>
                  <table className={styles.compactTable}>
                    <thead>
                      <tr>
                        <th>Code / ID</th>
                        <th>Event Title & Theme</th>
                        <th>Category</th>
                        <th>District & Venue</th>
                        <th>Event Date</th>
                        <th>Recruiters & Openings</th>
                        <th>Registrations</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventsLoading ? (
                        <tr>
                          <td colSpan="9" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                            Loading scheduled events & drives...
                          </td>
                        </tr>
                      ) : adminEvents.length === 0 ? (
                        <tr>
                          <td colSpan="9" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                            No events or bootcamps found matching your filter criteria.
                          </td>
                        </tr>
                      ) : (
                        adminEvents.map((ev) => (
                          <tr key={ev.id}>
                            <td>
                              <span className={styles.idCell} style={{ color: '#0369a1', fontWeight: 600 }}>
                                {ev.event_code || `#EV-${ev.id}`}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{ev.title}</span>
                                  {(ev.is_featured === 1 || ev.is_featured === true) && (
                                    <span style={{
                                      background: '#fef3c7',
                                      color: '#92400e',
                                      border: '1px solid #fde68a',
                                      fontSize: '9px',
                                      fontWeight: 800,
                                      padding: '0.1rem 0.35rem',
                                      borderRadius: '4px'
                                    }}>
                                      ★ Featured
                                    </span>
                                  )}
                                </div>
                                {ev.title_kn && (
                                  <span style={{ fontSize: '10px', color: '#64748b' }}>{ev.title_kn}</span>
                                )}
                              </div>
                            </td>
                            <td>
                              <span className={styles.courseBadge} style={{
                                background: ev.event_type === 'Skill Bootcamp' ? '#f0fdf4' : '#fff7ed',
                                color: ev.event_type === 'Skill Bootcamp' ? '#166534' : '#9a3412',
                                borderColor: ev.event_type === 'Skill Bootcamp' ? '#bbf7d0' : '#fed7aa'
                              }}>
                                {ev.event_type || 'Job Mela'}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className={styles.districtPillBadge} style={{ width: 'fit-content' }}>
                                  {ev.district}
                                </span>
                                <span style={{ fontSize: '10px', color: '#64748b', marginTop: '0.2rem', maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={ev.venue}>
                                  {ev.venue}
                                </span>
                              </div>
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>
                                  {ev.event_date ? new Date(ev.event_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'TBD'}
                                </span>
                                <span style={{ fontSize: '10px', color: '#64748b' }}>
                                  {ev.start_time || '9:30 AM'}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column', fontSize: '10px', color: '#334155' }}>
                                <span><strong>{ev.companies_count || 0}</strong> Companies</span>
                                <span style={{ color: '#059669' }}><strong>{ev.expected_openings || ev.vacancies_count || 0}</strong> Openings</span>
                              </div>
                            </td>
                            <td>
                              <button
                                type="button"
                                onClick={() => handleOpenAttendeeRoster(ev)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  background: '#f0f9ff',
                                  border: '1px solid #bae6fd',
                                  color: '#0284c7',
                                  padding: '0.3rem 0.6rem',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                                title="Click to view candidate attendee roster"
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>groups</span>
                                <span>{ev.registrations_count || 0} Passes</span>
                              </button>
                            </td>
                            <td>
                              {ev.status === 'Ongoing' ? (
                                <span className={styles.badgeVerified}>
                                  <span className={styles.statusDotGreen}></span> Ongoing
                                </span>
                              ) : ev.status === 'Completed' ? (
                                <span className={styles.badgeUnverified}>
                                  <span className={styles.statusDotGray}></span> Completed
                                </span>
                              ) : (
                                <span className={styles.badgeVerified} style={{ background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}>
                                  <span className={styles.statusDotGreen} style={{ background: '#3b82f6' }}></span> Upcoming
                                </span>
                              )}
                            </td>
                            <td>
                              <div className={styles.actionIconsGroup} style={{ justifyContent: 'flex-end' }}>
                                <button
                                  type="button"
                                  className={styles.actionIconBtn}
                                  onClick={() => handleOpenAttendeeRoster(ev)}
                                  title="View Registered Candidates Roster"
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>group</span>
                                </button>
                                <button
                                  type="button"
                                  className={styles.actionIconBtn}
                                  onClick={() => handleOpenEditEventModal(ev)}
                                  title="Edit Event Details"
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>edit</span>
                                </button>
                                <button
                                  type="button"
                                  className={`${styles.actionIconBtn} ${styles.actionIconBtnDanger}`}
                                  onClick={() => handleDeleteEvent(ev.id, ev.title)}
                                  title="Delete Event"
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

                {/* Mobile Cards for Phones */}
                <div className={styles.mobileCardsContainer}>
                  {adminEvents.map((ev) => (
                    <div key={ev.id} className={styles.mobileGradCard}>
                      <div className={styles.mobileCardTop}>
                        <div>
                          <div className={styles.candidateNameCell}>
                            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '13px' }}>{ev.title}</span>
                          </div>
                          <span style={{ fontSize: '10px', color: '#0369a1', fontFamily: 'monospace' }}>
                            {ev.event_code || `#EV-${ev.id}`}
                          </span>
                        </div>
                        <span className={styles.districtPillBadge}>{ev.district}</span>
                      </div>

                      <div className={styles.mobileCardMetaGrid}>
                        <div className={styles.mobileMetaItem}>
                          <span className={styles.mobileMetaLabel}>Category</span>
                          <span className={styles.mobileMetaValue}>{ev.event_type || 'Job Mela'}</span>
                        </div>
                        <div className={styles.mobileMetaItem}>
                          <span className={styles.mobileMetaLabel}>Event Date</span>
                          <span className={styles.mobileMetaValue}>
                            {ev.event_date ? new Date(ev.event_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'TBD'}
                          </span>
                        </div>
                        <div className={styles.mobileMetaItem}>
                          <span className={styles.mobileMetaLabel}>Recruiters</span>
                          <span className={styles.mobileMetaValue}>{ev.companies_count || 0} Companies</span>
                        </div>
                        <div className={styles.mobileMetaItem}>
                          <span className={styles.mobileMetaLabel}>Passes Issued</span>
                          <span className={styles.mobileMetaValue} style={{ color: '#0284c7', fontWeight: 700 }}>
                            {ev.registrations_count || 0} Candidates
                          </span>
                        </div>
                      </div>

                      <div className={styles.mobileCardBottom}>
                        <button
                          type="button"
                          onClick={() => handleOpenAttendeeRoster(ev)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            background: '#f0f9ff',
                            border: '1px solid #bae6fd',
                            color: '#0284c7',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>groups</span>
                          <span>Attendees ({ev.registrations_count || 0})</span>
                        </button>

                        <div className={styles.actionIconsGroup}>
                          <button
                            type="button"
                            className={styles.actionIconBtn}
                            onClick={() => handleOpenEditEventModal(ev)}
                            title="Edit"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>edit</span>
                          </button>
                          <button
                            type="button"
                            className={`${styles.actionIconBtn} ${styles.actionIconBtnDanger}`}
                            onClick={() => handleDeleteEvent(ev.id, ev.title)}
                            title="Delete"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Table Footer: Results & Pagination */}
                <div className={styles.paginationBar}>
                  <div className={styles.showingResultsText}>
                    Showing {totalAdminEvents > 0 ? (eventCurrentPage - 1) * 10 + 1 : 0}-{Math.min(eventCurrentPage * 10, totalAdminEvents)} of {totalAdminEvents} events
                  </div>

                  {eventTotalPages > 1 && (
                    <div className={styles.paginationControls}>
                      <button
                        type="button"
                        className={styles.pageNavTextBtn}
                        onClick={() => setEventCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={eventCurrentPage <= 1}
                      >
                        Previous
                      </button>

                      {Array.from({ length: Math.min(eventTotalPages, 7) }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          className={`${styles.pageChip} ${eventCurrentPage === pageNum ? styles.pageChipActive : ''}`}
                          onClick={() => setEventCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        type="button"
                        className={styles.pageNavTextBtn}
                        onClick={() => setEventCurrentPage((p) => Math.min(eventTotalPages, p + 1))}
                        disabled={eventCurrentPage >= eventTotalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}
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

      {/* 7. Create / Edit Job Mela & Bootcamp Modal */}
      {isEventModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsEventModalOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <span className="material-symbols-outlined" style={{ color: '#0284c7' }}>
                  {editingEventId ? 'edit_calendar' : 'event_available'}
                </span>
                <span>{editingEventId ? 'Edit Event / Job Mela' : 'Create Job Mela / Skill Bootcamp'}</span>
              </div>
              <button
                type="button"
                className={styles.closeModalBtn}
                onClick={() => setIsEventModalOpen(false)}
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
              </button>
            </div>

            <form className={styles.modalForm} onSubmit={handleSubmitEventForm}>
              <div className={styles.modalBody}>
                {eventFormError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.6rem 0.85rem', borderRadius: '8px', fontSize: '11px', fontWeight: 500, marginBottom: '1rem' }}>
                    {eventFormError}
                  </div>
                )}

                <div className={styles.formGrid}>
                  {/* Event Title (English) */}
                  <div className={`${styles.formField} ${styles.formColFull}`}>
                    <label className={styles.formLabel}>Event Title (English) *</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. Kolar Aerospace & Precision Engineering Hiring Fair"
                      value={eventFormData.title}
                      onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                      required
                    />
                  </div>

                  {/* Event Title (Kannada) */}
                  <div className={`${styles.formField} ${styles.formColFull}`}>
                    <label className={styles.formLabel}>Event Title (Kannada / ಕನ್ನಡ)</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="ಉದಾ: ಕೋಲಾರ ಏರೋಸ್ಪೇಸ್ & ಪ್ರಿಸಿಷನ್ ಇಂಜಿನಿಯರಿಂಗ್ ನೇಮಕಾತಿ ಮೇಳ"
                      value={eventFormData.title_kn}
                      onChange={(e) => setEventFormData({ ...eventFormData, title_kn: e.target.value })}
                    />
                  </div>

                  {/* Event Category */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Event Type / Category *</label>
                    <select
                      className={styles.formSelectInput}
                      value={eventFormData.event_type}
                      onChange={(e) => setEventFormData({ ...eventFormData, event_type: e.target.value })}
                    >
                      <option value="Mega Job Mela">Mega Job Mela</option>
                      <option value="Skill Bootcamp">Skill Bootcamp</option>
                      <option value="Career Masterclass">Career Masterclass</option>
                    </select>
                  </div>

                  {/* District */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Constituency District *</label>
                    <select
                      className={styles.formSelectInput}
                      value={eventFormData.district}
                      onChange={(e) => setEventFormData({ ...eventFormData, district: e.target.value })}
                    >
                      {karnatakaDistrictsList.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Venue (English) */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Campus Venue (English) *</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. Government Boys College Grounds, MB Road, Kolar"
                      value={eventFormData.venue}
                      onChange={(e) => setEventFormData({ ...eventFormData, venue: e.target.value })}
                      required
                    />
                  </div>

                  {/* Venue (Kannada) */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Campus Venue (Kannada / ಕನ್ನಡ)</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="ಉದಾ: ಸರ್ಕಾರಿ ಬಾಲಕರ ಕಾಲೇಜು ಆವರಣ, ಕೋಲಾರ"
                      value={eventFormData.venue_kn}
                      onChange={(e) => setEventFormData({ ...eventFormData, venue_kn: e.target.value })}
                    />
                  </div>

                  {/* Event Date */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Event Date *</label>
                    <input
                      type="date"
                      className={styles.formInput}
                      value={eventFormData.event_date}
                      onChange={(e) => setEventFormData({ ...eventFormData, event_date: e.target.value })}
                      required
                    />
                  </div>

                  {/* Timing */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Timing (Start & End Time)</label>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="9:30 AM"
                        value={eventFormData.start_time}
                        onChange={(e) => setEventFormData({ ...eventFormData, start_time: e.target.value })}
                      />
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="5:00 PM"
                        value={eventFormData.end_time}
                        onChange={(e) => setEventFormData({ ...eventFormData, end_time: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Companies Count */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Participating Recruiters Count</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      placeholder="e.g. 45"
                      value={eventFormData.companies_count}
                      onChange={(e) => setEventFormData({ ...eventFormData, companies_count: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>

                  {/* Expected Openings */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Expected Openings Count</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      placeholder="e.g. 1200"
                      value={eventFormData.expected_openings}
                      onChange={(e) => setEventFormData({ ...eventFormData, expected_openings: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>

                  {/* Eligibility Degrees */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Eligible Degrees</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. BE, Diploma, ITI, B.Sc"
                      value={eventFormData.eligibility}
                      onChange={(e) => setEventFormData({ ...eventFormData, eligibility: e.target.value })}
                    />
                  </div>

                  {/* Batches Eligible */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Passing Batches</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. 2020 - 2026 Passouts"
                      value={eventFormData.batches_eligible}
                      onChange={(e) => setEventFormData({ ...eventFormData, batches_eligible: e.target.value })}
                    />
                  </div>

                  {/* Publishing Status */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Status</label>
                    <select
                      className={styles.formSelectInput}
                      value={eventFormData.status}
                      onChange={(e) => setEventFormData({ ...eventFormData, status: e.target.value })}
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Featured on Banner */}
                  <div className={styles.formField} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.25rem' }}>
                    <input
                      type="checkbox"
                      id="is_featured_chk"
                      checked={eventFormData.is_featured}
                      onChange={(e) => setEventFormData({ ...eventFormData, is_featured: e.target.checked })}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <label htmlFor="is_featured_chk" style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
                      Highlight as Main Featured Fair on Homepage Banner
                    </label>
                  </div>

                  {/* Description (English) */}
                  <div className={`${styles.formField} ${styles.formColFull}`}>
                    <label className={styles.formLabel}>Event Description & Highlights (English)</label>
                    <textarea
                      className={styles.formTextarea}
                      placeholder="Details on visiting companies, spot interview rounds, requirements..."
                      value={eventFormData.description}
                      onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                    />
                  </div>

                  {/* Description (Kannada) */}
                  <div className={`${styles.formField} ${styles.formColFull}`}>
                    <label className={styles.formLabel}>Event Description (Kannada / ಕನ್ನಡ)</label>
                    <textarea
                      className={styles.formTextarea}
                      placeholder="ಕಾರ್ಯಕ್ರಮದ ವಿವರಗಳು ಮತ್ತು ಸೂಚನೆಗಳು..."
                      value={eventFormData.description_kn}
                      onChange={(e) => setEventFormData({ ...eventFormData, description_kn: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsEventModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitJobBtn}
                  disabled={isEventSubmitting}
                >
                  {isEventSubmitting ? 'Saving...' : editingEventId ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Event Attendee Roster Modal */}
      {rosterEvent && (
        <div className={styles.modalBackdrop} onClick={() => setRosterEvent(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '920px' }}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <span className="material-symbols-outlined" style={{ color: '#0284c7' }}>groups</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px' }}>
                    Attendee Roster — {rosterEvent.title}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 500 }}>
                    {rosterTotal} candidates registered for digital entry pass • {rosterEvent.event_code}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className={styles.closeModalBtn}
                onClick={() => setRosterEvent(null)}
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
              </button>
            </div>

            <div className={styles.modalBody} style={{ padding: '1rem' }}>
              {/* Roster Controls: Search, Status Filter, Export CSV */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setRosterPage(1);
                      loadRosterAttendees(rosterEvent.id, 1, rosterSearch, rosterStatus);
                    }}
                    className={styles.compactSearchBox}
                  >
                    <span className={`material-symbols-outlined ${styles.compactSearchIcon}`}>search</span>
                    <input
                      type="text"
                      className={styles.compactSearchInput}
                      placeholder="Search name, phone, pass token..."
                      value={rosterSearch}
                      onChange={(e) => setRosterSearch(e.target.value)}
                    />
                  </form>

                  <div className={styles.districtFilterBtn}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#64748b' }}>how_to_reg</span>
                    <select
                      className={styles.districtSelect}
                      value={rosterStatus}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRosterStatus(val);
                        setRosterPage(1);
                        loadRosterAttendees(rosterEvent.id, 1, rosterSearch, val);
                      }}
                    >
                      <option value="all">All Attendance</option>
                      <option value="Registered">Registered</option>
                      <option value="Attended">Attended</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.exportCsvBtn}
                  onClick={() => handleExportRosterCsv(rosterEvent.id, rosterEvent.title)}
                  title="Export attendee roster to CSV"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>download</span>
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Attendees Compact Table */}
              {/* Desktop Roster Table (screens >= 768px) */}
              <div className={styles.rosterDesktopTable} style={{ maxHeight: '380px' }}>
                <table className={styles.compactTable}>
                  <thead>
                    <tr>
                      <th>Pass Token</th>
                      <th>Candidate Name</th>
                      <th>WhatsApp Mobile</th>
                      <th>Education & Stream</th>
                      <th>District</th>
                      <th>Attendance Status</th>
                      <th>Registered On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rosterLoading ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                          Loading attendee records...
                        </td>
                      </tr>
                    ) : rosterAttendees.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                          No registered candidates found for this drive.
                        </td>
                      </tr>
                    ) : (
                      rosterAttendees.map((att) => (
                        <tr key={att.id}>
                          <td>
                            <span className={styles.idCell} style={{ fontFamily: 'monospace', color: '#0369a1', fontWeight: 700 }}>
                              {att.pass_token}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600, color: '#0f172a' }}>{att.full_name}</span>
                          </td>
                          <td>
                            <div className={styles.contactPhoneWrap}>
                              <span style={{ fontWeight: 500 }}>{att.mobile}</span>
                              <a
                                href={`https://wa.me/91${att.mobile.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${att.full_name}, regarding your Free Entry Pass #${att.pass_token} for ${rosterEvent.title}...`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.whatsappActionLink}
                                title={`Chat with ${att.full_name} on WhatsApp`}
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>chat</span>
                              </a>
                              <a
                                href={`tel:${att.mobile}`}
                                className={styles.callActionLink}
                                title={`Call ${att.full_name}`}
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>call</span>
                              </a>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: 500, color: '#0f172a' }}>{att.education}</span>
                              <span style={{ fontSize: '10px', color: '#64748b' }}>
                                {att.stream || 'General'} • {att.passout_year}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className={styles.districtPillBadge}>{att.district}</span>
                          </td>
                          <td>
                            <select
                              className={styles.statusSelectInline}
                              value={att.attendance_status || 'Registered'}
                              onChange={(e) => handleUpdateAttendeeStatus(att.id, e.target.value)}
                              style={{
                                fontWeight: 600,
                                color: att.attendance_status === 'Attended' ? '#166534' : att.attendance_status === 'Shortlisted' ? '#92400e' : '#0369a1'
                              }}
                            >
                              <option value="Registered">🟡 Registered</option>
                              <option value="Attended">🟢 Attended</option>
                              <option value="Shortlisted">⭐ Shortlisted</option>
                              <option value="Absent">⚪ Absent</option>
                            </select>
                          </td>
                          <td style={{ color: '#64748b', fontSize: '10px', whiteSpace: 'nowrap' }}>
                            {att.created_at ? new Date(att.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Attendee Cards (screens < 768px) */}
              <div className={styles.rosterMobileCards}>
                {rosterLoading ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b' }}>
                    Loading attendee records...
                  </div>
                ) : rosterAttendees.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b' }}>
                    No registered candidates found for this drive.
                  </div>
                ) : (
                  rosterAttendees.map((att) => (
                    <div key={att.id} className={styles.rosterCandidateCard}>
                      <div className={styles.rosterCardTop}>
                        <span className={styles.rosterCardName}>{att.full_name}</span>
                        <span className={styles.rosterCardPassToken}>{att.pass_token}</span>
                      </div>

                      <div className={styles.rosterCardMeta}>
                        <span>🎓 {att.education} ({att.stream || 'General'} • {att.passout_year})</span>
                        <span className={styles.districtPillBadge}>{att.district}</span>
                      </div>

                      <div className={styles.rosterCardActions}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '11px', color: '#0f172a' }}>{att.mobile}</span>
                          <a
                            href={`https://wa.me/91${att.mobile.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${att.full_name}, regarding your Free Entry Pass #${att.pass_token} for ${rosterEvent.title}...`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.whatsappActionLink}
                            title="Chat on WhatsApp"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>chat</span>
                          </a>
                          <a
                            href={`tel:${att.mobile}`}
                            className={styles.callActionLink}
                            title="Call"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>call</span>
                          </a>
                        </div>

                        <select
                          className={styles.statusSelectInline}
                          value={att.attendance_status || 'Registered'}
                          onChange={(e) => handleUpdateAttendeeStatus(att.id, e.target.value)}
                          style={{
                            fontWeight: 700,
                            fontSize: '11px',
                            color: att.attendance_status === 'Attended' ? '#166534' : att.attendance_status === 'Shortlisted' ? '#92400e' : '#0369a1'
                          }}
                        >
                          <option value="Registered">🟡 Registered</option>
                          <option value="Attended">🟢 Attended</option>
                          <option value="Shortlisted">⭐ Shortlisted</option>
                          <option value="Absent">⚪ Absent</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Roster Pagination */}
              {rosterTotalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>
                    Page {rosterPage} of {rosterTotalPages} ({rosterTotal} candidates)
                  </span>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      type="button"
                      className={styles.pageNavTextBtn}
                      onClick={() => {
                        const nextP = Math.max(1, rosterPage - 1);
                        setRosterPage(nextP);
                        loadRosterAttendees(rosterEvent.id, nextP, rosterSearch, rosterStatus);
                      }}
                      disabled={rosterPage <= 1}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className={styles.pageNavTextBtn}
                      onClick={() => {
                        const nextP = Math.min(rosterTotalPages, rosterPage + 1);
                        setRosterPage(nextP);
                        loadRosterAttendees(rosterEvent.id, nextP, rosterSearch, rosterStatus);
                      }}
                      disabled={rosterPage >= rosterTotalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setRosterEvent(null)}
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
