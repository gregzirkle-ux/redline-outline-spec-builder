# Redline Outline Spec Builder

A focused browser application for selecting anticipated specification sections, adding optional project-specific direction, and exporting an outline for the project specification writer.

## Version 3 workflow

1. Create a project and enter the basic project information.
2. Select sections from the complete built-in library.
3. Add detail only to sections where project-specific direction is useful.
4. Review the Project Outline.
5. Export a detailed Word outline or a section list.

Selected sections do not require additional information. A selected section with no detail still appears in the exported outline.

## Project files

The browser keeps an automatic recovery copy. Use **Save project** to download the durable `.rspec` project file and store it in the appropriate Teams or SharePoint project folder.

Version 3 can open Version 2 project files. Existing selected sections and section information are migrated into the simplified fields. Older project data remains in the project file for compatibility even though the Version 3 interface no longer displays the former tracking systems.

## Section library

The application includes 1,079 unique entries across 24 divisions. Every entry remains searchable and manually selectable. Custom project sections can be added from the section-selection page.

The section list is an architectural working library and does not reproduce copyrighted MasterSpec guide-specification language.

## Hosting

The deployable website is contained in the `dist` directory.

Vercel settings:

- Framework Preset: Other
- Root Directory: repository root
- Build Command: none
- Output Directory: `dist`
- Install Command: none
- Environment variables: none

## Version

Version 3.0.0

- Replaced the setup wizard with one project-information screen.
- Made Project Outline the working project home.
- Reduced section selection to include, search, division filtering, and optional detail.
- Removed section statuses, completion rules, recommendations, automatic decisions, and separate Division 00/01 trackers.
- Replaced the three-part workspace with optional architect-focused fields.
- Added simplified Division 00 and Division 01 detail forms.
- Simplified Word export to a detailed outline or section list.
- Preserved browser recovery, `.rspec` save/open, legacy migration, custom sections, and the 1,079-section library.
