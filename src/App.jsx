import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import LeadershipBanner from './components/LeadershipBanner/LeadershipBanner';
import OpportunityMatrix from './components/OpportunityMatrix/OpportunityMatrix';
import InitiativeProfile from './components/InitiativeProfile/InitiativeProfile';
import EventsSection from './components/EventsSection/EventsSection';
import VolunteerSection from './components/VolunteerSection/VolunteerSection';
import HelpdeskSection from './components/HelpdeskSection/HelpdeskSection';
import Footer from './components/Footer/Footer';
import EventPassModal from './components/Modals/EventPassModal';
import PledgeToast from './components/PledgeToast/PledgeToast';
import AdminPortal from './components/Admin/AdminPortal';
import JobsPortal from './components/JobsPortal/JobsPortal';
import GraduateRegistrationPage from './components/GraduateRegistrationPage/GraduateRegistrationPage';
import SkillsPortal from './components/SkillsPortal/SkillsPortal';
import ELibraryPortal from './components/ELibraryPortal/ELibraryPortal';
import SelfEmploymentPortal from './components/SelfEmploymentPortal/SelfEmploymentPortal';

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isPledgeToastOpen, setIsPledgeToastOpen] = useState(false);

  const handlePledgeSupport = () => {
    setIsPledgeToastOpen(true);
    try {
      localStorage.setItem('hasPledgedVote2026', 'true');
      fetch('/api/pledges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'Constituency Supporter',
          supportNote: 'Pledged vote for NDA 2026'
        })
      }).catch(() => {});
    } catch (_) {}
  };

  // Check if initial route is /admin or #admin
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.pathname.startsWith('/admin') || window.location.hash === '#admin';
  });

  // Check if initial route is /jobs or #jobs
  const [isJobsView, setIsJobsView] = useState(() => {
    return window.location.pathname.startsWith('/jobs') || window.location.hash === '#jobs';
  });

  // Check if initial route is /skills or #skills
  const [isSkillsView, setIsSkillsView] = useState(() => {
    return window.location.pathname.startsWith('/skills') || window.location.hash === '#skills';
  });

  // Check if initial route is /library or #library
  const [isLibraryView, setIsLibraryView] = useState(() => {
    return window.location.pathname.startsWith('/library') || window.location.hash === '#library' || window.location.hash === '#elibrary';
  });

  // Check if initial route is /register or #register
  const [isRegisterView, setIsRegisterView] = useState(() => {
    return window.location.pathname.startsWith('/register') || window.location.hash === '#register' || window.location.hash === '#registration';
  });

  // Check if initial route is /self-employment or #self-employment
  const [isSelfEmploymentView, setIsSelfEmploymentView] = useState(() => {
    return window.location.pathname.startsWith('/self-employment') || window.location.hash === '#self-employment' || window.location.hash === '#entrepreneurship' || window.location.hash === '#agriculture';
  });

  useEffect(() => {
    if (!selectedEvent && typeof document !== 'undefined' && document.body) {
      document.body.style.overflow = '';
    }
    const handleLocationChange = () => {
      const isNowAdmin = window.location.pathname.startsWith('/admin') || window.location.hash === '#admin';
      const isNowJobs = window.location.pathname.startsWith('/jobs') || window.location.hash === '#jobs';
      const isNowSkills = window.location.pathname.startsWith('/skills') || window.location.hash === '#skills';
      const isNowLibrary = window.location.pathname.startsWith('/library') || window.location.hash === '#library' || window.location.hash === '#elibrary';
      const isNowRegister = window.location.pathname.startsWith('/register') || window.location.hash === '#register' || window.location.hash === '#registration';
      const isNowSelfEmployment = window.location.pathname.startsWith('/self-employment') || window.location.hash === '#self-employment' || window.location.hash === '#entrepreneurship' || window.location.hash === '#agriculture';
      setIsAdminView(isNowAdmin);
      setIsJobsView(isNowJobs);
      setIsSkillsView(isNowSkills);
      setIsLibraryView(isNowLibrary);
      setIsRegisterView(isNowRegister);
      setIsSelfEmploymentView(isNowSelfEmployment);
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const openAdminView = () => {
    window.location.hash = 'admin';
    setIsAdminView(true);
    window.scrollTo(0, 0);
  };

  const closeAdminView = () => {
    window.location.hash = '';
    setIsAdminView(false);
    window.scrollTo(0, 0);
  };

  const openJobsView = () => {
    window.location.hash = 'jobs';
    setIsJobsView(true);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const closeJobsView = () => {
    window.location.hash = '';
    setIsJobsView(false);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const openSkillsView = () => {
    window.location.hash = 'skills';
    setIsSkillsView(true);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const closeSkillsView = () => {
    window.location.hash = '';
    setIsSkillsView(false);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const openLibraryView = () => {
    window.location.hash = 'library';
    setIsLibraryView(true);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const closeLibraryView = () => {
    window.location.hash = '';
    setIsLibraryView(false);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const openRegisterView = () => {
    window.location.hash = 'register';
    setIsRegisterView(true);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const closeRegisterView = () => {
    window.location.hash = '';
    setIsRegisterView(false);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const openSelfEmploymentView = () => {
    window.location.hash = 'self-employment';
    setIsSelfEmploymentView(true);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const closeSelfEmploymentView = () => {
    window.location.hash = '';
    setIsSelfEmploymentView(false);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  if (isAdminView) {
    return <AdminPortal onBackToPublic={closeAdminView} />;
  }

  if (isSelfEmploymentView) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header
          onOpenAdmin={openAdminView}
          onOpenJobs={openJobsView}
          onOpenSkills={openSkillsView}
          onOpenLibrary={openLibraryView}
          onOpenSelfEmployment={openSelfEmploymentView}
          onOpenRegister={openRegisterView}
          onBackToHome={closeSelfEmploymentView}
        />
        <main style={{ flex: 1 }}>
          <SelfEmploymentPortal
            onBackToHome={closeSelfEmploymentView}
            onOpenRegister={openRegisterView}
          />
        </main>
        <Footer
          onOpenAdmin={openAdminView}
          onOpenJobs={openJobsView}
          onOpenSkills={openSkillsView}
          onOpenLibrary={openLibraryView}
          onOpenSelfEmployment={openSelfEmploymentView}
          onOpenRegister={openRegisterView}
        />
      </div>
    );
  }

  if (isJobsView) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header
          onOpenAdmin={openAdminView}
          onOpenJobs={openJobsView}
          onOpenSkills={openSkillsView}
          onOpenLibrary={openLibraryView}
          onOpenSelfEmployment={openSelfEmploymentView}
          onOpenRegister={openRegisterView}
          onBackToHome={closeJobsView}
        />
        <main style={{ flex: 1 }}>
          <JobsPortal
            onBackToHome={closeJobsView}
            onOpenRegister={openRegisterView}
          />
        </main>
      </div>
    );
  }

  if (isSkillsView) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header
          onOpenAdmin={openAdminView}
          onOpenJobs={openJobsView}
          onOpenSkills={openSkillsView}
          onOpenLibrary={openLibraryView}
          onOpenSelfEmployment={openSelfEmploymentView}
          onOpenRegister={openRegisterView}
          onBackToHome={closeSkillsView}
        />
        <main style={{ flex: 1 }}>
          <SkillsPortal
            onBackToHome={closeSkillsView}
            onOpenRegister={openRegisterView}
            onOpenJobs={openJobsView}
          />
        </main>
        <Footer
          onOpenAdmin={openAdminView}
          onOpenJobs={openJobsView}
          onOpenSkills={openSkillsView}
          onOpenLibrary={openLibraryView}
          onOpenSelfEmployment={openSelfEmploymentView}
          onOpenRegister={openRegisterView}
        />
      </div>
    );
  }

  if (isLibraryView) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header
          onOpenAdmin={openAdminView}
          onOpenJobs={openJobsView}
          onOpenSkills={openSkillsView}
          onOpenLibrary={openLibraryView}
          onOpenSelfEmployment={openSelfEmploymentView}
          onOpenRegister={openRegisterView}
          onBackToHome={closeLibraryView}
        />
        <main style={{ flex: 1 }}>
          <ELibraryPortal
            onOpenRegister={openRegisterView}
            onOpenJobs={openJobsView}
          />
        </main>
        <Footer
          onOpenAdmin={openAdminView}
          onOpenJobs={openJobsView}
          onOpenSkills={openSkillsView}
          onOpenLibrary={openLibraryView}
          onOpenSelfEmployment={openSelfEmploymentView}
          onOpenRegister={openRegisterView}
        />
      </div>
    );
  }

  if (isRegisterView) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header
          onOpenAdmin={openAdminView}
          onOpenJobs={openJobsView}
          onOpenSkills={openSkillsView}
          onOpenLibrary={openLibraryView}
          onOpenSelfEmployment={openSelfEmploymentView}
          onOpenRegister={openRegisterView}
          onBackToHome={closeRegisterView}
        />
        <main style={{ flex: 1 }}>
          <GraduateRegistrationPage
            onBackToHome={closeRegisterView}
            onOpenJobs={openJobsView}
          />
        </main>
        <Footer
          onOpenAdmin={openAdminView}
          onOpenJobs={openJobsView}
          onOpenSkills={openSkillsView}
          onOpenLibrary={openLibraryView}
          onOpenSelfEmployment={openSelfEmploymentView}
          onOpenRegister={openRegisterView}
        />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Bilingual Switch & Navigation */}
      <Header
        onOpenAdmin={openAdminView}
        onOpenJobs={openJobsView}
        onOpenSkills={openSkillsView}
        onOpenLibrary={openLibraryView}
        onOpenSelfEmployment={openSelfEmploymentView}
        onOpenRegister={openRegisterView}
      />

      <main style={{ flex: 1 }}>
        {/* Hero Section with Candidate Spotlight & Call to Action */}
        <Hero onOpenPledgeModal={handlePledgeSupport} onOpenRegister={openRegisterView} />

        {/* PM Modi & NDA Leadership Vision Banner */}
        <LeadershipBanner
          onOpenPledgeModal={handlePledgeSupport}
          onOpenRegister={openRegisterView}
        />

        {/* Curated Career Drives, AI Skilling, Exams & Grants Matrix (Default 4, with Show More) */}
        <OpportunityMatrix
          onOpenJobs={openJobsView}
          onOpenSkills={openSkillsView}
          onOpenLibrary={openLibraryView}
          onOpenSelfEmployment={openSelfEmploymentView}
        />

        {/* Candidate Profile, Educational Track Record & 4-Pillar Manifesto */}
        <InitiativeProfile
          onOpenPledgeModal={handlePledgeSupport}
          onOpenRegister={openRegisterView}
        />

        {/* Upcoming Job Melas & District Sessions */}
        <EventsSection
          onSelectEvent={(ev) => setSelectedEvent(ev)}
        />

        {/* Dedicated Volunteer Taskforce & Vote Appeal Section */}
        <VolunteerSection onOpenPledgeModal={handlePledgeSupport} />

        {/* Constituency Helpdesk & Grievance Cell (Janaspanada) */}
        <HelpdeskSection />
      </main>

      {/* Site Footer */}
      <Footer
        onOpenAdmin={openAdminView}
        onOpenJobs={openJobsView}
        onOpenSkills={openSkillsView}
        onOpenLibrary={openLibraryView}
        onOpenSelfEmployment={openSelfEmploymentView}
        onOpenRegister={openRegisterView}
      />

      {/* Interactive Modals */}
      {selectedEvent && (
        <EventPassModal
          eventData={selectedEvent}
          onClose={() => {
            setSelectedEvent(null);
            if (typeof document !== 'undefined' && document.body) {
              document.body.style.overflow = '';
            }
          }}
        />
      )}

      {/* Floating Confirmation Toast for Vote Pledge (No intrusive popup) */}
      <PledgeToast
        isOpen={isPledgeToastOpen}
        onClose={() => setIsPledgeToastOpen(false)}
      />
    </div>
  );
}
