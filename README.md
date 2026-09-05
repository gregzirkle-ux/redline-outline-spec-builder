# Redline Outline Spec Builder

Portable browser-based application for developing architectural outline specifications and structured handoff packages for a final MasterSpec workflow or outside specification consultant.

## Use

1. Open `dist/index.html` in Microsoft Edge or Google Chrome.
2. Enter your name or initials and create a project.
3. Complete the setup questionnaire and manually review the recommended sections against the complete catalog.
4. Develop each selected section using the hybrid three-part workspace.
5. Use **Save project file** to download the portable `.rspec` project file into the appropriate project folder.
6. Use **Export** to create the selected Word handoff deliverables.

The browser maintains a local recovery copy, but the `.rspec` file is the durable project record. Only one person should edit a project file at a time.

## Sharing through Teams or SharePoint

Upload the complete app folder or packaged ZIP to a shared location. Each user can open the same app locally. Store each `.rspec` file in its project folder and use normal SharePoint checkout or team coordination to avoid simultaneous edits.

## Section libraries

The app includes the complete 1,079-entry `Architectural Specification Section Library` supplied for this project. It covers Divisions 00 through 14 and architecturally coordinated portions of Divisions 21 through 33. Every entry remains searchable and selectable whether or not the questionnaire recommends it.

Reusable office guidance and custom sections are maintained separately through **Section library** and may be exported as a portable custom-library file.

A licensed section list can be imported as CSV with these columns:

- `number`
- `title`
- `system` (optional plain-language description)

The application does not reproduce MasterSpec guide-specification language.

## Project data and attachments

Notes, links, filenames, and embedded reference files can be attached to individual sections. Embedded files are stored inside the `.rspec` file and increase its size.

## Version

Version 2.0.0

- Full 1,079-section master catalog
- Search, division, status, recommendation, historic, and custom filters
- Questionnaire recommendations separated from final selections
- Historic and adaptive-reuse setup
- Multiple scope instances within a section
- Responsibility and consultant-handoff controls
- Project-file migration that merges existing work into the expanded catalog
- Dashboard elevated as the primary project-home control
