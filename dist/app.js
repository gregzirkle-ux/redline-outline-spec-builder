(() => {
  'use strict';

  const APP_VERSION = '2.0.0';
  const RECOVERY_KEY = 'redline-outline-spec-recovery';
  const LIBRARY_KEY = 'redline-outline-spec-firm-library';
  const STATUS_OPTIONS = ['Not Reviewed', 'Included', 'Possible', 'In Progress', 'Needs Decision', 'Ready for Review', 'Outline Complete', 'Consultant', 'Drawing Note Only', 'Not Applicable', 'Excluded'];
  const SCOPE_TAGS = ['Existing to remain', 'Existing to be protected', 'Existing to be repaired', 'Existing to be restored', 'Existing to be modified', 'Existing to be dismantled and reconstructed', 'Salvage and reinstall', 'Salvage for owner', 'Replicate or match historic construction', 'New work in existing building', 'New addition', 'Ground-up construction', 'Demolition or removal', 'Alternate or allowance', 'Owner-furnished item', 'Delegated design', 'Future or not in contract'];
  const MASTER_CATALOG = Array.isArray(globalThis.OUTLINE_SPEC_MASTER_SECTIONS) ? globalThis.OUTLINE_SPEC_MASTER_SECTIONS : [];

  const baseSections = [
    ['02 41 19','Selective Demolition','Selective removal, salvage, patching, and protection','02','demolition'],
    ['03 30 00','Cast-in-Place Concrete','Housekeeping pads, slabs, curbs, and miscellaneous concrete','03','concrete'],
    ['03 35 00','Concrete Finishing','Exposed concrete floor and slab finishes','03','concrete'],
    ['04 20 00','Unit Masonry','Concrete or clay masonry assemblies','04','masonry'],
    ['04 42 00','Exterior Stone Cladding','Exterior adhered or anchored stone systems','04','cladding'],
    ['05 12 00','Structural Steel Framing','Architecturally coordinated structural steel','05','metals'],
    ['05 40 00','Cold-Formed Metal Framing','Exterior and load-bearing cold-formed framing','05','framing'],
    ['05 50 00','Metal Fabrications','Miscellaneous steel supports and fabrications','05','metals'],
    ['05 51 00','Metal Stairs','Prefabricated or fabricated metal stair systems','05','stairs'],
    ['05 52 13','Pipe and Tube Railings','Exterior and interior metal guardrails and handrails','05','railings'],
    ['06 10 00','Rough Carpentry','Blocking, nailers, sheathing, and concealed wood framing','06','carpentry'],
    ['06 16 00','Sheathing','Wall, roof, and miscellaneous sheathing','06','sheathing'],
    ['06 20 00','Finish Carpentry','Interior and exterior finish carpentry','06','carpentry'],
    ['06 40 23','Interior Architectural Woodwork','Casework, paneling, trim, and custom millwork','06','woodwork'],
    ['06 61 16','Solid Surfacing Fabrications','Solid-surface countertops and fabricated components','06','countertops'],
    ['07 21 00','Thermal Insulation','Building-envelope and interior acoustic insulation','07','insulation'],
    ['07 25 00','Weather Barriers','Air, water, and vapor control layers','07','weather'],
    ['07 27 26','Fluid-Applied Membrane Air Barriers','Fluid-applied exterior air-barrier system','07','weather'],
    ['07 41 13','Metal Roof Panels','Standing-seam or concealed-fastener metal roofing','07','roofing'],
    ['07 42 13','Metal Wall Panels','Exterior formed-metal wall-panel assemblies','07','cladding'],
    ['07 54 23','Thermoplastic-Polyolefin Roofing','Low-slope TPO membrane roofing assembly','07','roofing'],
    ['07 62 00','Sheet Metal Flashing and Trim','Roof, wall, opening, and perimeter flashings','07','sheetmetal'],
    ['07 72 00','Roof Accessories','Hatches, curbs, walkways, and related roof accessories','07','roofing'],
    ['07 84 13','Penetration Firestopping','Rated penetration firestop systems','07','firestopping'],
    ['07 84 46','Fire-Resistive Joint Systems','Rated building-joint fire protection','07','firestopping'],
    ['07 92 00','Joint Sealants','Interior and exterior elastomeric joint sealants','07','sealants'],
    ['08 11 13','Hollow Metal Doors and Frames','Steel doors and frames','08','doors'],
    ['08 14 16','Flush Wood Doors','Interior flush wood doors','08','doors'],
    ['08 31 13','Access Doors and Frames','Wall and ceiling access doors','08','doors'],
    ['08 33 23','Overhead Coiling Doors','Service, counter, or fire-rated coiling doors','08','doors'],
    ['08 41 13','Aluminum-Framed Entrances and Storefronts','Exterior and interior aluminum storefront systems','08','storefront'],
    ['08 42 29','Automatic Entrances','Automatic sliding or swinging entrance systems','08','doors'],
    ['08 44 13','Glazed Aluminum Curtain Walls','Exterior curtain-wall systems','08','curtainwall'],
    ['08 71 00','Door Hardware','Door hardware sets, keying, and access coordination','08','hardware'],
    ['08 80 00','Glazing','Exterior and interior glass and glazing','08','glazing'],
    ['08 91 00','Louvers','Exterior architectural and mechanical louvers','08','louvers'],
    ['09 21 16','Gypsum Board Assemblies','Metal framing and gypsum-board assemblies','09','gypsum'],
    ['09 22 16','Non-Structural Metal Framing','Interior non-load-bearing metal framing','09','gypsum'],
    ['09 29 00','Gypsum Board','Interior and exterior gypsum-board products','09','gypsum'],
    ['09 30 00','Tiling','Ceramic, porcelain, glass, and stone tile','09','tile'],
    ['09 51 13','Acoustical Panel Ceilings','Suspended acoustical ceiling systems','09','ceilings'],
    ['09 54 00','Specialty Ceilings','Wood, metal, fabric, or other specialty ceilings','09','ceilings'],
    ['09 64 00','Wood Flooring','Wood-strip, plank, or engineered flooring','09','flooring'],
    ['09 65 00','Resilient Flooring','Tile, plank, sheet, base, and accessories','09','flooring'],
    ['09 68 00','Carpeting','Broadloom, tile, and resilient-backed carpet','09','flooring'],
    ['09 72 00','Wall Coverings','Fabric, vinyl, wood veneer, or specialty wall coverings','09','finishes'],
    ['09 77 00','Special Wall Surfacing','Decorative, acoustic, or protective wall surfacing','09','finishes'],
    ['09 91 00','Painting','Interior and exterior field-applied coatings','09','painting'],
    ['10 14 00','Signage','Code, room, directional, and informational signage','10','signage'],
    ['10 21 13','Toilet Compartments','Toilet partitions and urinal screens','10','toilet'],
    ['10 26 00','Wall and Door Protection','Corner guards, crash rails, and wall protection','10','protection'],
    ['10 28 00','Toilet, Bath, and Laundry Accessories','Commercial toilet and bath accessories','10','toilet'],
    ['10 44 00','Fire Protection Specialties','Extinguisher cabinets and portable extinguishers','10','fire'],
    ['10 51 00','Lockers','Metal, wood, plastic, or specialty lockers','10','lockers'],
    ['10 73 00','Protective Covers','Canopies, awnings, and protective cover systems','10','canopies'],
    ['11 31 00','Residential Appliances','Residential-type appliances used in commercial projects','11','equipment'],
    ['11 40 00','Foodservice Equipment','Architectural coordination for commercial foodservice equipment','11','equipment'],
    ['11 52 13','Projection Screens','Fixed or retractable projection screens','11','equipment'],
    ['12 24 00','Window Shades','Manual and motorized interior window shades','12','shades'],
    ['12 32 00','Manufactured Wood Casework','Factory-manufactured cabinets and casework','12','casework'],
    ['12 36 00','Countertops','Stone, quartz, solid-surface, and other countertops','12','countertops'],
    ['12 48 13','Entrance Floor Mats and Frames','Recessed or surface entrance mat systems','12','mats'],
    ['13 34 19','Metal Building Systems','Pre-engineered metal building enclosure systems','13','metalbuilding'],
    ['14 20 00','Elevators','Passenger, service, or limited-use elevator systems','14','elevators']
  ];

  const guidedByType = {
    preservation: ['Historic material and location','Treatment objective and governing standard','Existing-condition documentation','Testing and investigation','Repair versus replacement criteria','Matching and replication requirements','Salvage and storage','Mockups and sample panels','Protection of retained work'],
    roofing: ['Roof assembly and deck','Membrane or panel type','Attachment method','Insulation and cover board','Slope and drainage','Wind-uplift and fire classification','Warranty target'],
    storefront: ['System depth','Thermal performance','Finish and color','Glazing type','Entrance-door integration','Structural design criteria'],
    curtainwall: ['System depth and module','Thermal and condensation performance','Finish and color','Vision and spandrel glazing','Air and water testing','Structural design criteria'],
    doors: ['Door and frame types','Fire ratings','Core or construction','Finish','Acoustic requirements','Security and access-control coordination'],
    hardware: ['Hardware set strategy','Keying system','Electrified hardware','Access-control interface','Finish family','Warranty and maintenance'],
    glazing: ['Glass types and locations','Safety glazing','Thermal performance','Acoustic performance','Decorative treatments','Bird-friendly requirements'],
    gypsum: ['Board types and locations','Abuse or impact resistance','Moisture and mold resistance','Level of finish','Acoustic assemblies','Exterior exposure'],
    tile: ['Tile types and locations','Size and pattern','Setting and grouting materials','Waterproofing','Movement joints','Slip resistance'],
    ceilings: ['System type and module','Panel or plank material','Suspension system','Edge profile','Finish and color','Access and coordination'],
    flooring: ['Material types and locations','Wear or performance class','Color and pattern','Transitions and base','Moisture mitigation','Extra materials'],
    painting: ['Substrates and locations','Coating systems','Sheen levels','Color strategy','Low-emitting requirements','Mockups and touch-up'],
    woodwork: ['AWI quality grade','Materials and veneers','Finishes','Hardware','Fabrication scope','Mockups and samples'],
    cladding: ['Assembly type','Panel or unit dimensions','Attachment system','Air and water control','Finish and color','Performance testing'],
    sealants: ['Joint types and locations','Sealant chemistry','Colors','Compatibility testing','Mockups','Warranty'],
    insulation: ['Locations and assembly role','Material type','R-value or thickness','Vapor permeability','Fire and smoke requirements','Acoustic requirements'],
    firestopping: ['Rated conditions','System selection basis','Engineering judgments','Installer qualifications','Inspection requirements','Submittal matrix'],
    signage: ['Sign families','Code-required signs','Typography and graphics','Materials and finishes','Mounting','Owner branding coordination'],
    elevators: ['Elevator type and capacity','Speed and travel','Cab finishes','Door and frame finishes','Controls and access','Delegated design and approvals'],
    demolition: ['Limits of demolition','Items to remain','Salvage and owner return','Protection','Patching and matching','Hazardous-material coordination'],
    concrete: ['Concrete applications','Strength and exposure','Reinforcement scope','Finish requirements','Curing and protection','Testing'],
    masonry: ['Unit types and sizes','Mortar and grout','Reinforcement','Colors and textures','Mockups','Cleaning and protection'],
    metals: ['Fabrication scope','Materials and shapes','Shop-applied coatings','Galvanizing','Exposed finish quality','Delegated design'],
    framing: ['Framing locations','Member depth and gauge','Design criteria','Deflection limits','Corrosion protection','Delegated design'],
    carpentry: ['Blocking and nailers','Preservative treatment','Fire-retardant treatment','Sheathing scope','Wood species and grade','Coordination'],
    countertops: ['Material type','Thickness and edge','Finish and color','Seams and joints','Backsplashes','Supports and cutouts'],
    equipment: ['Equipment responsibility','Utility coordination','Owner-furnished items','Finish and appearance','Submittals','Training and warranty']
  };

  const div00Template = [
    'Procurement and delivery method','Owner-Contractor Agreement','General Conditions','Supplementary Conditions','Bid or proposal forms','Alternates and allowances','Bond requirements','Insurance requirements','Responsible party for final assembly'
  ];
  const div01Template = [
    'Summary of Work','Work restrictions and occupied-building requirements','Allowances','Alternates','Substitution procedures','Project management and coordination','Construction progress documentation','Submittal procedures','Quality requirements','Testing and inspecting agency coordination','Mockups','Temporary facilities and controls','Product requirements','Execution and closeout requirements','Operation and maintenance data','Demonstration and training','Warranties','Record documents'
  ];

  const state = {
    project: null,
    user: '',
    view: 'setup',
    setupStep: 0,
    sectionDisplay: 'table',
    sectionPage: 0,
    sectionFilters: { search:'', division:'All', status:'All', view:'All' },
    activeSectionId: null,
    referenceSectionId: null,
    autosaveTimer: null,
    firmLibrary: loadFirmLibrary()
  };

  const app = document.getElementById('app');
  const main = document.getElementById('main-content');
  const startDialog = document.getElementById('start-dialog');
  const exportDialog = document.getElementById('export-dialog');
  const referenceDialog = document.getElementById('reference-dialog');
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
    document.getElementById('recover-project').addEventListener('click', async () => {
      const recovered = await recoveryRead();
      if (!recovered) return;
      state.user = document.getElementById('start-user').value.trim() || 'Unidentified user';
      state.project = normalizeProject(recovered);
      applySystemSelections();
      recordActivity('Recovered autosaved project');
      startDialog.close();
      showApp();
    });
    document.getElementById('main-nav').addEventListener('click', event => {
      const button = event.target.closest('[data-view]');
      if (button) navigate(button.dataset.view);
    });
    document.getElementById('dashboard-home').addEventListener('click', () => navigate('dashboard'));
    document.getElementById('new-project').addEventListener('click', () => beginNew(state.user));
    document.getElementById('open-project').addEventListener('click', () => document.getElementById('project-file-input').click());
    document.getElementById('project-file-input').addEventListener('change', event => openSelectedFile(event, state.user));
    document.getElementById('save-project').addEventListener('click', saveProjectFile);
    document.getElementById('export-open').addEventListener('click', () => exportDialog.showModal());
    document.getElementById('export-cancel').addEventListener('click', () => exportDialog.close());
    document.getElementById('export-generate').addEventListener('click', generateExports);
    document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
    document.getElementById('reference-form').addEventListener('submit', addReference);
  }

  function beginNew(user) {
    state.user = String(user || '').trim() || 'Unidentified user';
    state.project = createProject();
    applySystemSelections();
    state.view = 'setup';
    state.setupStep = 0;
    recordActivity('Created project');
    if (startDialog.open) startDialog.close();
    showApp();
  }

  async function openSelectedFile(event, user) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      state.user = String(user || '').trim() || 'Unidentified user';
      state.project = normalizeProject(parsed);
      applySystemSelections();
      state.view = 'dashboard';
      state.setupStep = Math.min(Number(state.project.setupStep || 0), 5);
      recordActivity(`Opened ${file.name}`);
      if (startDialog.open) startDialog.close();
      showApp();
      notify('Project opened.');
    } catch (error) {
      notify('That file could not be opened as a Redline outline-spec project.');
    }
  }

  function showApp() {
    app.hidden = false;
    updateShell();
    render();
  }

  function createProject() {
    const now = new Date().toISOString();
    const custom = state.firmLibrary.sections || [];
    const sourceSections = MASTER_CATALOG.length ? MASTER_CATALOG.map(sectionFromCatalog) : baseSections.map(sectionFromTuple);
    const allSections = dedupeSections([...sourceSections, ...custom.map(normalizeSection)]);
    return {
      schema: 'redline-outline-spec-project', version: APP_VERSION, id: makeId(), createdAt: now, updatedAt: now,
      setupStep: 0,
      meta: { name: 'Untitled Project', number: '', client: '', location: '', phase: 'Design Development', architect: 'Redline Design Group', description: '' },
      scope: { primary: 'New construction', occupied: 'Not applicable', conditions: ['Ground-up construction'], notes: '', historic: { designation:'Not determined', authority:'', treatment:'Not determined', taxCredits:'Not determined', investigation:'' } },
      procurement: { delivery: 'Design-Bid-Build', pricing: 'Competitive bid', agreement: '', generalConditions: 'AIA A201', supplementaryConditions: 'Not determined', platform: '', notes: '' },
      division00: div00Template.map(label => ({ id: makeId(), label, status: 'Not Determined', responsible: '', reference: '' })),
      division01: div01Template.map(label => ({ id: makeId(), label, applicable: true, notes: '', status: 'Not Addressed' })),
      systems: defaultSystems(),
      sections: allSections,
      manualDecisions: [],
      activity: [],
      handoffNotes: '',
      libraryVersion: state.firmLibrary.version || 1
    };
  }

  function sectionFromCatalog(item) {
    return normalizeSection({
      number:item.number, title:item.title, division:item.division,
      divisionTitle:item.divisionTitle, category:item.category,
      system:item.category || item.divisionTitle || 'Project requirement',
      type:inferSectionType(item.number,item.title), selected:false, recommended:false
    });
  }

  function sectionFromTuple(tuple) {
    const [number,title,system,division,type] = tuple;
    return normalizeSection({ number,title,system,division,type, selected: ['03 30 00','05 50 00','06 10 00','07 21 00','07 25 00','07 62 00','07 84 13','07 92 00','08 11 13','08 14 16','08 71 00','08 80 00','09 21 16','09 29 00','09 51 13','09 65 00','09 91 00','10 14 00','10 28 00','10 44 00'].includes(number) });
  }

  function normalizeSection(section) {
    return {
      id: section.id || makeId(), number: section.number || '', title: section.title || 'Custom Section',
      system: section.system || '', division: section.division || String(section.number || '').slice(0,2) || '00', divisionTitle:section.divisionTitle || '', category:section.category || '', type: section.type || inferSectionType(section.number,section.title),
      selected: Boolean(section.selected), custom: Boolean(section.custom), reusable: Boolean(section.reusable),
      recommended:Boolean(section.recommended), recommendationReasons:Array.isArray(section.recommendationReasons)?section.recommendationReasons:[],
      status: section.status || (section.selected ? 'Included' : 'Not Reviewed'), scopeTags: section.scopeTags || [], scopeInstances:Array.isArray(section.scopeInstances)?section.scopeInstances:[],
      fields: { scope:'', performance:'', products:'', finishes:'', submittals:'', coordination:'', execution:'', ...(section.fields || {}) },
      responsibility:{ discipline:'Architectural', author:'Project team', architectSelection:false, consultantInput:false, drawingCoordination:true, due:'', ...(section.responsibility||{}) },
      specifyingApproach: section.specifyingApproach || 'Choose per section', guided: section.guided || {}, references: section.references || [], notes: section.notes || ''
    };
  }

  function normalizeProject(project) {
    if (!project || project.schema !== 'redline-outline-spec-project') throw new Error('Invalid project file');
    const fresh = createProject();
    return {
      ...fresh, ...project,
      meta: { ...fresh.meta, ...(project.meta || {}) },
      scope: { ...fresh.scope, ...(project.scope || {}), historic:{...fresh.scope.historic,...(project.scope?.historic||{})} },
      procurement: { ...fresh.procurement, ...(project.procurement || {}) },
      division00: Array.isArray(project.division00) ? project.division00 : fresh.division00,
      division01: Array.isArray(project.division01) ? project.division01 : fresh.division01,
      systems: { ...fresh.systems, ...(project.systems || {}) },
      sections: mergeProjectSections(Array.isArray(project.sections) ? project.sections : [], fresh.sections),
      manualDecisions: Array.isArray(project.manualDecisions) ? project.manualDecisions : [],
      activity: Array.isArray(project.activity) ? project.activity : []
    };
  }

  function mergeProjectSections(existing, catalog) {
    const existingMap=new Map(existing.map(item=>[sectionKey(item),normalizeSection(item)]));
    const merged=catalog.map(item=>existingMap.get(sectionKey(item))||normalizeSection(item));
    const catalogKeys=new Set(catalog.map(sectionKey));
    existingMap.forEach((item,key)=>{if(!catalogKeys.has(key))merged.push(item);});
    return dedupeSections(merged);
  }

  function sectionKey(section){return `${String(section.number||'').trim()}|${String(section.title||'').trim()}`.toLowerCase();}

  function inferSectionType(number,title) {
    const n=String(number||''); const t=String(title||'').toLowerCase();
    if(/historic|restor|rehabil|conservation|repair|repoint|maintenance/.test(t))return'preservation';
    if(/^02/.test(n)||/demolition|removal|salvage|existing condition/.test(t))return'demolition';
    if(/^03/.test(n))return'concrete'; if(/^04/.test(n))return'masonry'; if(/^05/.test(n))return'metals';
    if(/^06/.test(n))return /woodwork|casework/.test(t)?'woodwork':'carpentry';
    if(/roof|shingle/.test(t))return'roofing'; if(/sealant|joint protection/.test(t))return'sealants'; if(/^07/.test(n))return'weather';
    if(/hardware/.test(t))return'hardware'; if(/glaz|glass|curtain wall|storefront|window/.test(t))return'glazing'; if(/^08/.test(n))return'doors';
    if(/tile|terrazzo/.test(t))return'tile'; if(/floor|carpet/.test(t))return'flooring'; if(/ceiling/.test(t))return'ceilings'; if(/paint|coating|wall covering|plaster/.test(t))return'painting'; if(/^09/.test(n))return'gypsum';
    if(/^10/.test(n))return'specialties'; if(/^11/.test(n))return'equipment'; if(/^12/.test(n))return'furnishings'; if(/^13/.test(n))return'specialConstruction'; if(/^14/.test(n))return'elevators';
    if(/^2[123678]/.test(n)||/^3[123]/.test(n))return'consultant'; return'generic';
  }

  function defaultSystems() {
    return { demolition:false, concrete:true, masonry:false, metals:true, carpentry:true, envelope:true, roofing:true, openings:true, glazing:true, partitions:true, ceilings:true, flooring:true, wallFinishes:true, specialties:true, equipment:false, furnishings:false, specialConstruction:false, conveying:false };
  }

  function updateShell() {
    const name = state.project.meta.name || 'Untitled Project';
    document.getElementById('sidebar-project').textContent = name;
    document.getElementById('project-subtitle').textContent = `${name} · ${state.project.meta.phase || 'Phase not set'}`;
    document.getElementById('session-user').textContent = `Session: ${state.user}`;
    document.querySelectorAll('.nav-item').forEach(button => button.classList.toggle('is-active', button.dataset.view === state.view));
    const dashboardButton = document.getElementById('dashboard-home');
    const dashboardActive = state.view === 'dashboard';
    dashboardButton.classList.toggle('is-active', dashboardActive);
    dashboardButton.setAttribute('aria-current', dashboardActive ? 'page' : 'false');
    const selectedSections = state.project.sections.filter(section => section.selected && section.status !== 'Excluded');
    const completeSections = selectedSections.filter(section => section.status === 'Outline Complete').length;
    const progress = selectedSections.length ? Math.round((completeSections / selectedSections.length) * 100) : 0;
    document.getElementById('dashboard-progress').textContent = `${progress}% complete · ${allDecisions().length} open decisions`;
  }

  function navigate(view) {
    state.view = view;
    state.activeSectionId = view === 'workspace' ? state.activeSectionId : state.activeSectionId;
    updateShell();
    render();
    main.focus();
  }

  function render() {
    updateShell();
    if (state.view === 'setup') renderSetup();
    else if (state.view === 'dashboard') renderDashboard();
    else if (state.view === 'manual') renderManual();
    else if (state.view === 'sections') renderSections();
    else if (state.view === 'workspace') renderWorkspace();
    else if (state.view === 'decisions') renderDecisions();
    else if (state.view === 'library') renderLibrary();
  }

  function heading(title, subtitle, action='') {
    return `<div class="page-heading"><div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div>${action}</div>`;
  }

  function renderSetup() {
    const labels = ['Project identity','Scope and existing conditions','Delivery and procurement','Division 01 requirements','Building systems','Section review'];
    const step = state.setupStep;
    main.innerHTML = heading('Project setup','Complete the guided setup, then review the recommended architectural sections.') + `
      <div class="wizard-layout">
        <section class="panel">
          <h2>Setup progress</h2>
          <div class="wizard-steps">${labels.map((label,index)=>`<div class="wizard-step ${index===step?'is-current':''}"><span class="step-number">${index+1}</span><span>${label}</span><small>${index<step?'Complete':index===step?'Current':'Not started'}</small></div>`).join('')}</div>
          <div class="progress-track" aria-label="Setup progress"><div class="progress-bar" style="width:${Math.round(((step+1)/labels.length)*100)}%"></div></div>
        </section>
        <section>${setupStepContent(step)}</section>
      </div>`;
    bindSetupEvents();
  }

  function setupStepContent(step) {
    const p = state.project;
    if (step === 0) return `<h2>Project identity</h2><div class="form-grid">
      ${field('Project name','meta.name',p.meta.name,true)}${field('Project number','meta.number',p.meta.number)}${field('Client','meta.client',p.meta.client)}${field('Location','meta.location',p.meta.location)}
      ${selectField('Project phase','meta.phase',p.meta.phase,['Schematic Design','Design Development','Construction Documents','Pricing / GMP','Permit'])}
      ${field('Architect','meta.architect',p.meta.architect)}
      ${textAreaField('Project description','meta.description',p.meta.description,'span-2')}
      </div>${wizardButtons(step)}`;
    if (step === 1) return `<h2>Scope and existing conditions</h2><div class="form-grid">
      ${selectField('Primary project scope','scope.primary',p.scope.primary,['New construction','Addition','Renovation','Interior upfit','Adaptive reuse','Historic preservation / rehabilitation'])}
      ${selectField('Occupancy during construction','scope.occupied',p.scope.occupied,['Not applicable','Vacant','Partially occupied','Fully occupied'])}
      ${textAreaField('Architectural scope narrative','scope.notes',p.scope.notes,'span-2')}
      </div><fieldset class="choice-list"><legend>Applicable scope conditions</legend><div class="check-grid">${SCOPE_TAGS.map(tag=>checkField(tag,'scope-condition',p.scope.conditions.includes(tag))).join('')}</div></fieldset>
      <section class="panel historic-panel"><div class="item-heading"><div><h3>Existing and historic building requirements</h3><p class="subtle">Complete when preservation, rehabilitation, restoration, reconstruction, or adaptive reuse may apply.</p></div><span class="status">Historic workflow</span></div><div class="form-grid">
        ${selectField('Historic designation','scope.historic.designation',p.scope.historic.designation,['Not determined','Not designated','Locally designated','National Register listed or eligible','Contributing resource','Other'])}
        ${selectField('Primary treatment approach','scope.historic.treatment',p.scope.historic.treatment,['Not determined','Preservation','Rehabilitation','Restoration','Reconstruction','Combination'])}
        ${field('Reviewing authority','scope.historic.authority',p.scope.historic.authority)}
        ${selectField('Historic tax credits','scope.historic.taxCredits',p.scope.historic.taxCredits,['Not determined','Not anticipated','State','Federal','State and federal'])}
        ${textAreaField('Survey, investigation, testing, and documentation needs','scope.historic.investigation',p.scope.historic.investigation,'span-2')}
      </div></section>${wizardButtons(step)}`;
    if (step === 2) return `<h2>Delivery and procurement</h2><div class="form-grid">
      ${selectField('Project delivery','procurement.delivery',p.procurement.delivery,['Design-Bid-Build','CM as Constructor / CM at Risk','Negotiated General Contractor','Design-Build','Other'])}
      ${selectField('Pricing approach','procurement.pricing',p.procurement.pricing,['Competitive bid','Negotiated price','GMP development','Multiple bid packages','Not determined'])}
      ${field('Owner-Contractor agreement','procurement.agreement',p.procurement.agreement)}${field('General Conditions','procurement.generalConditions',p.procurement.generalConditions)}
      ${field('Supplementary Conditions status','procurement.supplementaryConditions',p.procurement.supplementaryConditions)}${field('Submittal / collaboration platform','procurement.platform',p.procurement.platform)}
      ${textAreaField('Procurement notes','procurement.notes',p.procurement.notes,'span-2')}
      </div>${wizardButtons(step)}`;
    if (step === 3) return `<h2>Division 01 requirements</h2><p class="subtle">This remains a brief applicability and requirements checklist, not draft specification language.</p>
      <div class="panel">${p.division01.map(item=>`<div class="tracker-row"><div class="item-heading"><label class="check-row"><input type="checkbox" data-div01-applicable="${item.id}" ${item.applicable?'checked':''}><strong>${escapeHtml(item.label)}</strong></label><select data-div01-status="${item.id}"><option ${selected('Not Addressed',item.status)}>Not Addressed</option><option ${selected('Addressed',item.status)}>Addressed</option><option ${selected('Not Applicable',item.status)}>Not Applicable</option></select></div><label class="field"><span>Requirement or note</span><input data-div01-note="${item.id}" value="${escapeAttr(item.notes)}" placeholder="Brief requirement, responsibility, or unresolved item"></label></div>`).join('')}</div>${wizardButtons(step)}`;
    if (step === 4) return `<h2>Building systems</h2><p class="subtle">Plain-language systems map to CSI sections. You will manually review every recommendation next.</p>
      <div class="panel check-grid">${Object.entries(systemLabels()).map(([key,label])=>checkField(label,'system',Boolean(p.systems[key]),key)).join('')}</div>${wizardButtons(step)}`;
    return `<h2>Review recommended sections</h2><p>The questionnaire currently recommends <strong>${p.sections.filter(s=>s.recommended).length}</strong> of ${p.sections.length.toLocaleString()} available sections. Recommendations never hide the complete catalog.</p>
      <div class="panel"><div class="status-row"><span class="status">${p.sections.filter(s=>s.recommended).length} recommended</span><span class="status">${p.sections.filter(s=>s.selected).length} selected</span><span class="status">${p.sections.filter(s=>s.custom).length} custom</span></div><hr class="divider"><p>Open Section Selection to search the entire master catalog and confirm the project-manual scope.</p><button class="button" data-open-sections type="button">Open section selection</button></div>
      <div class="wizard-actions"><button class="button" data-setup-back type="button">Back</button><button class="button button-primary" data-finish-setup type="button">Finish setup and open dashboard</button></div>`;
  }

  function wizardButtons(step) {
    return `<div class="wizard-actions"><button class="button" data-setup-back type="button" ${step===0?'disabled':''}>Back</button><button class="button button-primary" data-setup-next type="button">Continue</button></div>`;
  }

  function bindSetupEvents() {
    main.querySelectorAll('[data-path]').forEach(input => input.addEventListener('input', () => { setPath(state.project,input.dataset.path,input.value); if(input.dataset.path.startsWith('scope.'))applySystemSelections(); changed(); updateShell(); }));
    main.querySelectorAll('[data-setup-back]').forEach(button => button.addEventListener('click', () => { state.setupStep=Math.max(0,state.setupStep-1); state.project.setupStep=state.setupStep; render(); }));
    main.querySelectorAll('[data-setup-next]').forEach(button => button.addEventListener('click', () => { state.setupStep=Math.min(5,state.setupStep+1); state.project.setupStep=state.setupStep; recordActivity(`Completed setup step ${state.setupStep}`); changed(); render(); }));
    main.querySelector('[data-finish-setup]')?.addEventListener('click', () => { state.project.setupStep=5; recordActivity('Completed project setup'); changed(); navigate('dashboard'); });
    main.querySelector('[data-open-sections]')?.addEventListener('click',()=>navigate('sections'));
    main.querySelectorAll('[data-kind="scope-condition"]').forEach(input => input.addEventListener('change', () => { state.project.scope.conditions=[...main.querySelectorAll('[data-kind="scope-condition"]:checked')].map(i=>i.value); applySystemSelections(); changed(); }));
    main.querySelectorAll('[data-kind="system"]').forEach(input => input.addEventListener('change', () => { state.project.systems[input.value]=input.checked; applySystemSelections(); changed(); }));
    main.querySelectorAll('[data-div01-applicable]').forEach(input => input.addEventListener('change', () => { findDiv01(input.dataset.div01Applicable).applicable=input.checked; changed(); }));
    main.querySelectorAll('[data-div01-status]').forEach(input => input.addEventListener('change', () => { findDiv01(input.dataset.div01Status).status=input.value; changed(); }));
    main.querySelectorAll('[data-div01-note]').forEach(input => input.addEventListener('input', () => { findDiv01(input.dataset.div01Note).notes=input.value; changed(); }));
  }

  function renderDashboard() {
    const selectedSections = selectedSectionsSorted();
    const complete = selectedSections.filter(s=>s.status==='Outline Complete').length;
    const decisions = allDecisions();
    const pct = selectedSections.length ? Math.round((complete/selectedSections.length)*100) : 0;
    main.innerHTML = heading('Project dashboard','Current outline status and the next decisions that move it forward.',`<button class="button" data-go-setup type="button">Resume setup</button>`) + `
      <div class="grid-4">
        ${metric('Selected sections',selectedSections.length,`${state.project.sections.length.toLocaleString()} available in master catalog`)}${metric('Outline complete',complete,`${pct}% of selected sections`)}${metric('Open decisions',decisions.length,'Required fields and manual items')}${metric('Division 01',state.project.division01.filter(i=>i.status==='Addressed').length,`of ${state.project.division01.filter(i=>i.applicable).length} applicable addressed`)}
      </div>
      <div class="grid-2" style="margin-top:1rem">
        <section class="panel"><h2>Section status</h2><div class="status-row">${statusSummary(selectedSections)}</div><div class="progress-track" style="margin-top:1rem"><div class="progress-bar" style="width:${pct}%"></div></div></section>
        <section class="panel"><div class="item-heading"><h2>Next decisions</h2><button class="text-button" data-go-decisions type="button">View all</button></div>${decisions.slice(0,4).map(decisionMini).join('') || '<p class="subtle">No unresolved decisions.</p>'}</section>
      </div>
      <section class="panel" style="margin-top:1rem"><h2>Project manual readiness</h2><div class="grid-3"><div><span class="metric-label">Division 00 tracker</span><strong>${state.project.division00.filter(i=>i.status!=='Not Determined').length} of ${state.project.division00.length} identified</strong></div><div><span class="metric-label">Required content groups</span><strong>${selectedSections.filter(sectionComplete).length} sections complete</strong></div><div><span class="metric-label">Last activity</span><strong>${escapeHtml(activityLabel())}</strong></div></div></section>`;
    main.querySelector('[data-go-setup]').addEventListener('click',()=>navigate('setup'));
    main.querySelector('[data-go-decisions]').addEventListener('click',()=>navigate('decisions'));
  }

  function renderManual() {
    const p=state.project;
    main.innerHTML = heading('Project manual setup','Track front-end document responsibility and brief Division 01 requirements.') + `
      <div class="grid-2">
        <section><h2>Division 00 tracker</h2><div class="panel">${p.division00.map(item=>`<div class="tracker-row"><strong>${escapeHtml(item.label)}</strong><div class="form-grid" style="margin-top:.6rem">${selectRaw('Status',`data-div00-status="${item.id}"`,item.status,['Not Determined','Required','In Progress','Complete','Not Applicable'])}${fieldRaw('Responsible party',`data-div00-responsible="${item.id}"`,item.responsible)}${fieldRaw('Reference or filename',`data-div00-reference="${item.id}"`,item.reference,'span-2')}</div></div>`).join('')}</div></section>
        <section><h2>Division 01 checklist</h2><div class="panel">${p.division01.map(item=>`<div class="tracker-row"><div class="item-heading"><label class="check-row"><input type="checkbox" data-manual-div01="${item.id}" ${item.applicable?'checked':''}><strong>${escapeHtml(item.label)}</strong></label><span class="status ${item.status==='Addressed'?'complete':item.status==='Not Applicable'?'excluded':'decision'}">${escapeHtml(item.status)}</span></div><label class="field"><span>Brief requirement</span><input data-manual-div01-note="${item.id}" value="${escapeAttr(item.notes)}"></label><select data-manual-div01-status="${item.id}"><option ${selected('Not Addressed',item.status)}>Not Addressed</option><option ${selected('Addressed',item.status)}>Addressed</option><option ${selected('Not Applicable',item.status)}>Not Applicable</option></select></div>`).join('')}</div></section>
      </div>
      <section class="panel" style="margin-top:1rem"><h2>Spec consultant handoff notes</h2><label class="field"><span>Project-wide assumptions, risks, and coordination notes</span><textarea data-handoff-notes rows="5">${escapeHtml(p.handoffNotes||'')}</textarea></label></section>`;
    main.querySelectorAll('[data-div00-status]').forEach(el=>el.addEventListener('change',()=>{findDiv00(el.dataset.div00Status).status=el.value;changed();}));
    main.querySelectorAll('[data-div00-responsible]').forEach(el=>el.addEventListener('input',()=>{findDiv00(el.dataset.div00Responsible).responsible=el.value;changed();}));
    main.querySelectorAll('[data-div00-reference]').forEach(el=>el.addEventListener('input',()=>{findDiv00(el.dataset.div00Reference).reference=el.value;changed();}));
    main.querySelectorAll('[data-manual-div01]').forEach(el=>el.addEventListener('change',()=>{findDiv01(el.dataset.manualDiv01).applicable=el.checked;changed();}));
    main.querySelectorAll('[data-manual-div01-note]').forEach(el=>el.addEventListener('input',()=>{findDiv01(el.dataset.manualDiv01Note).notes=el.value;changed();}));
    main.querySelectorAll('[data-manual-div01-status]').forEach(el=>el.addEventListener('change',()=>{findDiv01(el.dataset.manualDiv01Status).status=el.value;changed();renderManual();}));
    main.querySelector('[data-handoff-notes]').addEventListener('input',event=>{state.project.handoffNotes=event.target.value;changed();});
  }

  function renderSections() {
    const all = [...state.project.sections].sort(sectionSort);
    const divisions=[...new Set(all.map(s=>s.division))].sort();
    const f=state.sectionFilters;
    const sections=all.filter(s=>{
      const haystack=`${s.number} ${s.title} ${s.system} ${s.category} ${s.divisionTitle}`.toLowerCase();
      return (!f.search||haystack.includes(f.search.toLowerCase())) && (f.division==='All'||s.division===f.division) && (f.status==='All'||s.status===f.status) && (f.view==='All'||(f.view==='Recommended'&&s.recommended)||(f.view==='Selected'&&s.selected)||(f.view==='Historic / Existing'&&['preservation','demolition'].includes(s.type))||(f.view==='Custom'&&s.custom));
    });
    const pageSize=100; const pageCount=Math.max(1,Math.ceil(sections.length/pageSize)); state.sectionPage=Math.min(state.sectionPage,pageCount-1);
    const shown=sections.slice(state.sectionPage*pageSize,(state.sectionPage+1)*pageSize);
    main.innerHTML = heading('Section selection','Search and select from the complete master catalog. Questionnaire recommendations are guidance, not restrictions.',`<button class="button" data-add-section type="button">Add custom section</button>`) + `
      <section class="catalog-summary"><div><strong>${all.length.toLocaleString()}</strong><span>master and custom sections</span></div><div><strong>${all.filter(s=>s.recommended).length}</strong><span>recommended</span></div><div><strong>${all.filter(s=>s.selected).length}</strong><span>selected</span></div><div><strong>${all.filter(s=>s.status==='Outline Complete').length}</strong><span>outline complete</span></div></section>
      <section class="panel section-filters"><label class="field"><span>Search catalog</span><input data-filter-search value="${escapeAttr(f.search)}" placeholder="Number, title, system, material, or keyword"></label><div class="filter-grid">
        ${selectRaw('Division','data-filter-division',f.division,['All',...divisions])}
        ${selectRaw('Status','data-filter-status',f.status,['All',...STATUS_OPTIONS])}
        ${selectRaw('Show','data-filter-view',f.view,['All','Recommended','Selected','Historic / Existing','Custom'])}
      </div><div class="actions-inline"><button class="button button-small" data-select-visible type="button">Select filtered results</button><button class="button button-small" data-clear-visible type="button">Clear filtered results</button><button class="button button-small ${state.sectionDisplay==='table'?'button-primary':''}" data-display="table" type="button">Table</button><button class="button button-small ${state.sectionDisplay==='cards'?'button-primary':''}" data-display="cards" type="button">Cards</button></div></section>
      <div class="catalog-results-head"><p><strong>${sections.length.toLocaleString()}</strong> matching sections · showing ${sections.length?state.sectionPage*pageSize+1:0}–${Math.min((state.sectionPage+1)*pageSize,sections.length)}</p><div class="actions-inline"><button class="button button-small" data-page-prev ${state.sectionPage===0?'disabled':''}>Previous</button><span class="page-count">Page ${state.sectionPage+1} of ${pageCount}</span><button class="button button-small" data-page-next ${state.sectionPage>=pageCount-1?'disabled':''}>Next</button></div></div>
      ${shown.length?(state.sectionDisplay==='table'?sectionTable(shown):sectionCards(shown)):'<div class="empty-state">No sections match the current filters.</div>'}`;
    main.querySelectorAll('[data-display]').forEach(button=>button.addEventListener('click',()=>{state.sectionDisplay=button.dataset.display;renderSections();}));
    main.querySelector('[data-filter-search]').addEventListener('change',event=>{state.sectionFilters.search=event.target.value;state.sectionPage=0;renderSections();});
    main.querySelector('[data-filter-division]').addEventListener('change',event=>{state.sectionFilters.division=event.target.value;state.sectionPage=0;renderSections();});
    main.querySelector('[data-filter-status]').addEventListener('change',event=>{state.sectionFilters.status=event.target.value;state.sectionPage=0;renderSections();});
    main.querySelector('[data-filter-view]').addEventListener('change',event=>{state.sectionFilters.view=event.target.value;state.sectionPage=0;renderSections();});
    main.querySelector('[data-page-prev]').addEventListener('click',()=>{state.sectionPage--;renderSections();});
    main.querySelector('[data-page-next]').addEventListener('click',()=>{state.sectionPage++;renderSections();});
    main.querySelector('[data-select-visible]').addEventListener('click',()=>{sections.forEach(s=>{s.selected=true;if(['Not Reviewed','Not Applicable','Excluded'].includes(s.status))s.status='Included';});changed();renderSections();});
    main.querySelector('[data-clear-visible]').addEventListener('click',()=>{sections.forEach(s=>{s.selected=false;if(s.status==='Included')s.status='Not Reviewed';});changed();renderSections();});
    main.querySelectorAll('[data-section-open]').forEach(button=>button.addEventListener('click',()=>openSection(button.dataset.sectionOpen)));
    main.querySelectorAll('[data-section-select]').forEach(input=>input.addEventListener('change',()=>{const s=findSection(input.dataset.sectionSelect);s.selected=input.checked;s.status=input.checked&&s.status==='Not Reviewed'?'Included':s.status;changed();renderSections();}));
    main.querySelectorAll('[data-row-status]').forEach(input=>input.addEventListener('change',()=>{const s=findSection(input.dataset.rowStatus);s.status=input.value;s.selected=!['Not Reviewed','Not Applicable','Excluded'].includes(input.value);changed();renderSections();}));
    main.querySelector('[data-add-section]').addEventListener('click',()=>addCustomSection(false));
  }

  function sectionTable(sections) {
    return `<div class="table-wrap"><table><thead><tr><th>Include</th><th>Section</th><th>Library group</th><th>Recommendation</th><th>Status</th><th>Scope</th></tr></thead><tbody>${sections.map(s=>`<tr class="${s.selected?'row-selected':''}"><td><input type="checkbox" data-section-select="${s.id}" ${s.selected?'checked':''} aria-label="Include ${escapeAttr(s.title)}"></td><td><button class="section-button" data-section-open="${s.id}" type="button"><strong>${escapeHtml(s.number)}</strong>${escapeHtml(s.title)}</button></td><td><strong>Division ${escapeHtml(s.division)}</strong><small>${escapeHtml(s.category||s.system||'General')}</small></td><td>${s.recommended?`<span class="status recommended">Recommended</span>${s.recommendationReasons.length?`<small>${escapeHtml(s.recommendationReasons.join(', '))}</small>`:''}`:'<span class="subtle">Available</span>'}</td><td>${selectRaw('',`data-row-status="${s.id}"`,s.status,STATUS_OPTIONS)}</td><td>${escapeHtml(s.scopeInstances.length?`${s.scopeInstances.length} scope instance${s.scopeInstances.length===1?'':'s'}`:(s.scopeTags.join(', ')||'Not assigned'))}</td></tr>`).join('')}</tbody></table></div>`;
  }

  function sectionCards(sections) {
    return `<div class="card-grid">${sections.map(s=>`<article class="section-card ${s.selected?'row-selected':''}"><div class="section-card-head"><div><strong>${escapeHtml(s.number)}</strong><h3>${escapeHtml(s.title)}</h3></div>${s.recommended?'<span class="status recommended">Recommended</span>':''}</div><p>${escapeHtml(s.category||s.system||`Division ${s.division}`)}</p><div class="item-heading"><label class="check-row"><input type="checkbox" data-section-select="${s.id}" ${s.selected?'checked':''}> Include</label><button class="button button-small" data-section-open="${s.id}" type="button">Open section</button></div></article>`).join('')}</div>`;
  }

  function openSection(id) { state.activeSectionId=id; state.view='workspace'; updateShell(); renderWorkspace(); main.focus(); }

  function renderWorkspace() {
    const section = findSection(state.activeSectionId) || selectedSectionsSorted()[0] || state.project.sections[0];
    if (!section) { navigate('sections'); return; }
    state.activeSectionId=section.id;
    const guides = guidedByType[section.type] || ['System type and application','Materials and components','Performance criteria','Appearance and finish','Quality level','Coordination requirements'];
    const completeness = completionState(section);
    main.innerHTML = `<div class="page-heading"><div><button class="text-button" data-back-sections type="button">← Back to sections</button><div class="section-title-line"><h1>${escapeHtml(section.number)} · ${escapeHtml(section.title)}</h1></div><p>${escapeHtml(section.system)}</p></div>${selectRaw('Section status','data-section-status',section.status,STATUS_OPTIONS)}</div>
      <div class="tag-row">${section.scopeTags.map(tag=>`<span class="tag">${escapeHtml(tag)}</span>`).join('')}<button class="text-button" data-edit-tags type="button">Edit scope tags</button></div>
      <section class="panel scope-instance-panel"><div class="item-heading"><div><h2>Scope instances</h2><p class="subtle">Describe each distinct application of this section—for example, historic repair, reconstructed work, an addition, and a new wing.</p></div><button class="button button-small" data-add-scope-instance type="button">Add scope instance</button></div>
        ${section.scopeInstances.length?`<div class="scope-instance-list">${section.scopeInstances.map(item=>`<article class="scope-instance"><div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml([item.area,item.treatment].filter(Boolean).join(' · '))}</small>${item.notes?`<p>${escapeHtml(item.notes)}</p>`:''}</div><div class="actions-inline"><button class="text-button" data-edit-scope-instance="${item.id}" type="button">Edit</button><button class="text-button" data-remove-scope-instance="${item.id}" type="button">Remove</button></div></article>`).join('')}</div>`:'<div class="empty-state compact">No scope instances added. Use the section-wide fields below when only one condition applies.</div>'}
      </section>
      <div class="workspace-grid">
        <div>
          ${partBlock('Part 1 · General',[
            area('Scope and system description','scope',section.fields.scope,true),
            area('Performance and quality level','performance',section.fields.performance,true),
            area('Submittals, mockups, warranties, and delegated design','submittals',section.fields.submittals,false),
            area('Coordination and drawing references','coordination',section.fields.coordination,false)
          ],section)}
          ${partBlock('Part 2 · Products',[
            selectRaw('Specifying approach','data-specifying-approach',section.specifyingApproach,['Choose per section','Basis of design plus comparable products','Performance requirements','Named products only']),
            area('Products and manufacturers','products',section.fields.products,true),
            area('Colors, profiles, and finishes','finishes',section.fields.finishes,true)
          ],section)}
          ${partBlock('Part 3 · Execution',[area('Preparation, installation intent, field quality control, cleaning, and protection','execution',section.fields.execution,false)],section)}
          <label class="field"><span>General section notes</span><textarea data-section-notes rows="3">${escapeHtml(section.notes)}</textarea></label>
        </div>
        <aside>
          <section class="panel"><h2>Responsibility and coordination</h2>
            ${selectRaw('Responsible discipline','data-responsibility="discipline"',section.responsibility.discipline,['Architectural','Structural','Civil','Landscape','Fire Protection','Plumbing','Mechanical','Electrical','Technology / AV','Security','Interiors','Foodservice','Vertical Transportation','Owner','Contractor','Other'])}
            ${selectRaw('Expected author','data-responsibility="author"',section.responsibility.author,['Project team','Outside specification consultant','Design consultant','Owner consultant','Contractor / delegated designer','Not determined'])}
            <div class="check-grid single-column">
              <label class="check-row"><input type="checkbox" data-responsibility-check="architectSelection" ${section.responsibility.architectSelection?'checked':''}> <span>Architect selection required</span></label>
              <label class="check-row"><input type="checkbox" data-responsibility-check="consultantInput" ${section.responsibility.consultantInput?'checked':''}> <span>Consultant input required</span></label>
              <label class="check-row"><input type="checkbox" data-responsibility-check="drawingCoordination" ${section.responsibility.drawingCoordination?'checked':''}> <span>Drawing coordination required</span></label>
            </div>${fieldRaw('Information due','data-responsibility="due"',section.responsibility.due,'','date')}
          </section>
          <section class="panel"><h2>Guided questions</h2>${guides.map(question=>`<label class="field"><span>${escapeHtml(question)}</span><input data-guide="${escapeAttr(question)}" value="${escapeAttr(section.guided[question]||'')}" placeholder="Not determined"></label>`).join('')}</section>
          <section class="panel" style="margin-top:1rem"><div class="item-heading"><h2>References</h2><button class="button button-small" data-add-reference type="button">Add</button></div>${section.references.map(ref=>referenceItem(ref,section)).join('')||'<p class="subtle">No references added.</p>'}</section>
          <section class="panel" style="margin-top:1rem"><h2>Completion</h2><div class="completion-grid">${Object.entries(completeness).map(([key,value])=>`<div class="completion-item"><span>${completionLabel(key)}</span><span class="status ${value?'complete':'decision'}">${value?'Complete':'Required'}</span></div>`).join('')}</div></section>
        </aside>
      </div>
      <div class="wizard-actions"><button class="button" data-prev-section type="button">Previous section</button><button class="button button-primary" data-next-section type="button">Save and next section</button></div>`;
    main.querySelector('[data-back-sections]').addEventListener('click',()=>navigate('sections'));
    main.querySelector('[data-section-status]').addEventListener('change',event=>{section.status=event.target.value;section.selected=!['Not Reviewed','Not Applicable','Excluded'].includes(event.target.value);changed();renderWorkspace();});
    main.querySelector('[data-specifying-approach]').addEventListener('change',event=>{section.specifyingApproach=event.target.value;changed();});
    main.querySelectorAll('[data-section-field]').forEach(el=>el.addEventListener('input',()=>{section.fields[el.dataset.sectionField]=el.value;autoSectionStatus(section);changed();updateCompletionBadges(section);}));
    main.querySelector('[data-section-notes]').addEventListener('input',event=>{section.notes=event.target.value;changed();});
    main.querySelectorAll('[data-guide]').forEach(el=>el.addEventListener('input',()=>{section.guided[el.dataset.guide]=el.value;changed();}));
    main.querySelectorAll('[data-responsibility]').forEach(el=>el.addEventListener('input',()=>{section.responsibility[el.dataset.responsibility]=el.value;changed();}));
    main.querySelectorAll('[data-responsibility-check]').forEach(el=>el.addEventListener('change',()=>{section.responsibility[el.dataset.responsibilityCheck]=el.checked;changed();}));
    main.querySelector('[data-edit-tags]').addEventListener('click',()=>editScopeTags(section));
    main.querySelector('[data-add-scope-instance]').addEventListener('click',()=>addScopeInstance(section));
    main.querySelectorAll('[data-edit-scope-instance]').forEach(button=>button.addEventListener('click',()=>editScopeInstance(section,button.dataset.editScopeInstance)));
    main.querySelectorAll('[data-remove-scope-instance]').forEach(button=>button.addEventListener('click',()=>{if(!confirm('Remove this scope instance?'))return;section.scopeInstances=section.scopeInstances.filter(item=>item.id!==button.dataset.removeScopeInstance);changed();renderWorkspace();}));
    main.querySelector('[data-add-reference]').addEventListener('click',()=>{state.referenceSectionId=section.id;document.getElementById('reference-form').reset();referenceDialog.showModal();});
    main.querySelectorAll('[data-remove-reference]').forEach(button=>button.addEventListener('click',()=>{section.references=section.references.filter(r=>r.id!==button.dataset.removeReference);changed();renderWorkspace();}));
    main.querySelector('[data-prev-section]').addEventListener('click',()=>stepSection(-1));
    main.querySelector('[data-next-section]').addEventListener('click',()=>stepSection(1));
  }

  function renderDecisions() {
    const decisions=allDecisions();
    main.innerHTML = heading('Unresolved decision log','Required outline information remains visible here and within its section.',`<button class="button" data-add-decision type="button">Add manual decision</button>`) + `
      <div class="decision-list">${decisions.map(decision=>`<article class="decision-card"><div class="item-heading"><div><strong>${escapeHtml(decision.sectionNumber||'Project-wide')} · ${escapeHtml(decision.sectionTitle||'Manual decision')}</strong><p>${escapeHtml(decision.text)}</p></div><span class="status decision">Open</span></div><div class="form-grid">${fieldRaw('Responsible party',`data-decision-owner="${decision.id}"`,decision.owner||'')}${fieldRaw('Due date',`data-decision-date="${decision.id}"`,decision.due||'', '', 'date')}</div>${decision.sectionId?`<button class="text-button" data-decision-section="${decision.sectionId}" type="button">Open section</button>`:`<button class="text-button" data-remove-manual-decision="${decision.id}" type="button">Remove</button>`}</article>`).join('')||'<div class="empty-state">No unresolved decisions.</div>'}</div>`;
    main.querySelector('[data-add-decision]').addEventListener('click',addManualDecision);
    main.querySelectorAll('[data-decision-section]').forEach(button=>button.addEventListener('click',()=>openSection(button.dataset.decisionSection)));
    main.querySelectorAll('[data-decision-owner]').forEach(el=>el.addEventListener('input',()=>updateDecisionMeta(el.dataset.decisionOwner,'owner',el.value)));
    main.querySelectorAll('[data-decision-date]').forEach(el=>el.addEventListener('input',()=>updateDecisionMeta(el.dataset.decisionDate,'due',el.value)));
    main.querySelectorAll('[data-remove-manual-decision]').forEach(button=>button.addEventListener('click',()=>{state.project.manualDecisions=state.project.manualDecisions.filter(d=>d.id!==button.dataset.removeManualDecision);changed();renderDecisions();}));
  }

  function renderLibrary() {
    const custom=state.firmLibrary.sections||[];
    main.innerHTML = heading('Section library','The neutral master catalog is built in. Maintain reusable office guidance and custom sections separately.',`<button class="button button-primary" data-library-add type="button">Add reusable section</button>`) + `
      <div class="grid-2">
        <section class="panel"><h2>Reusable custom library</h2><p class="subtle">Office guidance and custom sections are stored in this browser and can be distributed as a portable file.</p><div class="actions-inline"><button class="button" data-library-import type="button">Import custom list</button><button class="button" data-library-open type="button">Open custom library</button><button class="button" data-library-export type="button">Save custom library</button></div><input data-library-file type="file" accept=".json,.csv,text/csv,application/json" hidden></section>
        <section class="panel"><h2>Current libraries</h2><div class="grid-3"><div><span class="metric-label">Master sections</span><strong>${MASTER_CATALOG.length.toLocaleString()}</strong></div><div><span class="metric-label">Reusable custom sections</span><strong>${custom.length}</strong></div><div><span class="metric-label">Project sections</span><strong>${state.project.sections.length.toLocaleString()}</strong></div></div></section>
      </div>
      <section class="panel" style="margin-top:1rem"><h2>Reusable custom sections</h2>${custom.length?`<div class="table-wrap"><table><thead><tr><th>Section</th><th>Plain-language system</th><th></th></tr></thead><tbody>${custom.map(s=>`<tr><td><strong>${escapeHtml(s.number)}</strong><br>${escapeHtml(s.title)}</td><td>${escapeHtml(s.system)}</td><td><button class="text-button" data-library-remove="${s.id}" type="button">Remove</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty-state">No reusable custom sections have been added.</div>'}</section>`;
    main.querySelector('[data-library-add]').addEventListener('click',()=>addCustomSection(true));
    main.querySelector('[data-library-import]').addEventListener('click',()=>main.querySelector('[data-library-file]').click());
    main.querySelector('[data-library-open]').addEventListener('click',()=>main.querySelector('[data-library-file]').click());
    main.querySelector('[data-library-file]').addEventListener('change',importLibraryFile);
    main.querySelector('[data-library-export]').addEventListener('click',exportFirmLibrary);
    main.querySelectorAll('[data-library-remove]').forEach(button=>button.addEventListener('click',()=>{state.firmLibrary.sections=custom.filter(s=>s.id!==button.dataset.libraryRemove);saveFirmLibrary();renderLibrary();}));
  }

  function renderWorkspaceFieldPlaceholder(section,key) {
    return section.fields[key].trim() ? '' : `<div class="placeholder"><strong>Decision required:</strong> ${escapeHtml(completionLabel(key))} has not been established.</div>`;
  }

  function partBlock(title,controls,section) {
    const relevant = title.includes('General')?['scope','performance']:title.includes('Products')?['products','finishes']:[];
    return `<section class="panel part-block"><h2>${title}</h2>${controls.join('')}${relevant.map(key=>renderWorkspaceFieldPlaceholder(section,key)).join('')}</section>`;
  }

  function area(label,key,value,required) { return `<label class="field"><span>${escapeHtml(label)} ${required?'<span class="required">Required</span>':''}</span><textarea data-section-field="${key}" rows="3">${escapeHtml(value)}</textarea></label>`; }

  function updateCompletionBadges(section) {
    const blocks=main.querySelectorAll('.completion-item .status');
    Object.values(completionState(section)).forEach((value,index)=>{const el=blocks[index];if(el){el.textContent=value?'Complete':'Required';el.className=`status ${value?'complete':'decision'}`;}});
  }

  function renderDecisionsForExport() { return allDecisions(); }

  function allDecisions() {
    const fieldDecisions=selectedSectionsSorted().flatMap(section=>sectionDecisions(section));
    return [...fieldDecisions,...state.project.manualDecisions.map(d=>({...d,sectionNumber:'',sectionTitle:'Manual decision'}))];
  }

  function sectionDecisions(section) {
    const labels={scope:'Define scope and system description',performance:'Establish performance and quality level',products:'Identify products and manufacturers',finishes:'Confirm colors, profiles, and finishes'};
    section.decisionMeta=section.decisionMeta||{};
    return Object.entries(labels).filter(([key])=>!String(section.fields[key]||'').trim()).map(([key,text])=>({id:`${section.id}:${key}`,sectionId:section.id,sectionNumber:section.number,sectionTitle:section.title,key,text,...(section.decisionMeta[key]||{})}));
  }

  function updateDecisionMeta(id,key,value) {
    if (id.includes(':')) { const [sectionId,field]=id.split(':'); const section=findSection(sectionId); section.decisionMeta=section.decisionMeta||{}; section.decisionMeta[field]={...(section.decisionMeta[field]||{}),[key]:value}; }
    else { const decision=state.project.manualDecisions.find(d=>d.id===id); if(decision) decision[key]=value; }
    changed();
  }

  function addManualDecision() {
    const text=prompt('Describe the unresolved decision:');
    if (!text?.trim()) return;
    state.project.manualDecisions.push({id:makeId(),text:text.trim(),owner:'',due:''}); changed(); renderDecisions();
  }

  function editScopeTags(section) {
    const current=new Set(section.scopeTags);
    const answer=prompt(`Enter applicable scope tags separated by semicolons:\n\n${SCOPE_TAGS.join('; ')}`,section.scopeTags.join('; '));
    if (answer===null) return;
    section.scopeTags=answer.split(';').map(x=>x.trim()).filter(Boolean);
    if (!section.scopeTags.length && current.size) section.scopeTags=[];
    changed(); renderWorkspace();
  }

  function addScopeInstance(section) {
    const name=prompt('Scope instance name (for example, Existing historic exterior walls):'); if(!name?.trim())return;
    const area=prompt('Building area, wing, floor, or location:')||'';
    const treatment=prompt(`Treatment or work condition:\n\n${SCOPE_TAGS.join('; ')}`)||'';
    const notes=prompt('Brief scope description or distinguishing requirements:')||'';
    section.scopeInstances.push({id:makeId(),name:name.trim(),area:area.trim(),treatment:treatment.trim(),notes:notes.trim()});
    if(treatment.trim()&&!section.scopeTags.includes(treatment.trim()))section.scopeTags.push(treatment.trim());
    section.selected=true;if(section.status==='Not Reviewed')section.status='Included';changed();renderWorkspace();
  }

  function editScopeInstance(section,id) {
    const item=section.scopeInstances.find(entry=>entry.id===id);if(!item)return;
    const name=prompt('Scope instance name:',item.name);if(name===null||!name.trim())return;
    const area=prompt('Building area, wing, floor, or location:',item.area);if(area===null)return;
    const treatment=prompt(`Treatment or work condition:\n\n${SCOPE_TAGS.join('; ')}`,item.treatment);if(treatment===null)return;
    const notes=prompt('Brief scope description or distinguishing requirements:',item.notes);if(notes===null)return;
    Object.assign(item,{name:name.trim(),area:area.trim(),treatment:treatment.trim(),notes:notes.trim()});changed();renderWorkspace();
  }

  function stepSection(direction) {
    const sections=selectedSectionsSorted();
    const index=sections.findIndex(s=>s.id===state.activeSectionId);
    if (!sections.length) return;
    state.activeSectionId=sections[(index+direction+sections.length)%sections.length].id;
    recordActivity(`Opened section ${findSection(state.activeSectionId).number}`); changed(); renderWorkspace(); main.scrollTo?.(0,0);
  }

  async function addReference(event) {
    event.preventDefault();
    const section=findSection(state.referenceSectionId); if(!section)return;
    const form=new FormData(event.currentTarget); const file=form.get('attachment');
    const ref={id:makeId(),label:String(form.get('label')||'Reference'),value:String(form.get('value')||''),kind:'note',fileName:'',mime:'',size:0,data:''};
    if(file instanceof File && file.size){ref.kind='attachment';ref.fileName=file.name;ref.mime=file.type;ref.size=file.size;ref.data=await fileToDataUrl(file);}
    else if(/^https?:\/\//i.test(ref.value)){ref.kind='link';}
    else if(ref.value){ref.kind='note';}
    section.references.push(ref); referenceDialog.close(); changed(); renderWorkspace();
  }

  function referenceItem(ref) {
    const detail=ref.kind==='attachment'?`Embedded · ${formatBytes(ref.size)}`:ref.kind==='link'?'Web link':'Note or filename';
    return `<div class="reference-item"><div class="item-heading"><div><strong>${escapeHtml(ref.label)}</strong><small>${escapeHtml(detail)}</small>${ref.value?`<small>${escapeHtml(ref.value)}</small>`:''}</div><button class="text-button" data-remove-reference="${ref.id}" type="button">Remove</button></div></div>`;
  }

  function addCustomSection(reusable) {
    const number=prompt('CSI section number (for example, 09 77 00):'); if(!number?.trim())return;
    const title=prompt('Section title:'); if(!title?.trim())return;
    const system=prompt('Plain-language system description:')||'';
    const section=normalizeSection({number:number.trim(),title:title.trim(),system:system.trim(),division:number.trim().slice(0,2),custom:true,reusable,selected:!reusable,status:reusable?'Not Reviewed':'Included'});
    if(reusable){state.firmLibrary.sections.push(section);state.firmLibrary.version=(state.firmLibrary.version||1)+1;saveFirmLibrary();renderLibrary();}
    else{state.project.sections.push(section);recordActivity(`Added custom section ${section.number}`);changed();renderSections();}
  }

  async function importLibraryFile(event) {
    const file=event.target.files?.[0];event.target.value='';if(!file)return;
    try {
      const text=await file.text(); let imported=[];
      if(file.name.toLowerCase().endsWith('.csv')) imported=parseSectionCsv(text);
      else { const data=JSON.parse(text); imported=Array.isArray(data)?data:(data.sections||[]); }
      const normalized=imported.map(item=>normalizeSection({...item,custom:true,reusable:true,selected:false})).filter(s=>s.number&&s.title);
      state.firmLibrary.sections=dedupeSections([...state.firmLibrary.sections,...normalized]); state.firmLibrary.version=(state.firmLibrary.version||1)+1; saveFirmLibrary();
      notify(`Imported ${normalized.length} reusable sections.`); renderLibrary();
    } catch(error){notify('The section-list file could not be imported. Use CSV with number, title, and optional system columns, or a saved firm-library file.');}
  }

  function parseSectionCsv(text) {
    const rows=text.split(/\r?\n/).filter(Boolean).map(parseCsvRow); if(!rows.length)return[];
    const headers=rows[0].map(x=>x.trim().toLowerCase());
    const numberIndex=headers.findIndex(x=>x.includes('number')||x==='section'); const titleIndex=headers.findIndex(x=>x.includes('title')); const systemIndex=headers.findIndex(x=>x.includes('system')||x.includes('description'));
    return rows.slice(1).map(row=>({number:row[numberIndex>=0?numberIndex:0]||'',title:row[titleIndex>=0?titleIndex:1]||'',system:row[systemIndex>=0?systemIndex:2]||''}));
  }

  function parseCsvRow(line) { const out=[];let value='';let quoted=false;for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"'&&line[i+1]==='"'&&quoted){value+='"';i++;}else if(ch==='"'){quoted=!quoted;}else if(ch===','&&!quoted){out.push(value);value='';}else value+=ch;}out.push(value);return out; }
  function dedupeSections(sections){const map=new Map();sections.forEach(s=>map.set(`${s.number}|${s.title}`.toLowerCase(),s));return [...map.values()];}

  function exportFirmLibrary() { downloadJson(`Redline_Custom_Spec_Library_v${state.firmLibrary.version||1}.json`,state.firmLibrary); notify('Custom library saved.'); }

  function loadFirmLibrary() { try{return JSON.parse(localStorage.getItem(LIBRARY_KEY))||{schema:'redline-outline-spec-library',version:1,sections:[]};}catch{return{schema:'redline-outline-spec-library',version:1,sections:[]};} }
  function saveFirmLibrary(){localStorage.setItem(LIBRARY_KEY,JSON.stringify(state.firmLibrary));}

  function applySystemSelections() {
    if(!state.project)return;
    const p=state.project; const active=Object.entries(p.systems).filter(([,on])=>on).map(([key])=>key);
    const existing=/(existing|historic|adaptive reuse|renovation)/i.test(`${p.scope.primary} ${(p.scope.conditions||[]).join(' ')}`);
    const coreNumbers=new Set(baseSections.map(row=>row[0]));
    const core=s=>coreNumbers.has(s.number);
    const labels=systemLabels();
    const rules={
      demolition:s=>core(s)&&s.division==='02', concrete:s=>core(s)&&s.division==='03', masonry:s=>core(s)&&s.division==='04', metals:s=>core(s)&&s.division==='05', carpentry:s=>core(s)&&s.division==='06',
      envelope:s=>core(s)&&s.division==='07'&&!/roof/i.test(s.title), roofing:s=>core(s)&&/roof|shingle|flashing|gutter|downspout/i.test(s.title),
      openings:s=>core(s)&&s.division==='08', glazing:s=>core(s)&&/glaz|glass|curtain wall|storefront|window/i.test(s.title),
      partitions:s=>core(s)&&s.division==='09'&&/gypsum|partition|plaster|lath/i.test(s.title), ceilings:s=>core(s)&&/ceiling/i.test(s.title),
      flooring:s=>core(s)&&/floor|tile|terrazzo|carpet/i.test(s.title), wallFinishes:s=>core(s)&&/paint|coating|wall covering|wall finish/i.test(s.title),
      specialties:s=>core(s)&&s.division==='10', equipment:s=>core(s)&&s.division==='11', furnishings:s=>core(s)&&s.division==='12', specialConstruction:s=>core(s)&&s.division==='13', conveying:s=>core(s)&&s.division==='14'
    };
    p.sections.forEach(section=>{
      const reasons=[];
      active.forEach(key=>{if(rules[key]?.(section))reasons.push(labels[key]||key);});
      if(existing&&(/historic|restor|rehabil|repair|repoint|conservation|maintenance|alteration|selective|salvage|existing/i.test(section.title)||section.number==='01 35 16'))reasons.push('Existing / historic project conditions');
      section.recommended=reasons.length>0; section.recommendationReasons=[...new Set(reasons)];
    });
  }

  function autoSectionStatus(section){if(section.status==='Included'||section.status==='Not Reviewed')section.status='In Progress';if(sectionComplete(section)&&section.status==='Needs Decision')section.status='In Progress';}
  function completionState(section){return{scope:Boolean(section.fields.scope.trim()),performance:Boolean(section.fields.performance.trim()),products:Boolean(section.fields.products.trim()),finishes:Boolean(section.fields.finishes.trim())};}
  function sectionComplete(section){return Object.values(completionState(section)).every(Boolean);}
  function completionLabel(key){return({scope:'Scope and system description',performance:'Performance and quality level',products:'Products and manufacturers',finishes:'Colors, profiles, and finishes'})[key]||key;}

  function selectedSectionsSorted(){return state.project.sections.filter(s=>s.selected&&s.status!=='Excluded').sort(sectionSort);}
  function sectionSort(a,b){return `${a.number} ${a.title}`.localeCompare(`${b.number} ${b.title}`,undefined,{numeric:true});}
  function findSection(id){return state.project.sections.find(s=>s.id===id);}
  function findDiv00(id){return state.project.division00.find(i=>i.id===id);}
  function findDiv01(id){return state.project.division01.find(i=>i.id===id);}

  function changed() {
    state.project.updatedAt=new Date().toISOString(); document.getElementById('save-state').textContent='Saving recovery copy…';
    clearTimeout(state.autosaveTimer); state.autosaveTimer=setTimeout(async()=>{await recoveryWrite(state.project);document.getElementById('save-state').textContent='Recovery copy saved';},350);
  }

  function recordActivity(action){state.project.activity.unshift({id:makeId(),at:new Date().toISOString(),user:state.user,action});state.project.activity=state.project.activity.slice(0,100);}
  function activityLabel(){const item=state.project.activity[0];return item?`${item.user} · ${formatDateTime(item.at)}`:'No activity recorded';}

  async function saveProjectFile() {
    recordActivity('Saved project file'); state.project.updatedAt=new Date().toISOString();
    const name=safeName(state.project.meta.name||'Untitled_Project'); downloadJson(`${name}.rspec`,state.project); await recoveryWrite(state.project); notify('Project file saved.');
  }

  function downloadJson(filename,data){downloadBlob(filename,new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));}
  function downloadBlob(filename,blob){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}

  async function recoveryDb() { return new Promise((resolve,reject)=>{const request=indexedDB.open('redline-outline-spec',1);request.onupgradeneeded=()=>request.result.createObjectStore('projects');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);}); }
  async function recoveryWrite(project){try{const db=await recoveryDb();await new Promise((resolve,reject)=>{const tx=db.transaction('projects','readwrite');tx.objectStore('projects').put(project,RECOVERY_KEY);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});db.close();}catch(error){console.warn('Recovery save unavailable',error);}}
  async function recoveryRead(){try{const db=await recoveryDb();const result=await new Promise((resolve,reject)=>{const tx=db.transaction('projects','readonly');const request=tx.objectStore('projects').get(RECOVERY_KEY);request.onsuccess=()=>resolve(request.result||null);request.onerror=()=>reject(request.error);});db.close();return result;}catch{return null;}}

  async function generateExports() {
    const selectedDeliverables=[...exportDialog.querySelectorAll('[name="deliverable"]:checked')].map(i=>i.value);
    if(!selectedDeliverables.length){notify('Select at least one deliverable.');return;}
    const packaging=exportDialog.querySelector('[name="package"]:checked').value;
    exportDialog.close(); notify('Generating Word deliverable…');
    try {
      if(packaging==='combined'){
        const blocks=buildCombinedBlocks(selectedDeliverables,selectedSectionsSorted());
        const blob=await createDocx(blocks);downloadBlob(`${safeName(state.project.meta.name)}_Outline_Specification.docx`,blob);
      } else {
        const packageZip=new JSZip(); const sections=selectedSectionsSorted(); const divisions=[...new Set(sections.map(s=>s.division))];
        for(const division of divisions){const divSections=sections.filter(s=>s.division===division);const blob=await createDocx(buildCombinedBlocks(['outline'],divSections,`Division ${division}`));packageZip.file(`${safeName(state.project.meta.name)}_Division_${division}.docx`,blob);}
        const supporting=selectedDeliverables.filter(x=>x!=='outline');if(supporting.length){const blob=await createDocx(buildCombinedBlocks(supporting,sections,'Project-Wide Handoff'));packageZip.file(`${safeName(state.project.meta.name)}_Project_Wide_Handoff.docx`,blob);}
        downloadBlob(`${safeName(state.project.meta.name)}_Outline_Spec_Package.zip`,await packageZip.generateAsync({type:'blob'}));
      }
      recordActivity('Generated Word deliverables');changed();notify('Word deliverable generated.');
    }catch(error){console.error(error);notify('The Word deliverable could not be generated.');}
  }

  function buildCombinedBlocks(deliverables,sections,label='') {
    const p=state.project; const blocks=[];
    blocks.push({type:'title',text:'REDLINE DESIGN GROUP'});blocks.push({type:'title2',text:'DETAILED OUTLINE SPECIFICATION'});
    blocks.push({type:'meta',text:[p.meta.name,p.meta.number,p.meta.client,p.meta.location,p.meta.phase,label].filter(Boolean).join(' | ')});
    blocks.push({type:'paragraph',text:`Prepared from the Redline Outline Spec Builder on ${new Date().toLocaleDateString()} by ${state.user}. This document is a design-development outline and handoff instrument. It is not a completed project manual or final construction specification.`});
    if(deliverables.includes('handoff')){
      blocks.push({type:'h1',text:'SPEC CONSULTANT HANDOFF SUMMARY'});
      blocks.push({type:'h2',text:'Project Description'});blocks.push({type:'paragraph',text:p.meta.description||'[PROJECT DESCRIPTION NOT PROVIDED]'});
      blocks.push({type:'h2',text:'Scope and Procurement'});blocks.push({type:'paragraph',text:[p.scope.primary,p.scope.occupied,p.scope.notes,p.procurement.delivery,p.procurement.pricing,p.procurement.notes].filter(Boolean).join('. ')||'[PROJECT-WIDE SCOPE INFORMATION NOT PROVIDED]'});
      blocks.push({type:'h2',text:'Existing and Historic Building Context'});blocks.push({type:'paragraph',text:[`Designation: ${p.scope.historic?.designation||'Not determined'}`,`Treatment: ${p.scope.historic?.treatment||'Not determined'}`,p.scope.historic?.authority?`Reviewing authority: ${p.scope.historic.authority}`:'',`Tax credits: ${p.scope.historic?.taxCredits||'Not determined'}`,p.scope.historic?.investigation].filter(Boolean).join('. ')});
      blocks.push({type:'h2',text:'Division 00 Status'});p.division00.forEach(i=>blocks.push({type:'bullet',text:`${i.label}: ${i.status}${i.responsible?`; Responsible: ${i.responsible}`:''}${i.reference?`; Reference: ${i.reference}`:''}`}));
      blocks.push({type:'h2',text:'Division 01 Checklist'});p.division01.filter(i=>i.applicable).forEach(i=>blocks.push({type:'bullet',text:`${i.label}: ${i.status}${i.notes?` — ${i.notes}`:''}`}));
      blocks.push({type:'h2',text:'Additional Handoff Notes'});blocks.push({type:'paragraph',text:p.handoffNotes||'[NO ADDITIONAL HANDOFF NOTES PROVIDED]'});
    }
    if(deliverables.includes('matrix')){
      blocks.push({type:'h1',text:'SECTION LIST AND STATUS MATRIX'});sections.forEach(s=>blocks.push({type:'bullet',text:`${s.number} ${s.title} | ${s.status} | ${s.responsibility?.discipline||'Responsibility not assigned'} | ${s.responsibility?.author||'Author not assigned'} | ${s.scopeInstances.length?`${s.scopeInstances.length} scope instance(s)`:s.scopeTags.join(', ')||'Scope condition not assigned'} | ${sectionDecisions(s).length} open decision(s)`}));
    }
    if(deliverables.includes('decisions')){
      blocks.push({type:'h1',text:'UNRESOLVED DECISION LOG'});const decisions=renderDecisionsForExport();if(!decisions.length)blocks.push({type:'paragraph',text:'No unresolved decisions.'});decisions.forEach(d=>blocks.push({type:'bullet',text:`${d.sectionNumber||'Project-wide'} ${d.sectionTitle||''}: ${d.text}${d.owner?`; Responsible: ${d.owner}`:'; Responsible: [NOT ASSIGNED]'}${d.due?`; Due: ${d.due}`:''}`}));
    }
    if(deliverables.includes('outline')){
      blocks.push({type:'h1',text:'DETAILED OUTLINE SPECIFICATION'});
      let lastDivision='';sections.forEach(s=>{if(s.division!==lastDivision){lastDivision=s.division;blocks.push({type:'division',text:`DIVISION ${s.division}`});}blocks.push(...sectionBlocks(s));});
    }
    return blocks;
  }

  function sectionBlocks(section){
    const missing=key=>section.fields[key]?.trim()||`[UNRESOLVED: ${completionLabel(key).toUpperCase()}]`;
    const blocks=[{type:'h1',text:`${section.number} ${section.title}`},{type:'meta',text:`Status: ${section.status} | Discipline: ${section.responsibility?.discipline||'[NOT ASSIGNED]'} | Expected author: ${section.responsibility?.author||'[NOT ASSIGNED]'} | Scope: ${section.scopeTags.join(', ')||'[NOT ASSIGNED]'} | Specifying approach: ${section.specifyingApproach}`}];
    if(section.scopeInstances.length){blocks.push({type:'h2',text:'SECTION SCOPE INSTANCES'});section.scopeInstances.forEach(item=>blocks.push({type:'bullet',text:`${item.name}${item.area?` | Area: ${item.area}`:''}${item.treatment?` | Treatment: ${item.treatment}`:''}${item.notes?` | ${item.notes}`:''}`}));}
    blocks.push({type:'h2',text:'PART 1 – GENERAL'},{type:'h3',text:'Scope and System Description'},{type:'paragraph',text:missing('scope')},{type:'h3',text:'Performance and Quality Level'},{type:'paragraph',text:missing('performance')});
    if(section.fields.submittals)blocks.push({type:'h3',text:'Submittals, Mockups, Warranties, and Delegated Design'},{type:'paragraph',text:section.fields.submittals});
    if(section.fields.coordination)blocks.push({type:'h3',text:'Coordination and Drawing References'},{type:'paragraph',text:section.fields.coordination});
    blocks.push({type:'h2',text:'PART 2 – PRODUCTS'},{type:'h3',text:'Products and Manufacturers'},{type:'paragraph',text:missing('products')},{type:'h3',text:'Colors, Profiles, and Finishes'},{type:'paragraph',text:missing('finishes')});
    const answered=Object.entries(section.guided).filter(([,v])=>String(v).trim());if(answered.length){blocks.push({type:'h3',text:'Guided Section Information'});answered.forEach(([q,v])=>blocks.push({type:'bullet',text:`${q}: ${v}`}));}
    blocks.push({type:'h2',text:'PART 3 – EXECUTION'},{type:'paragraph',text:section.fields.execution||'[Execution requirements to be developed in the final specification.]'});
    if(section.references.length){blocks.push({type:'h3',text:'References and Supporting Information'});section.references.forEach(r=>blocks.push({type:'bullet',text:`${r.label}: ${r.fileName||r.value||r.kind}`}));}
    if(section.notes)blocks.push({type:'h3',text:'Notes to Specifier'},{type:'paragraph',text:section.notes});
    return blocks;
  }

  async function createDocx(blocks){
    const zip=new JSZip();
    zip.file('[Content_Types].xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>`);
    zip.folder('_rels').file('.rels',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
    const word=zip.folder('word');
    word.file('styles.xml',docxStyles());
    const body=blocks.map(block=>docxParagraph(block)).join('');
    word.file('document.xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080" w:header="720" w:footer="720"/></w:sectPr></w:body></w:document>`);
    word.folder('_rels').file('document.xml.rels',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`);
    return zip.generateAsync({type:'blob',mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
  }

  function docxParagraph(block){const style={title:'Title',title2:'Subtitle',meta:'Meta',h1:'Heading1',division:'Division',h2:'Heading2',h3:'Heading3',bullet:'ListParagraph',paragraph:'Normal'}[block.type]||'Normal';const text=block.type==='bullet'?`• ${block.text||''}`:(block.text||'');return `<w:p><w:pPr><w:pStyle w:val="${style}"/></w:pPr><w:r><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`;}
  function docxStyles(){return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/><w:sz w:val="20"/></w:rPr><w:pPr><w:spacing w:after="120"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:color w:val="AD2B2E"/><w:sz w:val="30"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="24"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Meta"><w:name w:val="Meta"/><w:basedOn w:val="Normal"/><w:rPr><w:color w:val="666666"/><w:i/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:rPr><w:b/><w:color w:val="AD2B2E"/><w:sz w:val="26"/></w:rPr><w:pPr><w:spacing w:before="360" w:after="140"/><w:keepNext/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Division"><w:name w:val="Division"/><w:basedOn w:val="Heading1"/><w:rPr><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="28"/></w:rPr><w:pPr><w:shd w:fill="263744"/><w:spacing w:before="480" w:after="180"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="22"/></w:rPr><w:pPr><w:spacing w:before="220" w:after="100"/><w:keepNext/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="20"/></w:rPr><w:pPr><w:spacing w:before="140" w:after="60"/><w:keepNext/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="ListParagraph"><w:name w:val="List Paragraph"/><w:basedOn w:val="Normal"/><w:pPr><w:ind w:left="360" w:hanging="180"/></w:pPr></w:style></w:styles>`;}

  function systemLabels(){return{demolition:'Selective demolition and existing conditions',concrete:'Concrete',masonry:'Masonry and stone',metals:'Metals, stairs, and railings',carpentry:'Rough and finish carpentry',envelope:'Air, water, insulation, and sealants',roofing:'Roofing and roof accessories',openings:'Doors, frames, and hardware',glazing:'Storefront, curtain wall, and glazing',partitions:'Interior partitions and gypsum board',ceilings:'Acoustical and specialty ceilings',flooring:'Tile, resilient, carpet, and wood flooring',wallFinishes:'Painting and specialty wall finishes',specialties:'Signage, toilet accessories, and specialties',equipment:'Architectural equipment coordination',furnishings:'Casework, countertops, shades, and furnishings',specialConstruction:'Special construction and metal buildings',conveying:'Elevators and conveying systems'};}
  function field(label,path,value,required=false){return `<label class="field"><span>${escapeHtml(label)} ${required?'<span class="required">Required</span>':''}</span><input data-path="${path}" value="${escapeAttr(value)}"></label>`;}
  function textAreaField(label,path,value,className=''){return `<label class="field ${className}"><span>${escapeHtml(label)}</span><textarea data-path="${path}" rows="4">${escapeHtml(value)}</textarea></label>`;}
  function selectField(label,path,value,options){return `<label class="field"><span>${escapeHtml(label)}</span><select data-path="${path}">${options.map(option=>`<option ${selected(option,value)}>${escapeHtml(option)}</option>`).join('')}</select></label>`;}
  function selectRaw(label,attrs,value,options){return `<label class="field"><span>${escapeHtml(label)}</span><select ${attrs}>${options.map(option=>`<option ${selected(option,value)}>${escapeHtml(option)}</option>`).join('')}</select></label>`;}
  function fieldRaw(label,attrs,value,className='',type='text'){return `<label class="field ${className}"><span>${escapeHtml(label)}</span><input type="${type}" ${attrs} value="${escapeAttr(value)}"></label>`;}
  function checkField(label,kind,checked,value=label){return `<label class="check-row"><input type="checkbox" data-kind="${kind}" value="${escapeAttr(value)}" ${checked?'checked':''}><span>${escapeHtml(label)}</span></label>`;}
  function selected(option,value){return option===value?'selected':'';}
  function metric(label,value,note){return `<section class="panel"><span class="metric-label">${escapeHtml(label)}</span><div class="metric-value">${escapeHtml(String(value))}</div><small>${escapeHtml(note)}</small></section>`;}
  function statusSummary(sections){return STATUS_OPTIONS.filter(s=>!['Not Reviewed','Excluded'].includes(s)).map(status=>{const count=sections.filter(s=>s.status===status).length;return count?`<span class="status ${statusClass(status)}">${count} ${escapeHtml(status.toLowerCase())}</span>`:'';}).join('');}
  function statusClass(status){return status==='Outline Complete'?'complete':status==='Needs Decision'?'decision':['In Progress','Ready for Review','Possible','Consultant'].includes(status)?'progress':['Excluded','Not Applicable'].includes(status)?'excluded':'';}
  function decisionMini(d){return `<div class="decision-item"><strong>${escapeHtml(d.sectionNumber||'Project-wide')} ${escapeHtml(d.sectionTitle||'')}</strong><small>${escapeHtml(d.text)}</small></div>`;}
  function setPath(obj,path,value){const parts=path.split('.');let cursor=obj;parts.slice(0,-1).forEach(part=>cursor=cursor[part]);cursor[parts.at(-1)]=value;}
  function notify(message){toast.textContent=message;toast.hidden=false;clearTimeout(notify.timer);notify.timer=setTimeout(()=>toast.hidden=true,3200);}
  function makeId(){return globalThis.crypto?.randomUUID?.() || `rs-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`;}
  function safeName(value){return String(value||'Project').trim().replace(/[^a-z0-9_-]+/gi,'_').replace(/^_+|_+$/g,'')||'Project';}
  function escapeHtml(value){return String(value??'').replace(/[&<>]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[ch]));}
  function escapeAttr(value){return escapeHtml(value).replace(/"/g,'&quot;');}
  function escapeXml(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[ch]));}
  function formatBytes(bytes){if(!bytes)return'0 B';const units=['B','KB','MB','GB'];const i=Math.min(Math.floor(Math.log(bytes)/Math.log(1024)),units.length-1);return`${(bytes/Math.pow(1024,i)).toFixed(i?1:0)} ${units[i]}`;}
  function formatDateTime(value){return new Date(value).toLocaleString(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});}
  function fileToDataUrl(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(file);});}
})();
