/* =============================================================================
 * INTERNAL build configuration
 * Implements the "Internal Dash" section of 7.28.26 Internal V External.docx
 *
 * ***  CONTAINS PII FIELD NAMES AND PRIVATE LAYER URLS  ***
 * Deploy this file ONLY to the internal repo. It must never be copied into the
 * External build. build.ps1 enforces this.
 *
 * The three resident-level programs point at the REAL (non-de-identified)
 * layers: true coordinates, resident names, street addresses.
 *
 * ACCESS NOTE (2026-07-29): these layers were temporarily set to PUBLIC sharing
 * in AGOL for development. They are expected to return to restricted sharing,
 * at which point this dashboard will need an ArcGIS OAuth sign-in gate before
 * it can load them. Nothing in this file provides authentication.
 * ============================================================================= */

import {
  DEV_LAYER, ORG, BRAND,
  REHAB_FIELDS_BASE, HBA_FIELDS_BASE, OTHER_FIELDS_BASE,
  HUD_LAYERS_BASE,
} from "./config.base.js";

export * from "./config.base.js";

export const MODE = "internal";

/* --- ArcGIS sign-in --------------------------------------------------------- *
 * The three resident-level layers are expected to return to restricted sharing.
 * At that point an anonymous browser can no longer read them and this dashboard
 * must authenticate.
 *
 * TO ENABLE, once the enterprise manager has registered an OAuth app in AGOL:
 *   1. AGOL > Content > New item > Developer credentials > OAuth credentials
 *   2. Add the dashboard's URL as a Redirect URI (exact origin, e.g.
 *      https://intranet.raleighnc.gov/housing-dashboard). Add
 *      http://localhost:8081 too if you want local dev to sign in.
 *   3. Paste the resulting Client ID below.
 *
 * The three resident-level layers are now shared ORG ONLY, so this is required:
 * without it the SDK waits forever for a token and the page never loads.
 *
 * The client ID is public by design. For a browser (public) OAuth client there
 * is no secret — security comes from the redirect-URI allowlist registered on
 * the app item, which is why it is safe in a public repo.
 *
 * Registered app: https://ral.maps.arcgis.com/home/item.html?id=f68c5b8e754e4d05905208e425f6bb2b
 * Redirect URIs registered: https://maryelizardbeth.github.io , http://localhost:8081  */
export const AUTH = {
  appId: "cErYCyvJjyUemAOc",
  // The Raleigh org portal, not the generic www.arcgis.com — sends users
  // straight to the City's sign-in rather than a generic org prompt.
  portalUrl: "https://ral.maps.arcgis.com",
};

/* --- Housing layers — REAL resident-level layers ---------------------------
 * Item ids and sublayer indices verified live against the FeatureServers
 * on 2026-07-29:
 *   Homeowner Rehabs      3e9e7f785fd9475d916604788fed2359  -> /FeatureServer/8
 *   Homebuyer Assistance  d52516de4fcc4ebd87ff90f6d5ed29c3  -> /FeatureServer/7
 *   Other Housing Impact  ac0cac3323b84717bb417ea84e9e3db7  -> /FeatureServer/6
 * Note the sublayer index differs per service — it is NOT /0 like the
 * de-identified copies.                                                        */
export const HOUSING_LAYERS = [
  DEV_LAYER,
  {
    id: "homeowner_rehabs",
    title: "Home Repair",
    url: `${ORG}/Housing_Production_Tracker_Homeowner_Rehabs_Layer/FeatureServer/8`,
    kind: "rehab",
    color: BRAND.teal,
    deidentified: false,
    visible: true,
    showOnMap: true,
  },
  {
    id: "homebuyer_assistance",
    title: "Homebuyer Assistance",
    url: `${ORG}/Housing_Production_Tracker_Homebuyer_Assistance_Layer/FeatureServer/7`,
    kind: "hba",
    color: BRAND.navy,
    deidentified: false,
    visible: true,
    showOnMap: true,
  },
  {
    id: "other_housing_impact",
    title: "Other Housing Impact",
    url: `${ORG}/Housing_Production_Tracker_Other_Housing_Impact_Layer/FeatureServer/6`,
    kind: "other",
    color: BRAND.midGreen,
    deidentified: false,
    visible: true,
    showOnMap: true,
  },
];

/* --- Resident-level field maps + the PII fields the real layers carry -------
 * Field names verified live against each FeatureServer on 2026-07-29.
 * The popup helpers render each row only if the key is present, so adding
 * these here is what turns the extra rows on for Internal.                     */
export const REHAB_FIELDS = {
  ...REHAB_FIELDS_BASE,
  borrower:    "Borrower",
  address:     "Address",
  mainAddress: "Main_Address",
  matchAddr:   "Match_addr",
  workComplete:"Work_Complete_Date",
  approvalDate:"Applicant_Approval_Date_Pre_Construction",
};
export const HBA_FIELDS = {
  ...HBA_FIELDS_BASE,
  borrower:    "Borrower",
  address:     "Address",
  zip:         "Zip",
  mainAddress: "Main_Address",
  matchAddr:   "Match_addr",
  loanClosed:  "Loan_Closed_Date",
};
export const OTHER_FIELDS = {
  ...OTHER_FIELDS_BASE,
  homeowner:   "Homeowner",     // this layer names the person field "Homeowner", not "Borrower"
  address:     "Address",
  mainAddress: "Main_Address",
  matchAddr:   "Match_addr",
  dateClosed:  "Date_Closed",
};

/* --- HUD layers — fuller detail for internal data owners -------------------
 * Per the requirements doc, Internal "can include all details for non-City HUD
 * development (don't have to filter out developer, population served, etc)".
 *
 * These additions were recovered from uncommitted working-tree edits found on
 * 2026-07-29 (see _ondisk_backup_2026-07-29/NOTES.md) — that work was already
 * heading here. CLIENT_GROUP_NAME is HUD's population-served field.            */
const HUD_EXTRA_INTERNAL = {
  hud_mf_assisted: {
    extra: [["Client group", "CLIENT_GROUP_NAME"]],
  },
  hud_lihtc: {
    units: "N_UNITS",
    extra: [["Low-income units", "LI_UNITS"], ["Allocation amt", "ALLOCAMT"]],
  },
  hud_insured_mf: {
    extra: [["Client group", "CLIENT_GROUP_NAME"]],
  },
};

export const HUD_LAYERS = HUD_LAYERS_BASE.map(layer => {
  const add = HUD_EXTRA_INTERNAL[layer.id];
  if (!add) return layer;
  return {
    ...layer,
    ...(add.units ? { units: add.units } : {}),
    extra: [...(layer.extra || []), ...(add.extra || [])],
  };
});

/* --- On-screen copy + UI switches ------------------------------------------ */
export const UI = {
  /* Browser tab title + masthead label. The internal badge is styled as a
   * warning so a shared screen is obviously the PII build. */
  docTitle: "Raleigh Housing Landscape | INTERNAL Dashboard (PII)",
  versionLabel: "Internal version — contains PII",
  versionKind: "internal",

  /* Keep this build out of search indexes wherever it is hosted. Paired with
   * the robots.txt the build writes for internal only. */
  noIndex: true,

  /* "Can leave in all the source of truth and note boxes" — keep every badge. */
  showSourceNotes: true,

  /* "Funding amounts and unit breakdown by AMI for pipeline development" —
   * un-gates the dollar figures and the AMI bar for Pipeline records across the
   * development and resident-level popups. */
  showPipelineFinancials: true,

  /* null = keep the existing dynamic caveat (which reports the live
   * Date_updated value from the summary table). */
  citywideCaveatHtml: null,

  dataNotesHtml:
    '<strong>INTERNAL USE — contains PII.</strong> The Home Repair, Homebuyer ' +
    'Assistance, and Other Housing Impact layers are the <strong>real</strong> ' +
    'records: resident names, street addresses, and <strong>exact</strong> ' +
    'locations. Do not screen-share or export without following City ' +
    'data-governance policy. AMI affordability breakdowns show only for ' +
    '<strong>Complete</strong> development projects (per HCD rules). Mapped point ' +
    'counts are geometry and <strong>do not reconcile</strong> to the Housing ' +
    'Production Tracker totals (the source of truth) — see the charts below.',

  /* Real records are not de-identified, so the popup disclaimer is replaced
   * with a handling warning rather than removed. */
  deidNote:
    'Internal record — exact location, resident-identifying fields shown.',
};
