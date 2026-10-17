// The port the local e2e preview listens on, shared by playwright.config.js and the specs that
// build origins of their own (origin-move.spec.js), so the two can never disagree again: on
// 18 Oct the config moved and that spec kept the old port, and all 96 of its runs failed.
// It sits below every OS's ephemeral range (Linux 32768-60999, Windows and macOS 49152-65535):
// an outgoing connection can be handed any port inside that range, and on 17 Oct one held
// 41732 just as CI started a preview ("Port 41732 is already in use").
export const LOCAL_E2E_PORT = Number(process.env.PLAYWRIGHT_PORT || 24731);
