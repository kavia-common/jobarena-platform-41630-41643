import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { useJobsSearch } from './hooks/useJobsSearch';
import { SearchBar } from './components/SearchBar';
import { FiltersSidebar } from './components/FiltersSidebar';
import { JobList } from './components/JobList';
import { JobDetailPanel } from './components/JobDetailPanel';
import { Modal } from './components/Modal';
import { ApplyModal } from './components/ApplyModal';

/**
 * @param {number} maxWidth
 */
function useIsSmallScreen(maxWidth) {
  const [isSmall, setIsSmall] = useState(() => window.matchMedia(`(max-width: ${maxWidth}px)`).matches);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const handler = () => setIsSmall(mql.matches);

    // Safari <14 doesn't support addEventListener on MediaQueryList
    if (typeof mql.addEventListener === 'function') mql.addEventListener('change', handler);
    else mql.addListener(handler);

    return () => {
      if (typeof mql.removeEventListener === 'function') mql.removeEventListener('change', handler);
      else mql.removeListener(handler);
    };
  }, [maxWidth]);

  return isSmall;
}

// PUBLIC_INTERFACE
function App() {
  const { filters, setFilters, jobs, mode, status, error } = useJobsSearch();

  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const isCompactDetail = useIsSmallScreen(1100);

  const selectedJob = useMemo(() => {
    return jobs.find((j) => j.id === selectedJobId) || null;
  }, [jobs, selectedJobId]);

  useEffect(() => {
    // If selected job disappears due to filtering, clear selection.
    if (selectedJobId && !selectedJob) setSelectedJobId(null);
  }, [selectedJobId, selectedJob]);

  function onSelectJob(job) {
    setSelectedJobId(job.id);
    if (isCompactDetail) setIsDetailModalOpen(true);
  }

  function resetFilters() {
    setFilters({
      query: '',
      locations: [],
      jobTypes: [],
      experienceLevels: [],
    });
  }

  const footerHint = mode.isMock
    ? 'Demo mode: using mock jobs because REACT_APP_API_BASE / REACT_APP_BACKEND_URL is not set.'
    : `Connected to API: ${mode.baseUrl}`;

  return (
    <div className="App">
      <div className="ja-shell">
        <header className="ja-topbar">
          <div className="ja-topbar__inner">
            <div className="ja-brand" aria-label="Jobarena">
              <div className="ja-brand__name">Jobarena</div>
              <div className="ja-brand__tagline">Search • Filter • Apply</div>
            </div>

            <SearchBar
              query={filters.query}
              onQueryChange={(v) => setFilters({ ...filters, query: v })}
              onClear={() => setFilters({ ...filters, query: '' })}
            />
          </div>
        </header>

        <main className="ja-content" aria-label="Job search layout">
          <FiltersSidebar
            jobs={jobs}
            filters={filters}
            onChange={(next) => setFilters(next)}
            onReset={resetFilters}
          />

          <JobList
            jobs={jobs}
            selectedJobId={selectedJobId}
            onSelect={onSelectJob}
            status={status}
            error={error}
          />

          <JobDetailPanel job={selectedJob} onApply={() => setIsApplyOpen(true)} />
        </main>

        <div className="ja-footerHint" aria-live="polite">
          {footerHint}
        </div>

        {/* Small-screen job details modal */}
        <Modal
          isOpen={isDetailModalOpen && Boolean(selectedJob)}
          title={selectedJob ? `${selectedJob.title} — ${selectedJob.company}` : 'Job details'}
          onClose={() => setIsDetailModalOpen(false)}
          size="lg"
          footer={null}
        >
          <JobDetailPanel
            job={selectedJob}
            onApply={() => setIsApplyOpen(true)}
            onClose={() => setIsDetailModalOpen(false)}
            isCompact
          />
        </Modal>

        {/* Apply flow */}
        <ApplyModal
          isOpen={isApplyOpen}
          job={selectedJob}
          onClose={() => setIsApplyOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;
