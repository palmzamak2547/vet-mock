# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: motion-kit.spec.js >> 320px dark mode keeps every control reachable
- Location: tests/e2e/motion-kit.spec.js:184:1

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 22

- Array []
+ Array [
+   Object {
+     "height": 21,
+     "text": "หายใจตามจังหวะจับคู่ให้ครบจิ้มฟองพักสมองโยนบอลให้ Mochi",
+   },
+   Object {
+     "height": 23,
+     "text": "ตามการตั้งค่าของอุปกรณ์โหมดสงบ — ใช้ภาพนิ่งปิดเอฟเฟกต์",
+   },
+   Object {
+     "height": 23,
+     "text": "อุ้งเท้าเดินวงโคจรพลิกหน้าชีพจรจุดสามจุดเกลียวดีเอ็นเอโครงเนื้อหาแถบความคืบหน้า",
+   },
+   Object {
+     "height": 23,
+     "text": "ตามกิจกรรมที่ทำสำเร็จกระดาษโปรยอุ้งเท้าหิ่งห้อยหัวใจดาวจบบท",
+   },
+   Object {
+     "height": 23,
+     "text": "ฝนหลังหน้าต่างสวนหิ่งห้อยสวนดาวมีมิติโฟกัสทีละบรรทัด",
+   },
+ ]
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "ข้ามไปเนื้อหาหลัก" [ref=e4]:
    - /url: "#main"
  - generic [ref=e5]:
    - banner [ref=e6]:
      - button "สลับชั้นปี — ปัจจุบันปี 4" [ref=e9] [cursor=pointer]: ปี 4
      - generic [ref=e10]:
        - button "ค้นหา" [ref=e11] [cursor=pointer]
        - button "ตัวเลือกธีมและจานสี" [ref=e16] [cursor=pointer]
    - main [active] [ref=e19]:
      - generic [ref=e20]:
        - button "กลับไปเรียน" [ref=e22] [cursor=pointer]:
          - generic [ref=e23]: ←
        - generic [ref=e25]:
          - generic [ref=e26]:
            - paragraph [ref=e27]: MOCHI / STUDY BREAK
            - heading "พักกับ Mochi" [level=1] [ref=e28]
            - paragraph [ref=e29]: พื้นที่เล็ก ๆ ให้พักมือ พักสายตา แล้วกลับไปเรียนในจังหวะของตัวเอง
          - button "จับเวลาอ่านพร้อมช่วงพัก" [ref=e30] [cursor=pointer]
        - region "พักระหว่างเรียน" [ref=e31]:
          - generic [ref=e32]:
            - generic [ref=e33]:
              - heading "พักสั้น ๆ แล้วค่อยไปต่อ" [level=2] [ref=e34]
              - paragraph [ref=e35]: หายใจ ผ่อนสายตา หรือเล่นสักรอบระหว่างพัก
            - generic [ref=e36]:
              - text: ช่วงพัก
              - combobox "กิจกรรมระหว่างพัก" [ref=e37]:
                - option "หายใจตามจังหวะ" [selected]
                - option "จับคู่ให้ครบ"
                - option "จิ้มฟองพักสมอง"
                - option "โยนบอลให้ Mochi"
          - generic [ref=e39]:
            - generic [ref=e40]:
              - strong [ref=e41]: พร้อมเมื่อไหร่ก็ค่อยเริ่ม
              - generic [ref=e42]: รอบละ 10 วินาที
            - button "เริ่มหายใจไปด้วยกัน" [ref=e43] [cursor=pointer]
            - status [ref=e44]: หายใจเข้า 4 วินาที ออก 6 วินาที ไม่ต้องฝืนจังหวะ
          - button "เริ่มช่วงพักใหม่" [ref=e45] [cursor=pointer]
        - group [ref=e46]:
          - generic "ตั้งค่า Mochi และการเคลื่อนไหว" [ref=e47] [cursor=pointer]
          - generic [ref=e48]:
            - generic [ref=e49]:
              - text: การเคลื่อนไหว
              - combobox "การเคลื่อนไหว" [ref=e50]:
                - option "ตามการตั้งค่าของอุปกรณ์" [selected]
                - option "โหมดสงบ — ใช้ภาพนิ่ง"
                - option "ปิดเอฟเฟกต์"
            - generic [ref=e51]:
              - text: ภาพระหว่างรอโหลด
              - combobox "ภาพระหว่างรอโหลด" [ref=e52]:
                - option "อุ้งเท้าเดิน"
                - option "วงโคจร"
                - option "พลิกหน้า" [selected]
                - option "ชีพจร"
                - option "จุดสามจุด"
                - option "เกลียวดีเอ็นเอ"
                - option "โครงเนื้อหา"
                - option "แถบความคืบหน้า"
            - generic [ref=e53]:
              - text: เอฟเฟกต์เมื่อทำสำเร็จ
              - combobox "เอฟเฟกต์เมื่อทำสำเร็จ" [ref=e54]:
                - option "ตามกิจกรรมที่ทำสำเร็จ" [selected]
                - option "กระดาษโปรย"
                - option "อุ้งเท้า"
                - option "หิ่งห้อย"
                - option "หัวใจ"
                - option "ดาว"
                - option "จบบท"
            - generic [ref=e55]:
              - checkbox "แสดง Mochi ในหน้าต่าง ๆ ของ VetMock" [checked] [ref=e56]
              - text: แสดง Mochi ในหน้าต่าง ๆ ของ VetMock
            - paragraph [ref=e57]: เอฟเฟกต์ฉลองใช้เมื่อทำชุดฝึกสำเร็จ ส่วนโหมดสอบจะเก็บเฉลยไว้จนส่งคำตอบ แถบเปอร์เซ็นต์ใช้กับงานที่วัดความคืบหน้าได้เท่านั้น
        - group [ref=e58]:
          - generic "ดูตัวอย่างเอฟเฟกต์และท่า Mochi" [ref=e59] [cursor=pointer]
          - group "หมวดกิจกรรม" [ref=e60]:
            - button "Mochi 20" [ref=e61] [cursor=pointer]:
              - text: Mochi
              - generic [ref=e62]: "20"
            - button "เมาส์ 8" [ref=e63] [cursor=pointer]:
              - text: เมาส์
              - generic [ref=e64]: "8"
            - button "รอโหลด 8" [ref=e65] [cursor=pointer]:
              - text: รอโหลด
              - generic [ref=e66]: "8"
            - button "ปุ่มและการ์ด 10" [ref=e67] [cursor=pointer]:
              - text: ปุ่มและการ์ด
              - generic [ref=e68]: "10"
            - button "ฉลอง 6" [ref=e69] [cursor=pointer]:
              - text: ฉลอง
              - generic [ref=e70]: "6"
            - button "เล่นพัก 4" [ref=e71] [cursor=pointer]:
              - text: เล่นพัก
              - generic [ref=e72]: "4"
            - button "บรรยากาศ 4" [pressed] [ref=e73] [cursor=pointer]:
              - text: บรรยากาศ
              - generic [ref=e74]: "4"
          - generic [ref=e75]:
            - region [ref=e76]:
              - generic [ref=e78]:
                - heading "ฝนหลังหน้าต่าง" [level=2] [ref=e79]
                - paragraph [ref=e80]: ฝนเส้นบางสำหรับมุมอ่านหนังสือ
              - generic [ref=e82]:
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - img "Mochi เพื่อนอ่านหนังสือของ VetMock":
                          - generic: "?"
                          - generic:
                            - generic: z
                            - generic: z
                            - generic: Z
                  - paragraph: ฝนเบา ๆ ระหว่างพักสายตา
              - generic [ref=e83]:
                - button "พักการเคลื่อนไหว" [ref=e84] [cursor=pointer]
                - button "เริ่มกิจกรรมใหม่" [ref=e85] [cursor=pointer]
                - button "กลับไปเรียน" [ref=e86] [cursor=pointer]
            - region "เลือกกิจกรรม" [ref=e87]:
              - generic [ref=e88]:
                - text: เลือกกิจกรรม
                - combobox "เลือกกิจกรรม" [ref=e89]:
                  - option "ฝนหลังหน้าต่าง" [selected]
                  - option "สวนหิ่งห้อย"
                  - option "สวนดาวมีมิติ"
                  - option "โฟกัสทีละบรรทัด"
    - navigation "เมนูหลัก" [ref=e90]:
      - button "หน้าแรก" [ref=e91] [cursor=pointer]
      - button "ฝึก" [ref=e96] [cursor=pointer]
      - button "สอบ" [ref=e102] [cursor=pointer]
      - button "คืบหน้า" [ref=e108] [cursor=pointer]
      - button "VetWiki" [ref=e113] [cursor=pointer]
```

# Test source

```ts
  96  |   const symbols = await page.locator('.vm-memory-tile').evaluateAll(nodes => nodes.map(n => n.dataset.symbol));
  97  |   for (const s of new Set(symbols)) {
  98  |     for (const i of symbols.map((v, i) => v === s ? i : -1).filter(i => i >= 0)) await page.locator('.vm-memory-tile').nth(i).click();
  99  |   }
  100 |   await expect(page.locator('.vmx-motion-stage .vm-game-status')).toContainText('ครบทุกคู่แล้ว! ใช้ 4 ตา');
  101 |   await pick(page, EFFECTS.find(e => e.id === 'breath'));
  102 |   await page.locator('.vmx-motion-stage').getByRole('button', { name: 'เริ่มหายใจไปด้วยกัน', exact: true }).click();
  103 |   await expect(page.locator('.vmx-motion-stage .vm-breath-circle strong')).toHaveText('หายใจเข้า');
  104 |   await expect(page.locator('.vmx-motion-stage .vm-breath-circle span')).not.toHaveText('4 วินาที', { timeout: 2500 });
  105 |   await page.locator('.vmx-motion-stage').getByRole('button', { name: 'พักก่อน', exact: true }).click();
  106 |   await expect(page.locator('.vmx-motion-stage .vm-breath-circle strong')).toHaveText('พักได้ตามสบาย');
  107 | });
  108 | 
  109 | test('3D is optional, preserves the selected model when switching presets, and cleans up on leave', async ({ page }) => {
  110 |   const requests = [];
  111 |   page.on('request', r => requests.push(r.url()));
  112 |   await open(page);
  113 |   expect(requests.some(url => /vendor-atlas|renderer-3d/.test(url))).toBe(false);
  114 |   await page.getByRole('button', { name: '3D', exact: true }).click();
  115 |   await expect(page.locator('.vm-mochi-webgl')).toBeVisible({ timeout: 20_000 });
  116 |   const canvasId = await page.locator('.vm-mochi-webgl').evaluate(el => {
  117 |     el.dataset.testIdentity = 'same-rig'; return el.dataset.testIdentity;
  118 |   });
  119 |   await pick(page, EFFECTS.find(e => e.id === 'mochi-dance'));
  120 |   await expect(page.locator('.vm-mochi-webgl')).toHaveAttribute('data-test-identity', canvasId);
  121 |   await expect(page.getByRole('button', { name: '3D', exact: true })).toHaveAttribute('aria-pressed', 'true');
  122 |   await page.getByRole('button', { name: 'หมุนมุมมอง ↻', exact: true }).click();
  123 |   await group(page, 'play');
  124 |   await expect(page.locator('.vm-mochi-webgl')).toHaveCount(0);
  125 | });
  126 | 
  127 | test('blocked WebGL falls back to 2D without breaking activity selection', async ({ page }) => {
  128 |   await page.addInitScript(() => {
  129 |     const original = HTMLCanvasElement.prototype.getContext;
  130 |     HTMLCanvasElement.prototype.getContext = function(type, ...rest) { return /webgl/i.test(type) ? null : original.call(this, type, ...rest); };
  131 |   });
  132 |   await open(page);
  133 |   await page.getByRole('button', { name: '3D', exact: true }).click();
  134 |   await expect(page.locator('.vm-mochi-status')).toContainText('ใช้ 2D ต่อได้เลย', { timeout: 20_000 });
  135 |   await expect(page.getByRole('button', { name: '2D', exact: true })).toHaveAttribute('aria-pressed', 'true');
  136 |   await pick(page, EFFECTS.find(e => e.id === 'mochi-pet'));
  137 |   await expect(page.locator('.vm-mochi-rig')).toBeVisible();
  138 | });
  139 | 
  140 | test('interaction previews, loader progress and celebrations work without changing study data', async ({ page }) => {
  141 |   await open(page);
  142 |   const before = await page.evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([key]) => /history|bookmark|streak|notes/.test(key))));
  143 |   await group(page, 'interaction');
  144 |   for (const effect of EFFECTS.filter(e => e.group === 'interaction')) {
  145 |     await pick(page, effect);
  146 |     const stage = page.locator('.vmx-motion-stage');
  147 |     if (effect.id === 'accordion') await stage.locator('summary').click();
  148 |     else await stage.getByRole('button').first().click();
  149 |     await expect(stage.locator('.vm-feedback')).not.toHaveText('ลองกดเล่นได้เลย');
  150 |     if (effect.id === 'flip') {
  151 |       await expect(stage.locator('.vm-flip-front')).toHaveAttribute('aria-hidden', 'true');
  152 |       await stage.getByRole('button').first().click();
  153 |       await expect(stage.locator('.vm-flip-front')).toHaveAttribute('aria-hidden', 'false');
  154 |     }
  155 |   }
  156 |   await group(page, 'loading');
  157 |   await pick(page, EFFECTS.find(e => e.id === 'progress'));
  158 |   await page.getByRole('slider', { name: 'ความคืบหน้าเป็นเปอร์เซ็นต์' }).fill('76');
  159 |   await expect(page.locator('.vmx-motion-stage [role=progressbar]')).toHaveAttribute('aria-valuenow', '76');
  160 |   await group(page, 'celebration');
  161 |   for (const effect of EFFECTS.filter(e => e.group === 'celebration')) {
  162 |     await pick(page, effect);
  163 |     await page.locator('.vmx-motion-stage').getByRole('button').click();
  164 |     await expect(page.locator('.vm-particles')).toHaveCount(1);
  165 |   }
  166 |   expect(await page.evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([key]) => /history|bookmark|streak|notes/.test(key))))).toEqual(before);
  167 | });
  168 | 
  169 | test('failed preference storage reports the failure while keeping the current choice usable', async ({ page }) => {
  170 |   await page.addInitScript(() => {
  171 |     const original = Storage.prototype.setItem;
  172 |     Storage.prototype.setItem = function(key, value) {
  173 |       if (key === 'vmx-motion-settings') throw new DOMException('Quota exceeded', 'QuotaExceededError');
  174 |       return original.call(this, key, value);
  175 |     };
  176 |   });
  177 |   await open(page);
  178 |   await page.getByText('ตั้งค่า Mochi และการเคลื่อนไหว', { exact: true }).click();
  179 |   await page.getByRole('combobox', { name: 'การเคลื่อนไหว', exact: true }).selectOption('quiet');
  180 |   await expect(page.locator('.vmx-motion-notice')).toContainText('เก็บไว้ถาวรไม่ได้');
  181 |   await expect(page.locator('.vmx-motion-stage')).toHaveClass(/vm-quiet/);
  182 | });
  183 | 
  184 | test('320px dark mode keeps every control reachable', async ({ page }) => {
  185 |   await page.setViewportSize({ width: 320, height: 740 });
  186 |   await page.addInitScript(() => localStorage.setItem('vmx-theme', 'dark'));
  187 |   await open(page);
  188 |   await page.getByText('ตั้งค่า Mochi และการเคลื่อนไหว', { exact: true }).click();
  189 |   for (const g of GROUPS) {
  190 |     await group(page, g.id);
  191 |     expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  192 |     const select = page.getByRole('combobox', { name: 'เลือกกิจกรรม', exact: true });
  193 |     await expect(select).toBeVisible();
  194 |   }
  195 |   const controls = await page.locator('.vmx-mochi-page button, .vmx-mochi-page select, .vmx-mochi-page summary').evaluateAll(nodes => nodes.filter(n => n.getClientRects().length).map(n => ({ text: n.textContent, height: n.getBoundingClientRect().height })));
> 196 |   expect(controls.filter(n => n.height < 43.5)).toEqual([]);
      |                                                 ^ Error: expect(received).toEqual(expected) // deep equality
  197 | });
  198 | 
```