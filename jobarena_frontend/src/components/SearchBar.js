import React from 'react';
import { Button } from './Button';

/**
 * @param {{
 *  query: string;
 *  onQueryChange: (v: string) => void;
 *  onClear: () => void;
 * }} props
 */
export function SearchBar({ query, onQueryChange, onClear }) {
  return (
    <div className="ja-searchBar" role="search" aria-label="Job search">
      <div className="ja-searchBar__inputWrap">
        <label className="ja-srOnly" htmlFor="jobarena_search">
          Search jobs
        </label>
        <input
          id="jobarena_search"
          className="ja-searchInput"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by title, company, or skill (e.g., React, SQL)…"
          inputMode="search"
        />
      </div>

      <div className="ja-searchBar__actions">
        <Button variant="secondary" size="sm" onClick={onClear} disabled={!query.trim()}>
          Clear
        </Button>
      </div>
    </div>
  );
}
