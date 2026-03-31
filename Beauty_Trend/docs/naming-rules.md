# Beauty Trend Workspace Naming Rules

Workspace root:
`/Users/melissawang/Documents/Playground/Arose/Beauty_Trend`

## Directory rules

- `reports/`: store the source daily report in Markdown
- `shared/`: store the shareable HTML daily report
- `slides/`: store the generated slide deck in HTML
- `docs/`: store process and naming documentation

## File naming rules

All filenames use the same date prefix in local timezone `Asia/Shanghai`.

### 1. Daily report Markdown

Format:
`YYYY-MM-DD_护肤彩妆产品日报.md`

Example:
`2026-03-30_护肤彩妆产品日报.md`

### 2. Shareable daily report HTML

Format:
`YYYY-MM-DD_护肤彩妆产品日报_share.html`

Example:
`2026-03-30_护肤彩妆产品日报_share.html`

### 3. Slides HTML

Format:
`YYYY-MM-DD_护肤彩妆产品日报_slides.html`

Example:
`2026-03-30_护肤彩妆产品日报_slides.html`

## Output contract for automation

- The automation must write all three files for the same business date.
- The HTML report and slides must be generated from the same day's Markdown report.
- The result message must include:
  - absolute path of the Markdown report
  - absolute path of the shareable HTML report
  - absolute path of the slides HTML
  - preview/share link for the HTML report
  - preview link for the slides

## Overwrite policy

- If today's files already exist, update them in place instead of creating duplicate versions.
- Do not create alternate suffixes like `(1)`, `_final`, `_v2`, or `_latest`.

## Scope rule

- Topic scope is fixed to `护肤、彩妆`.
- Unless explicitly changed later, this workspace is dedicated to the daily beauty trend workflow only.
