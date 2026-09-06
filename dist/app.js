(() => {
  'use strict';

  const APP_VERSION = '3.0.0';
  const RECOVERY_KEY = 'redline-outline-spec-recovery';
  const MASTER_CATALOG = Array.isArray(globalThis.OUTLINE_SPEC_MASTER_SECTIONS) ? globalThis.OUTLINE_SPEC_MASTER_SECTIONS : [];
  const PAGE_SIZE = 100;

  const state = {
    project: null,
    user: '',
    view: 'settings',
    activeSectionId: null,
    sectionPage: 0,
    filters: { search: '', division: 'All', selectedOnly: false },
    autosaveTimer: null,
    searchTimer: null,
    creatingProject: false
  };

  const app = document.getElementById('app');
  const main = document.getElementById('main-content');
  const startDialog = document.getElementById('start-dialog');
  const exportDialog = document.getElementById('export-dialog');
  const toast = document.getElementById('toast');

  init();

  async function init() {
    bindShellEvents();
    const recovery = await recoveryRead();
    document.getElementById('recover-project').hidden = !recovery;
    startDialog.showModal();
  }

  function bindShellEvents() {
    document.getElementById('start-new').addEventListener('click', () => beginNew(document.getElementById('start-user').value));
    document.getElementById('start-open').addEventListener('click', () => document.getElementById('start-file-input').click());
    document.getElementById('start-file-input').addEventListener('change', event => openSelectedFile(event, document.getElementById('start-user').value));
    document.getElementById('recover-project').addEventListener('click', recoverProject);
    document.getElementById('outline-home').addEventListener('click', () => navigate('outline'));
    document.getElementById('main-nav').addEventListener('click', event => {
      const view = event.target.closest('[data-view]')?.dataset.view;
      const action = event.target.closest('[data-action]')?.dataset.action;
      if (view) navigate(view);
      if (action === 'export') openExportDialog();
    });
    document.querySelector('.sidebar-footer').addEventListener('click', event => {
      const view = event.target.closest('[data-view]')?.dataset.view;
      if (view) navigate(view);
    });
    document.getElementById('new-project').addEventListener('click', () => {
      if (state.project && !confirm('Start a new project? Save the current project first if you need to keep it.')) return;
      beginNew(state.user);
    });
    document.getElementById('open-project').addEventListener('click', () => document.getElementById('project-file-input').click());
    document.getElementById('project-file-input').addEventListener('change', event => openSelectedFile(event, state.user));
    document.getElementById('save-project').addEventListener('click', saveProjectFile);
    document.getElementById('export-open').addEventListener('click', openExportDialog);
    document.getElementById('export-cancel').addEventListener('click', () => exportDialog.close());
    document.getElementById('export-generate').addEventListener('click', generateExport);
  }

  function beginNew(user) {
    state.user = String(user || '').trim() || 'Unidentified user';
    state.project = createProject();
    state.view = 'settings';
    state.creatingProject = true;
    state.sectionPage = 0;
    state.filters = { search: '', division: 'All', selectedOnly: false };
    if (startDialog.open) startDialog.close();
    showApp();
  }

  async function recoverProject() {
    const recovered = await recoveryRead();
    if (!recovered) return;
    state.user = document.getElementById('start-user').value.trim() || 'Unidentified user';
    state.project = normalizeProject(recovered);
    state.view = 'outline';
    state.creatingProject = false;
    startDialog.close();
    showApp();
    notify('Recovered the last autosaved project.');
  }

  async function openSelectedFile(event, user) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      state.user = String(user || '').trim() || state.user || 'Unidentified user';
      state.project = normalizeProject(parsed);
      state.view = 'outline';
      state.creatingProject = false;
      if (startDialog.open) startDialog.close();
      showApp();
      changed();
      notify(`Opened ${file.name}.`);
    } catch {
      notify('That file could not be opened as a Redline outline project.');
    }
  }

  function showApp() {
    app.hidden = false;
    updateShell();
    render();
  }

  function createProject() {
    const now = new Date().toISOString();
    return {
      schema: 'redline-outline-spec-project',
      version: APP_VERSION,
      id: makeId(),
      createdAt: now,
      updatedAt: now,
      meta: {
        name: '',
        number: '',
        client: '',
        location: '',
        phase: 'Design Development',
        architect: 'Redline Design Group',
        description: ''
      },
      sections: MASTER_CATALOG.map(sectionFromCatalog)
    };
  }

  function normalizeProject(project) {
    const source = project && typeof project === 'object' ? project : {};
    const existing = Array.isArray(source.sections) ? source.sections : [];
    const byKey = new Map(existing.map(section => [sectionKey(section), section]));
    const catalog = MASTER_CATALOG.map(item => {
      const prior = byKey.get(sectionKey(item));
      return prior ? normalizeSection({ ...prior, divisionTitle: prior.divisionTitle || item.divisionTitle, category: prior.category || item.category }) : sectionFromCatalog(item);
    });
    const catalogKeys = new Set(catalog.map(sectionKey));
    const extra = existing.filter(section => !catalogKeys.has(sectionKey(section))).map(normalizeSection);
    return {
      ...source,
      schema: 'redline-outline-spec-project',
      version: APP_VERSION,
      id: source.id || makeId(),
      createdAt: source.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      meta: {
        name: source.meta?.name || 'Untitled Project',
        number: source.meta?.number || '',
        client: source.meta?.client || '',
        location: source.meta?.location || '',
        phase: source.meta?.phase || 'Design Development',
        architect: source.meta?.architect || 'Redline Design Group',
        description: source.meta?.description || ''
      },
      sections: [...catalog, ...extra].sort(sectionSort)
    };
  }

  function sectionFromCatalog(item) {
    return normalizeSection({
      number: item.number,
      title: item.title,
      division: item.division,
      divisionTitle: item.divisionTitle,
      category: item.category,
      selected: false
    });
  }

  function normalizeSection(section) {
    const oldFields = section.fields || {};
    const migratedNotes = section.details ? '' : [
      oldFields.submittals ? `Submittals, mockups, warranties, or delegated design: ${oldFields.submittals}` : '',
      oldFields.coordination ? `Coordination and drawing references: ${oldFields.coordination}` : '',
      section.notes || ''
    ].filter(Boolean).join('\n\n');
    return {
      ...section,
      id: section.id || makeId(),
      number: String(section.number || ''),
      title: section.title || 'Custom Section',
      division: String(section.division || section.number || '').slice(0, 2) || '00',
      divisionTitle: section.divisionTitle || '',
      category: section.category || section.system || '',
      selected: Boolean(section.selected),
      custom: Boolean(section.custom),
      details: {
        scope: section.details?.scope ?? oldFields.scope ?? '',
        basis: section.details?.basis ?? oldFields.products ?? '',
        performance: section.details?.performance ?? oldFields.performance ?? '',
        installation: section.details?.installation ?? oldFields.execution ?? '',
        finish: section.details?.finish ?? oldFields.finishes ?? '',
        notes: section.details?.notes ?? migratedNotes,
        unresolved: section.details?.unresolved ?? ''
      }
    };
  }

  function updateShell() {
    if (!state.project) return;
    const name = state.project.meta.name || 'Untitled Project';
    const selected = selectedSections();
    document.getElementById('sidebar-project').textContent = name;
    document.getElementById('project-subtitle').textContent = [name, state.project.meta.number].filter(Boolean).join(' · ');
    document.getElementById('session-user').textContent = `Session: ${state.user}`;
    document.getElementById('outline-count').textContent = `${selected.length} section${selected.length === 1 ? '' : 's'} selected`;
    document.getElementById('outline-home').classList.toggle('is-active', state.view === 'outline');
    document.querySelectorAll('.nav-item').forEach(button => button.classList.toggle('is-active', button.dataset.view === state.view));
  }

  function navigate(view) {
    state.view = view;
    state.creatingProject = false;
    updateShell();
    render();
    main.focus();
  }

  function render() {
    updateShell();
    if (state.view === 'settings') renderSettings();
    else if (state.view === 'sections') renderSections();
    else if (state.view === 'detail') renderDetail();
    else renderOutline();
  }

  function renderSettings() {
    const p = state.project;
    const title = state.creatingProject ? 'Create a new outline' : 'Project information';
    const subtitle = state.creatingProject
      ? 'Add the basics. You can change them later.'
      : 'Keep the information that identifies this outline.';
    main.innerHTML = heading(title, subtitle) + `
      <section class="panel narrow-panel">
        <div class="form-grid">
          ${field('Project name', 'name', p.meta.name, true)}
          ${field('Project number', 'number', p.meta.number)}
          ${field('Client', 'client', p.meta.client)}
          ${field('Location', 'location', p.meta.location)}
          ${selectField('Project phase', 'phase', p.meta.phase, ['Schematic Design','Design Development','Construction Documents','Pricing / GMP','Permit'])}
          ${field('Architect', 'architect', p.meta.architect)}
          ${textAreaField('Brief project description', 'description', p.meta.description, 'span-2')}
        </div>
        <div class="form-actions">
          ${state.creatingProject ? '<span></span>' : '<button class="button" data-cancel-settings type="button">Back to outline</button>'}
          <button class="button button-primary" data-save-settings type="button">${state.creatingProject ? 'Continue to section selection' : 'Save and return'}</button>
        </div>
      </section>`;
    main.querySelectorAll('[data-meta]').forEach(input => input.addEventListener('input', () => {
      state.project.meta[input.dataset.meta] = input.value;
      changed();
      updateShell();
    }));
    main.querySelector('[data-save-settings]').addEventListener('click', () => {
      if (!p.meta.name.trim()) {
        notify('Enter a project name to continue.');
        main.querySelector('[data-meta="name"]').focus();
        return;
      }
      state.creatingProject = false;
      changed();
      navigate(selectedSections().length ? 'outline' : 'sections');
    });
    main.querySelector('[data-cancel-settings]')?.addEventListener('click', () => navigate('outline'));
  }

  function renderOutline() {
    const sections = selectedSections();
    const withDetail = sections.filter(hasDetails).length;
    main.innerHTML = heading(
      'Project Outline',
      'This is the working outline that will be handed to the specification writer.',
      '<button class="button button-primary" data-add-sections type="button">＋ Add Sections</button>'
    ) + `
      <section class="outline-summary">
        <div><strong>${sections.length}</strong><span>selected sections</span></div>
        <div><strong>${withDetail}</strong><span>with added detail</span></div>
        <div class="summary-guidance"><strong>Blank sections are okay.</strong><span>Selecting a section is enough to include it in the exported outline.</span></div>
      </section>
      ${sections.length ? outlineGroups(sections) : `
        <section class="empty-state hero-empty">
          <div class="empty-icon">＋</div>
          <h2>No sections selected yet</h2>
          <p>Start with the section library. Check the sections expected for this project, then add detail only where it is useful.</p>
          <button class="button button-primary" data-add-sections type="button">Select sections</button>
        </section>`}
      ${sections.length ? '<div class="bottom-actions"><button class="button" data-add-sections type="button">Add more sections</button><button class="button button-primary" data-review-export type="button">Review &amp; Export</button></div>' : ''}`;
    main.querySelectorAll('[data-add-sections]').forEach(button => button.addEventListener('click', () => navigate('sections')));
    main.querySelector('[data-review-export]')?.addEventListener('click', openExportDialog);
    bindOutlineRows();
  }

  function outlineGroups(sections) {
    const groups = groupByDivision(sections);
    return [...groups.entries()].map(([division, items]) => `
      <section class="division-block">
        <div class="division-heading"><div><span>DIVISION ${escapeHtml(division)}</span><h2>${escapeHtml(divisionTitle(items[0]))}</h2></div><small>${items.length} section${items.length === 1 ? '' : 's'}</small></div>
        <div class="outline-list">${items.map(section => `
          <article class="outline-row" data-outline-row="${section.id}">
            <label class="include-control" title="Remove from outline"><input type="checkbox" data-outline-select="${section.id}" checked><span></span></label>
            <button class="outline-section" data-open-section="${section.id}" type="button">
              <strong>${escapeHtml(section.number)}</strong>
              <span>${escapeHtml(section.title)}</span>
              ${detailPreview(section)}
            </button>
            <button class="detail-action ${hasDetails(section) ? 'has-detail' : ''}" data-open-section="${section.id}" type="button">${hasDetails(section) ? 'Edit details' : 'Add details'}</button>
          </article>`).join('')}</div>
      </section>`).join('');
  }

  function bindOutlineRows() {
    main.querySelectorAll('[data-open-section]').forEach(button => button.addEventListener('click', () => openSection(button.dataset.openSection)));
    main.querySelectorAll('[data-outline-select]').forEach(input => input.addEventListener('change', () => {
      const section = findSection(input.dataset.outlineSelect);
      section.selected = input.checked;
      changed();
      renderOutline();
    }));
  }

  function detailPreview(section) {
    const labels = detailLabels(section);
    const first = Object.keys(labels).map(key => section.details[key]).find(value => String(value || '').trim());
    return first ? `<small>${escapeHtml(truncate(first, 130))}</small>` : '<small>Section included · no added detail</small>';
  }

  function renderSections(focusSearch = false) {
    const all = state.project.sections.slice().sort(sectionSort);
    const divisions = [...new Set(all.map(section => section.division))].sort();
    const f = state.filters;
    const filtered = all.filter(section => {
      const haystack = `${section.number} ${section.title} ${section.category} ${section.divisionTitle}`.toLowerCase();
      return (!f.search || haystack.includes(f.search.toLowerCase()))
        && (f.division === 'All' || section.division === f.division)
        && (!f.selectedOnly || section.selected);
    });
    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    state.sectionPage = Math.min(state.sectionPage, pageCount - 1);
    const shown = filtered.slice(state.sectionPage * PAGE_SIZE, (state.sectionPage + 1) * PAGE_SIZE);
    main.innerHTML = heading(
      'Add Sections',
      'Check every section expected for the project. You can add detail now or return to it later.',
      '<button class="button button-primary" data-return-outline type="button">View Project Outline</button>'
    ) + `
      <section class="selection-bar">
        <label class="search-field"><span>Search sections</span><input data-search type="search" value="${escapeAttr(f.search)}" placeholder="Section number, title, material, or system"></label>
        ${selectRaw('Division', 'data-division', f.division, ['All', ...divisions], option => option === 'All' ? 'All divisions' : `Division ${option}`)}
        <label class="selected-filter"><input type="checkbox" data-selected-only ${f.selectedOnly ? 'checked' : ''}> Show selected only</label>
        <div class="selected-total"><strong data-selected-total>${selectedSections().length}</strong><span>selected</span></div>
      </section>
      <div class="results-heading"><p>Showing <strong>${shown.length}</strong> of <strong>${filtered.length}</strong> matching sections</p><button class="text-button" data-add-custom type="button">＋ Add a custom section</button></div>
      <section class="section-list">
        ${shown.map(section => `
          <article class="selection-row ${section.selected ? 'is-selected' : ''}" data-selection-row="${section.id}">
            <label class="library-check"><input type="checkbox" data-library-select="${section.id}" ${section.selected ? 'checked' : ''}><span></span></label>
            <div class="section-number">${escapeHtml(section.number)}</div>
            <div class="section-name"><strong>${escapeHtml(section.title)}</strong><small>${escapeHtml(section.category || divisionTitle(section))}</small></div>
            <span class="detail-state ${hasDetails(section) ? 'has-detail' : ''}">${hasDetails(section) ? 'Details added' : section.selected ? 'Selected' : ''}</span>
            <button class="button button-small" data-library-detail="${section.id}" type="button" ${section.selected ? '' : 'hidden'}>${hasDetails(section) ? 'Edit details' : 'Add details'}</button>
          </article>`).join('') || '<div class="empty-state">No sections match these filters.</div>'}
      </section>
      <div class="pagination">
        <button class="button" data-page-prev type="button" ${state.sectionPage === 0 ? 'disabled' : ''}>Previous</button>
        <span>Page ${state.sectionPage + 1} of ${pageCount}</span>
        <button class="button" data-page-next type="button" ${state.sectionPage >= pageCount - 1 ? 'disabled' : ''}>Next</button>
      </div>`;
    bindSectionEvents();
    if (focusSearch) {
      const input = main.querySelector('[data-search]');
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }

  function bindSectionEvents() {
    main.querySelector('[data-return-outline]').addEventListener('click', () => navigate('outline'));
    main.querySelector('[data-search]').addEventListener('input', event => {
      state.filters.search = event.target.value;
      state.sectionPage = 0;
      clearTimeout(state.searchTimer);
      state.searchTimer = setTimeout(() => renderSections(true), 220);
    });
    main.querySelector('[data-division]').addEventListener('change', event => {
      state.filters.division = event.target.value;
      state.sectionPage = 0;
      renderSections();
    });
    main.querySelector('[data-selected-only]').addEventListener('change', event => {
      state.filters.selectedOnly = event.target.checked;
      state.sectionPage = 0;
      renderSections();
    });
    main.querySelectorAll('[data-library-select]').forEach(input => input.addEventListener('change', () => {
      const section = findSection(input.dataset.librarySelect);
      section.selected = input.checked;
      changed();
      renderSections();
    }));
    main.querySelectorAll('[data-library-detail]').forEach(button => button.addEventListener('click', () => openSection(button.dataset.libraryDetail)));
    main.querySelector('[data-page-prev]').addEventListener('click', () => { state.sectionPage--; renderSections(); });
    main.querySelector('[data-page-next]').addEventListener('click', () => { state.sectionPage++; renderSections(); });
    main.querySelector('[data-add-custom]').addEventListener('click', addCustomSection);
  }

  function openSection(id) {
    const section = findSection(id);
    if (!section) return;
    section.selected = true;
    state.activeSectionId = id;
    state.view = 'detail';
    changed();
    renderDetail();
    main.focus();
  }

  function renderDetail() {
    const section = findSection(state.activeSectionId);
    if (!section) {
      navigate('outline');
      return;
    }
    const labels = detailLabels(section);
    const frontEnd = ['00', '01'].includes(section.division);
    main.innerHTML = `
      <div class="detail-heading">
        <div>
          <button class="text-button back-button" data-back-outline type="button">← Back to Project Outline</button>
          <span class="eyebrow">DIVISION ${escapeHtml(section.division)}</span>
          <h1>${escapeHtml(section.number)} · ${escapeHtml(section.title)}</h1>
          <p>${frontEnd ? 'Add only the project-specific direction the specification writer needs.' : 'All fields are optional. Complete only what is known or important.'}</p>
        </div>
        <label class="included-switch"><input type="checkbox" data-detail-selected ${section.selected ? 'checked' : ''}><span>Included in outline</span></label>
      </div>
      <section class="panel detail-panel">
        ${Object.entries(labels).map(([key, label]) => detailArea(label.title, label.help, key, section.details[key], key === 'unresolved')).join('')}
        <div class="form-actions">
          <button class="button" data-back-outline type="button">Back to outline</button>
          <button class="button button-primary" data-save-detail type="button">Save and return to outline</button>
        </div>
      </section>`;
    main.querySelectorAll('[data-detail]').forEach(input => input.addEventListener('input', () => {
      section.details[input.dataset.detail] = input.value;
      changed();
    }));
    main.querySelector('[data-detail-selected]').addEventListener('change', event => {
      section.selected = event.target.checked;
      changed();
      updateShell();
    });
    main.querySelectorAll('[data-back-outline]').forEach(button => button.addEventListener('click', () => navigate('outline')));
    main.querySelector('[data-save-detail]').addEventListener('click', () => navigate('outline'));
  }

  function detailLabels(section) {
    if (section.division === '00') {
      return {
        scope: { title: 'Known document or requirement', help: 'Identify the expected document, procurement requirement, or known project condition.' },
        basis: { title: 'Responsible party or source', help: 'Record who is expected to provide it or where the information will come from.' },
        notes: { title: 'Notes for the specification writer', help: 'Add any other direction that should carry into the project manual.' },
        unresolved: { title: 'Open item, if any', help: 'Enter only an actual unresolved item that should be called out.' }
      };
    }
    if (section.division === '01') {
      return {
        scope: { title: 'Project-specific requirement', help: 'Describe the requirement, affected work, or important project condition.' },
        performance: { title: 'Quality or performance expectation', help: 'Record any established standard or quality level.' },
        installation: { title: 'Coordination or execution requirement', help: 'Note sequencing, occupied-work, testing, mockup, or closeout requirements.' },
        notes: { title: 'Notes for the specification writer', help: 'Add any other direction that should carry into the project manual.' },
        unresolved: { title: 'Open item, if any', help: 'Enter only an actual unresolved item that should be called out.' }
      };
    }
    return {
      scope: { title: 'Scope or locations', help: 'Where is this used, and what work should this section cover?' },
      basis: { title: 'Basis of design', help: 'Manufacturer, product, model, material, system, or acceptable equivalent.' },
      performance: { title: 'Performance or quality requirements', help: 'Ratings, standards, durability, warranty, quality level, or other criteria.' },
      installation: { title: 'Installation or execution requirements', help: 'Preparation, installation, testing, mockups, protection, or field requirements.' },
      finish: { title: 'Color, finish, profile, or appearance', help: 'Any established visual or finish requirements.' },
      notes: { title: 'Other notes for the specification writer', help: 'Anything else that will help the writer understand the design intent.' },
      unresolved: { title: 'Open item, if any', help: 'Enter only an actual unresolved item that should be called out.' }
    };
  }

  function addCustomSection() {
    const number = prompt('Section number:');
    if (!number?.trim()) return;
    const title = prompt('Section title:');
    if (!title?.trim()) return;
    const section = normalizeSection({
      number: number.trim(),
      title: title.trim(),
      division: number.trim().slice(0, 2),
      divisionTitle: 'Custom Sections',
      category: 'Custom section',
      custom: true,
      selected: true
    });
    state.project.sections.push(section);
    state.project.sections.sort(sectionSort);
    changed();
    openSection(section.id);
  }

  function openExportDialog() {
    const sections = selectedSections();
    if (!sections.length) {
      notify('Select at least one section before exporting.');
      return;
    }
    const withDetail = sections.filter(hasDetails).length;
    document.getElementById('export-summary').textContent = `${sections.length} selected sections; ${withDetail} with added detail. Blank selected sections will still be included.`;
    exportDialog.showModal();
  }

  async function generateExport() {
    const type = document.querySelector('input[name="export-type"]:checked')?.value || 'detailed';
    const sections = selectedSections();
    if (!sections.length) return;
    const blocks = buildExportBlocks(sections, type);
    try {
      const blob = await createDocx(blocks);
      const suffix = type === 'list' ? 'Section_List' : 'Outline_Specification';
      downloadBlob(`${safeName(state.project.meta.name)}_${suffix}.docx`, blob);
      exportDialog.close();
      notify('Word document downloaded.');
    } catch (error) {
      console.error(error);
      notify('The Word document could not be generated.');
    }
  }

  function buildExportBlocks(sections, type) {
    const p = state.project;
    const blocks = [
      { type: 'title', text: p.meta.name || 'Untitled Project' },
      { type: 'subtitle', text: type === 'list' ? 'Specification Section List' : 'Outline Specification' },
      { type: 'meta', text: [p.meta.number && `Project No. ${p.meta.number}`, p.meta.client, p.meta.location, p.meta.phase].filter(Boolean).join(' | ') },
      { type: 'paragraph', text: p.meta.description || '' },
      { type: 'paragraph', text: `Prepared by ${p.meta.architect || 'Redline Design Group'} on ${new Date().toLocaleDateString()} for handoff to the project specification writer.` }
    ];
    const groups = groupByDivision(sections);
    groups.forEach((items, division) => {
      blocks.push({ type: 'division', text: `DIVISION ${division} – ${divisionTitle(items[0]).toUpperCase()}` });
      items.forEach(section => {
        blocks.push({ type: 'h1', text: `${section.number} ${section.title}` });
        if (type === 'detailed') appendSectionDetails(blocks, section);
      });
    });
    return blocks.filter(block => block.type !== 'paragraph' || block.text);
  }

  function appendSectionDetails(blocks, section) {
    const labels = detailLabels(section);
    Object.entries(labels).forEach(([key, label]) => {
      if (key === 'unresolved') return;
      const value = String(section.details[key] || '').trim();
      if (value) {
        blocks.push({ type: 'h2', text: label.title });
        value.split(/\n+/).filter(Boolean).forEach(line => blocks.push({ type: 'paragraph', text: line.trim() }));
      }
    });
    if (section.details.unresolved.trim()) {
      blocks.push({ type: 'h2', text: 'Open Item' });
      blocks.push({ type: 'paragraph', text: section.details.unresolved.trim() });
    }
  }

  async function createDocx(blocks) {
    if (!globalThis.JSZip) throw new Error('JSZip unavailable');
    const zip = new JSZip();
    zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>`);
    zip.folder('_rels').file('.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
    const word = zip.folder('word');
    word.file('document.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${blocks.map(docxParagraph).join('')}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:body></w:document>`);
    word.file('styles.xml', docxStyles());
    word.folder('_rels').file('document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`);
    return zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  }

  function docxParagraph(block) {
    const style = {
      title: 'Title',
      subtitle: 'Subtitle',
      meta: 'Meta',
      division: 'Division',
      h1: 'Heading1',
      h2: 'Heading2',
      bullet: 'ListParagraph',
      paragraph: 'Normal'
    }[block.type] || 'Normal';
    const text = block.type === 'bullet' ? `• ${block.text || ''}` : (block.text || '');
    return `<w:p><w:pPr><w:pStyle w:val="${style}"/></w:pPr><w:r><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`;
  }

  function docxStyles() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/><w:sz w:val="20"/></w:rPr><w:pPr><w:spacing w:after="120"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:color w:val="AD2B2E"/><w:sz w:val="34"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="26"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Meta"><w:name w:val="Meta"/><w:basedOn w:val="Normal"/><w:rPr><w:color w:val="666666"/><w:i/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Division"><w:name w:val="Division"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="26"/></w:rPr><w:pPr><w:shd w:fill="263744"/><w:spacing w:before="420" w:after="160"/><w:keepNext/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:color w:val="AD2B2E"/><w:sz w:val="23"/></w:rPr><w:pPr><w:spacing w:before="260" w:after="100"/><w:keepNext/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="20"/></w:rPr><w:pPr><w:spacing w:before="140" w:after="60"/><w:keepNext/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="ListParagraph"><w:name w:val="List Paragraph"/><w:basedOn w:val="Normal"/><w:pPr><w:ind w:left="360" w:hanging="180"/></w:pPr></w:style></w:styles>`;
  }

  function heading(title, subtitle, action = '') {
    return `<div class="page-heading"><div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div>${action}</div>`;
  }

  function field(label, key, value, required = false) {
    return `<label class="field"><span>${escapeHtml(label)}${required ? ' <em>Required</em>' : ''}</span><input data-meta="${key}" value="${escapeAttr(value)}"></label>`;
  }

  function textAreaField(label, key, value, className = '') {
    return `<label class="field ${className}"><span>${escapeHtml(label)}</span><textarea data-meta="${key}" rows="4">${escapeHtml(value)}</textarea></label>`;
  }

  function selectField(label, key, value, options) {
    return `<label class="field"><span>${escapeHtml(label)}</span><select data-meta="${key}">${options.map(option => `<option ${option === value ? 'selected' : ''}>${escapeHtml(option)}</option>`).join('')}</select></label>`;
  }

  function selectRaw(label, attrs, value, options, display = option => option) {
    return `<label class="field filter-field"><span>${escapeHtml(label)}</span><select ${attrs}>${options.map(option => `<option value="${escapeAttr(option)}" ${option === value ? 'selected' : ''}>${escapeHtml(display(option))}</option>`).join('')}</select></label>`;
  }

  function detailArea(title, help, key, value, warning = false) {
    return `<label class="field detail-field ${warning ? 'open-item-field' : ''}"><span>${escapeHtml(title)}</span><small>${escapeHtml(help)}</small><textarea data-detail="${key}" rows="${warning ? 3 : 4}">${escapeHtml(value)}</textarea></label>`;
  }

  function selectedSections() {
    return state.project.sections.filter(section => section.selected).sort(sectionSort);
  }

  function findSection(id) {
    return state.project.sections.find(section => section.id === id);
  }

  function hasDetails(section) {
    return Object.values(section.details || {}).some(value => String(value || '').trim());
  }

  function groupByDivision(sections) {
    const map = new Map();
    sections.forEach(section => {
      if (!map.has(section.division)) map.set(section.division, []);
      map.get(section.division).push(section);
    });
    return map;
  }

  function divisionTitle(section) {
    return section.divisionTitle || `Division ${section.division}`;
  }

  function sectionKey(section) {
    return `${String(section.number || '').trim()}|${String(section.title || '').trim()}`.toLowerCase();
  }

  function sectionSort(a, b) {
    return `${a.number} ${a.title}`.localeCompare(`${b.number} ${b.title}`, undefined, { numeric: true });
  }

  function changed() {
    state.project.updatedAt = new Date().toISOString();
    state.project.version = APP_VERSION;
    const saveState = document.getElementById('save-state');
    saveState.textContent = 'Saving recovery copy…';
    clearTimeout(state.autosaveTimer);
    state.autosaveTimer = setTimeout(async () => {
      await recoveryWrite(state.project);
      saveState.textContent = 'Recovery copy saved';
    }, 450);
  }

  function saveProjectFile() {
    if (!state.project) return;
    const filename = `${safeName(state.project.meta.name)}.rspec`;
    downloadBlob(filename, new Blob([JSON.stringify(state.project, null, 2)], { type: 'application/json' }));
    notify(`Saved ${filename}.`);
  }

  async function recoveryDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('redline-outline-spec', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('projects');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function recoveryWrite(project) {
    try {
      const db = await recoveryDb();
      await new Promise((resolve, reject) => {
        const tx = db.transaction('projects', 'readwrite');
        tx.objectStore('projects').put(project, RECOVERY_KEY);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
      db.close();
    } catch (error) {
      console.warn('Recovery save unavailable', error);
    }
  }

  async function recoveryRead() {
    try {
      const db = await recoveryDb();
      const result = await new Promise((resolve, reject) => {
        const tx = db.transaction('projects', 'readonly');
        const request = tx.objectStore('projects').get(RECOVERY_KEY);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
      db.close();
      return result;
    } catch {
      return null;
    }
  }

  function downloadBlob(filename, blob) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function notify(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => { toast.hidden = true; }, 3200);
  }

  function truncate(value, length) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    return text.length > length ? `${text.slice(0, length - 1)}…` : text;
  }

  function makeId() {
    return globalThis.crypto?.randomUUID?.() || `rs-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function safeName(value) {
    return String(value || 'Project').trim().replace(/[^a-z0-9_-]+/gi, '_').replace(/^_+|_+$/g, '') || 'Project';
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[char]));
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/"/g, '&quot;');
  }

  function escapeXml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]));
  }
})();
