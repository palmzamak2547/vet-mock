// The URL is the shelf's current selection. An incoming course is only a
// fallback for a fresh /app/videos navigation without a subject query.
export function videoSubjectForNavigation(search, incomingSubject, availableSubjects) {
  const params = new URLSearchParams(search);
  const candidate = params.has('subject') ? params.get('subject') : incomingSubject;
  return availableSubjects.has(candidate) ? candidate : 'all';
}

export function videoSubjectNavigation(href, state, subject) {
  const url = new URL(href);
  if (url.pathname.replace(/\/+$/, '') !== '/app/videos') return null;
  if (subject === 'all') url.searchParams.delete('subject');
  else url.searchParams.set('subject', subject);
  return {
    url,
    // Replace the incoming course too: after choosing All, Back must not
    // revive an old incoming course just because its query is now absent.
    state: { ...state, vmxVideoSubject: subject === 'all' ? null : subject },
  };
}
