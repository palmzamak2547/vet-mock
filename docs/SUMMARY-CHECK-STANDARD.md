# Checking a lecture summary against its recording

These summaries are built from recordings of the cohort's own lectures. A
student memorises one for an exam, so **an invented fact is worse than an
omission**. Every lecture is written by one pass and read back against the audio
by a second, independent one. On 2026-09-18 and 19 that second pass found
roughly a hundred real defects across twelve lectures — between seven and
thirteen each — and almost none were visible from the summary alone.

This file exists so the standard does not have to be retyped into every prompt,
and so it survives the session that discovered it. A prompt should point here
and then add only what is specific to its lecture.

## The defect classes, worst first

Ordered by how much damage each does to a student who trusts the page.

**1. A claim nobody made, usually in a header or an overview line.** This is the
most-read text on the page and the least checked. A header put ALV among the
immunosuppressive diseases when the lecturer names four and ALV is not one. A
trap line warned students to distinguish IBH from IBD; he contrasts IB with IBD
every time, and IBH does not appear until an hour later. Two headers announced
what was and was not examinable while the same file's front matter records that
he never mentioned the exam. Check every generalisation: ทั้งหมด, ทุก, ไม่มี,
เสมอ, เฉพาะ.

**2. A table filling its own blanks.** A half-empty column invites completion. A
vaccine column asserted that no vaccine exists for two diseases she never said
it about. A pathogen table invented ordinals three through five, and its fifth
row contradicted the lecturer outright. Worst of the kind: a heat-exchanger row
read "ข้นหนืดขึ้นมาอีกนิดนึง", a real phrase from two minutes later about a
different row, and it came out backwards. **Every cell must trace to a spoken
line.** A cell never spoken to says **ไม่ได้บอกไว้**.

**3. A correction toward the textbook**, which teaches the opposite of the
lecture. A summary wrote *Giemsa* where the lecturer twice said **Gram**.
Another wrote *micro/macrogametocyte* where she said **elongate** and **round** —
importing terms she used for a different disease later in the same hour. What
was said stays in the body. The textbook answer goes in
`# 📌 หมายเหตุท้ายบท`, only when textbook-certain, and the note says which
answer belongs on which paper.

**4. A quote that drifted.** One gained a **"ไม่"** that reversed it. Another was
spliced from two minutes apart. Quotation marks are a promise about bytes: a
garbled word stays garbled inside the marks, and the reading goes outside them.
Verify every quoted line word by word, and every statement about what will or
will not be examined — telling a student to skip what the lecturer never
dismissed costs as much as the reverse.

**5. `[ฟังไม่ชัด]` over speech that was recoverable.** Twenty markers across one
subject turned out recoverable from context, including a vaccine strain, a list
of virus subgroups, a sampling tissue and a named exam point. Marking audible
speech inaudible is not the safe error it looks like. Check the reverse too.

**6. A number written off as unusable that was audible all along.** The mirror
of the above. Four in one lecture, including **"ก่อนปี 25"** dismissed as noise
when it is the same two-digit register as the "ปี 58" accepted a paragraph
earlier, and **"19590"**, which has one digit too many rather than too few.

**7. A boundary or a hedge that did not survive.** ไม่เกิน, ไม่น้อยกว่า,
อย่างน้อย, ตั้งแต่…ขึ้นไป, เท่านั้น must come through exactly. A figure given
as **"1,200 ถ้าจำไม่ผิด"** becomes a fact the speaker never asserted once the
hedge is dropped. Never attach a unit to a number recited without one; Thai
speakers say years as two digits.

**8. An English term or an expanded acronym the lecturer never said.** One
summary supplied *synovitis* for his "ซิโนวี", which is the species name
*synoviae* — a different word.

## Recovery is not substitution

A garbled token may be resolved when **the sounds support the word**:
"อีลองเกต" is elongate, "แคปโอซิล" is Cab-O-Sil, "ฮากานี่" is *hagani*.

It may not be resolved because the surrounding facts make an answer likely. A
lecturer named a disease that broke out in Malaysia and the token maps to no
word; epidemiologically it is almost certainly Nipah, and writing that in would
have been **textbook substitution, not recovery**. The first reads what was
said. The second decides what should have been said, and once that is allowed
there is no principled place to stop, because a well-read author can always
supply the likely answer.

## How to prove an absence

Not "I could not find it". **State the searches and name the false positives.**

A check proved that an hour on a public health act contains no legal citation by
reporting that `มาตรา` appears **0 times**, that the transcript holds **no
four-digit number at all** so no Buddhist-era year can be in it, and that the
only `บาท` hit is the substring inside **บทบาท**. Another reported zero for
`เปอร์เซ็นต์` while naming the hits that proved nothing: `เปอร์` inside
**papเปอร์**, `ลิง` inside **ลิงก์**.

Two things defeat a careless grep:

- **A grep that returns hits disproves nothing until you look at what the hits
  are.** `CCP` matched **HAC CP**; `ปรับ` matched **ปรับปรุง**.
- **The transcript splits words.** A search for `ข้อสอบ` missed a real hit
  rendered as **"ข้อ สอบ"**. Say which spellings you searched.

### An absence proof can become a false claim

The worst outcome is not a failed proof. It is a proof that failed and then got
written into the page as a fact. One summary carried a table row saying the
figure **70% for emerging disease does not appear in this lecture** — and she
says **"70 กว่าเปอร์เซ็นต์" twice**, at [5:53] and [8:15]. The grep was for
`70%`; the speech was Thai prose around the number.

So the safety mechanism inherits the trap it was built for. Before a document
tells a student that something was never said, search the way it would be
**spoken**, not the way it would be typed: the number alone, the number with
กว่า, the number in words, the concept without the number.

### Enumerate rather than guess the search terms

The strongest pass of the run stopped choosing keywords. It listed **all 318
distinct Latin tokens** in the transcript and every standalone letter, then
checked which could be fragments of the acronyms in question, and separately
listed every run of digits to show that no four-digit number exists anywhere.
That answers "did she ever say it" without depending on having thought of the
right spelling first.

## What the roster and the timetable are for

`src/data/instructors-directory.js` **decodes a spoken name that came through
garbled. It does not supply one that was never spoken.** If the speaker never
names themself, `instructor` stays empty even though `curriculum.js` names
someone for the slot. If a given name is recovered but the surname was never
said, the file says so.

The timetable is a claim about a plan, not a record of who stood at the front.
One lecture was given by an external speaker from มกอช. who is in no roster, and
she skipped the published topic as already known and taught something else.

## Length

Match the lecture. A faithful 20,000-character summary of a short lecture is
correct work; padding it toward the 60,000 of a two-hour lecture means
inventing. One writer defended its length by measuring prose against speech —
0.95 against the reference's 0.96 — which is the right way to answer the
question. The opposite failure is a document longer than its source because the
same fact is stated in prose, again in a table and again in a quote.

## The mechanical rules

`node scripts/lint-staged-summaries.mjs <videoId>` enforces these, so a prompt
does not need to restate them: no middle dots, no machine vocabulary
(`ASR`, `ถอดเสียง`, `ถอดได้`, `transcript`), no correction written into the body
instead of the closing note, front matter present. **The closing note is not
exempt from any of it** — one note warned of a contradiction that existed only
because the units beneath it had been invented.

Run it before reporting. A clean verdict is a real result; say so plainly when
that is what you find.
