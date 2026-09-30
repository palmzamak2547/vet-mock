# Historical handoffs preserved on 2026-09-30

These are byte-for-byte snapshots, not current instructions or release status.
The two AGENTS copies share most history but retain different uncommitted lane
receipts. Neither copy replaces the other. Hashes and byte sizes are in
[manifest.json](manifest.json).

Paths inside snapshots were written relative to the repository root. Old
permission requests, scope precedence, worker activation rules, counts and
pending statuses may have been superseded. Use [AGENTS.md](../../../AGENTS.md)
for current rules and [Launch Readiness](../../LAUNCH_READINESS.md) for the
dated current checkpoint. Keep these snapshots unchanged.

| Snapshot | Original state |
|---|---|
| [AGENTS-primary.md](AGENTS-primary.md) | Primary bdfc2a46 plus local handoffs through 5.132.1 |
| [AGENTS-origin-6774daa1.md](AGENTS-origin-6774daa1.md) | Fetched main 6774daa1, including 5.133.1 and the held-sync ledger |
| [CLAUDE-primary.md](CLAUDE-primary.md) | Primary dirty compatibility pointer |
| [LAUNCH_READINESS-through-2026-09-05.md](LAUNCH_READINESS-through-2026-09-05.md) | Earlier launch/candidate evidence |
