// One small stroke icon set (1.6 px on a 24 grid), drawn for this page.
const S = ({ children, size = 20, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    {children}
  </svg>
);

export const IconSend = (p) => <S {...p}><path d="M12 19V5" /><path d="M6 11l6-6 6 6" /></S>;
export const IconStop = (p) => <S {...p}><rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" stroke="none" /></S>;
export const IconPlus = (p) => <S {...p}><path d="M12 5v14M5 12h14" /></S>;
export const IconImage = (p) => <S {...p}><rect x="3.5" y="4.5" width="17" height="15" rx="3" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 16l-5-5-8 8.5" /></S>;
export const IconMic = (p) => <S {...p}><rect x="9" y="3.5" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21" /></S>;
export const IconClose = (p) => <S {...p}><path d="M6 6l12 12M18 6L6 18" /></S>;
export const IconHistory = (p) => <S {...p}><path d="M4 12a8 8 0 108-8 8 8 0 00-6.2 3" /><path d="M4 4v4h4" /><path d="M12 8v4l3 2" /></S>;
export const IconNew = (p) => <S {...p}><path d="M12 20h8" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></S>;
export const IconSun = (p) => <S {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" /></S>;
export const IconMoon = (p) => <S {...p}><path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" /></S>;
export const IconCopy = (p) => <S {...p}><rect x="8.5" y="8.5" width="11" height="11" rx="2.5" /><path d="M15.5 8.5V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7.5a2 2 0 002 2h2.5" /></S>;
export const IconCheck = (p) => <S {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></S>;
export const IconSpeaker = (p) => <S {...p}><path d="M4 10v4h3.5L12 18V6L7.5 10z" /><path d="M16 9a4.5 4.5 0 010 6M18.5 6.5a8 8 0 010 11" /></S>;
export const IconRetry = (p) => <S {...p}><path d="M20 12a8 8 0 11-2.4-5.7" /><path d="M20 4v5h-5" /></S>;
export const IconArrowOut = (p) => <S {...p}><path d="M8 16L16 8M9 8h7v7" /></S>;
export const IconTrash = (p) => <S {...p}><path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" /></S>;
export const IconDown = (p) => <S {...p}><path d="M12 5v14M6 13l6 6 6-6" /></S>;
export const IconShare = (p) => <S {...p}><path d="M12 15V3.5" /><path d="M7.5 8L12 3.5 16.5 8" /><path d="M5 12.5v5A2.5 2.5 0 007.5 20h9a2.5 2.5 0 002.5-2.5v-5" /></S>;
export const IconBook = (p) => <S {...p}><path d="M4 5.5A1.5 1.5 0 015.5 4H11v16H5.5A1.5 1.5 0 014 18.5zM20 5.5A1.5 1.5 0 0018.5 4H13v16h5.5a1.5 1.5 0 001.5-1.5z" /></S>;
