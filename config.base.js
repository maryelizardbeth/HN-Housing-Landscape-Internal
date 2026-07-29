/* =============================================================================
 * City of Raleigh — Housing Production Dashboard
 * SHARED configuration — identical for the External and Internal builds.
 *
 * Everything in this file is safe to publish. Anything that differs between the
 * two dashboards (layer URLs, PII field names, on-screen copy) lives in
 * config.external.js / config.internal.js instead.
 *
 * At deploy time exactly one variant is copied in as `config.js`, which is what
 * index.html imports. See build.ps1.
 * ============================================================================= */

/* --- City of Raleigh brand tokens ------------------------------------------ */
export const BRAND = {
  raleighGreen: "#0D6937",
  leafGreen:    "#73AB45",
  midGreen:     "#4C8C40",
  chartreuse:   "#A8C23E",
  teal:         "#189ABC",
  navy:         "#01426A",
  amber:        "#FBAE40",
  rust:         "#A8322D",
  bodyText:     "#414042",
  border:       "#BFBFBF",
  lightFill:    "#F2F2F2",
  greenTint:    "#DAEFD3",
  greenTintAlt: "#F3F9EF",
  white:        "#FFFFFF",
};

/* --- AGOL org + source web map --------------------------------------------- */
export const ORG = "https://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services";
export const WEBMAP_ID = "f0787de35a2e4f44bb1c717cbc12683e";

/* --- ArcGIS sign-in --------------------------------------------------------- *
 * Anonymous by default. The Internal build overrides this once an AGOL App ID
 * is registered, which is what lets it read layers that are not shared publicly.
 * appId: null  ->  no sign-in attempted (fine while the layers are public).     */
export const AUTH = {
  appId: null,
  portalUrl: "https://www.arcgis.com",
};

/* --- Map defaults ----------------------------------------------------------- */
export const MAP = {
  basemap: "community",   // "community" (matches web map) | "osm"
  communityStyleUrl: "https://www.arcgis.com/sharing/rest/content/items/188219e2c8e44fe780c2fd3b3bb021f6/resources/styles/root.json",
  center: [-78.6382, 35.7796],   // downtown Raleigh
  zoom: 11,
};

/* --- Housing Development layer --------------------------------------------- *
 * Project-level, not resident-level — no PII, so BOTH builds use the same
 * (real) layer. Only the three resident-level programs differ by build.        */
export const DEV_LAYER = {
  id: "housing_development",
  title: "City Housing Development",
  url: `${ORG}/Housing_Production_Tracker_Housing_Development_Layer/FeatureServer/9`,
  kind: "dev",
  visible: true,
  showOnMap: true,
};

/* Aggregate SUMMARY TABLE — authoritative source for the dashboard charts. */
export const SUMMARY_TABLE = {
  url: `${ORG}/Housing_Production_Tracker_Housing_Production_Tracker/FeatureServer/0`,
  fields: {
    fiscalYear:  "Fiscal_Year",
    endYear:     "End_Year",
    quarter:     "Quarter",
    quarterFY:   "QuarterFY",
    total:       "Total_Complete",
    dateUpdated: "Date_updated",
    hdPipeline:  "Housing_Development_Pipeline",
    hrPipeline:  "Homeowner_Rehab_Pipeline",
  },
  categories: [
    { field: "Housing_Development_New_Construction", label: "New construction",      color: BRAND.raleighGreen },
    { field: "Housing_Development_Preservation",     label: "Preserved",             color: BRAND.leafGreen },
    { field: "Homeowner_Rehabs",                     label: "Home repair",           color: BRAND.chartreuse },
    { field: "Homebuyer_Assistance",                 label: "Homebuyer assistance",  color: BRAND.teal },
    { field: "Other_Housing_Impact",                 label: "Other housing impact",  color: BRAND.amber },
  ],
};

/* Field-name map for the Housing Development layer (map filters + popups). */
export const DEV_FIELDS = {
  project:        "Project",
  developer:      "Developer",
  address:        "Main_Address",
  status:         "Status",
  projectStatus:  "Project_Status",
  fiscalYear:     "Fiscal_Year",
  totalUnits:     "Total_Units",
  homeownership:  "Homeownership_Units",
  population:     "Population",
  construction:   "Construction_Type",
  developmentType:"Development_Type",
  council:        "Council_District",
  ncod:           "OLAY_NAME",
  loanAmount:     "City_of_Raleigh_Loan_Amount",
  coDate:         "CO_Date",
  fundingSource:  "Funding_Source",
  unrestricted:   "Unrestricted_Units",
  amiBands: [
    ["Units_20_pct_AMI", "≤20%", "#01426A"],
    ["Units_30_pct_AMI", "30%",  "#189ABC"],
    ["Units_40_pct_AMI", "40%",  "#4C8C40"],
    ["Units_50_pct_AMI", "50%",  "#73AB45"],
    ["Units_60_pct_AMI", "60%",  "#A8C23E"],
    ["Units_70_pct_AMI", "70%",  "#FBAE40"],
    ["Units_80_pct_AMI", "80%",  "#E07B39"],
  ],
  fundingAmounts: [
    ["Local",                                  "Local"],
    ["f_2020_Bond",                            "2020 Bond"],
    ["HOME",                                   "HOME"],
    ["Community_Development_Block_Grant_CDBG",  "CDBG"],
    ["Dedicated_Affordable_Housing_Fund_DAHF",  "Dedicated Affordable Housing Fund (DAHF)"],
    ["Other",                                  "Other (CDBG, ERA2, etc.)"],
  ],
};

/* --- Resident-level field maps --------------------------------------------- *
 * These are the fields present on BOTH the de-identified and the real layers.
 * The Internal build spreads extra PII keys (borrower, address, …) on top; the
 * popup code renders those rows only when the key exists, so the External build
 * needs no mode check — the field simply isn't there.                          */
export const REHAB_FIELDS_BASE = {
  fiscalYear: "Fiscal_Year", rehabType: "Rehab_Type", totalUnits: "Total_Units",
  ami: "AMI", status: "Status", projectStatus: "Project_Status",
  loanAmount: "City_of_Raleigh_Loan_Amount", fundingSource: "Funding_Source",
  council: "Council_District", ncod: "OLAY_NAME", note: "Note",
  amiBands: ["Units_20_pct_AMI","Units_30_pct_AMI","Units_40_pct_AMI","Units_50_pct_AMI","Units_60_pct_AMI","Units_70_pct_AMI","Units_80_pct_AMI"],
};
export const HBA_FIELDS_BASE = {
  fiscalYear: "Fiscal_Year", totalUnits: "Total_Units", ami: "AMI",
  projectStatus: "Project_Status",
  loanAmount: "City_of_Raleigh_Loan_Amount", fundingSource: "Funding_Source",
  council: "Council_District", ncod: "OLAY_NAME",
  amiBands: ["Units_20_pct_AMI","Units_30_pct_AMI","Units_40_pct_AMI","Units_50_pct_AMI","Units_60_pct_AMI","Units_70_pct_AMI","Units_80_pct_AMI"],
};
export const OTHER_FIELDS_BASE = {
  fiscalYear: "Fiscal_Year", totalUnits: "Total_Units", status: "Status",
  projectStatus: "Project_Status", notes: "Notes",
  council: "Council_District", ncod: "OLAY_NAME",
};

/* --- HUD / non-City subsidized housing (live HUD services) ----------------- *
 * `extra` here is the PUBLIC-facing field set. The Internal build appends more
 * detail per layer (see config.internal.js).                                   */
export const HUD_BASE = "https://services.arcgis.com/VTyQ9soqVukalItT/arcgis/rest/services";
export const WAKE = "STATE2KX='37' AND CURCNTY_NM LIKE 'Wake%'";
export const HUD_LAYERS_BASE = [
  {
    id: "hud_public_housing",
    title: "Public Housing Developments (incl. RHA)",
    url: `${HUD_BASE}/Public_Housing_Developments/FeatureServer/0`,
    where: WAKE, style: "square", color: "#01426A",
    name: ["PROJECT_NAME", "FORMAL_PARTICIPANT_NAME"], addr: ["STD_ADDR", "STD_CITY"], units: "TOTAL_UNITS",
    extra: [["Housing authority", "FORMAL_PARTICIPANT_NAME"], ["ACC units", "ACC_UNITS"]],
    visible: false,
  },
  {
    id: "hud_mf_assisted",
    title: "Multifamily Assisted (Section 8 / 202 / 811)",
    url: `${HUD_BASE}/Multifamily_Properties_Assisted/FeatureServer/0`,
    where: WAKE, style: "diamond", color: "#189ABC",
    name: ["PROPERTY_NAME_TEXT"], addr: ["ADDRESS_LINE1_TEXT", "PLACED_BASE_CITY_NAME_TEXT"], units: "TOTAL_ASSISTED_UNIT_COUNT",
    extra: [["Total units", "TOTAL_UNIT_COUNT"], ["Category", "PROPERTY_CATEGORY_NAME"]],
    visible: false,
  },
  {
    id: "hud_lihtc",
    title: "LIHTC Properties (tax-credit)",
    url: `${HUD_BASE}/LIHTC/FeatureServer/0`,
    where: "PROJ_ST='NC' AND CURCNTY_NM LIKE 'Wake%'", style: "triangle", color: "#FBAE40",
    name: ["PROJECT"], addr: ["PROJ_ADD", "PROJ_CTY"], units: null,
    extra: [["Year placed in service", "YR_PIS"]],
    visible: false,
  },
  {
    id: "hud_insured_mf",
    title: "HUD-Insured Multifamily",
    url: `${HUD_BASE}/HUD_Insured_Multifamily_Properties/FeatureServer/0`,
    where: WAKE, style: "x", color: "#A8322D",
    name: ["PROPERTY_NAME_TEXT"], addr: ["ADDRESS_LINE1_TEXT", "PLACED_BASE_CITY_NAME_TEXT"], units: "MAXIMUM_CONTRACT_UNIT_COUNT",
    extra: [["Program", "PROGRAM_TYPE1"]],
    visible: false,
  },
];

/* --- Reference / boundary layers (live City services) ---------------------- */
export const REFERENCE_LAYERS = [
  {
    id: "council_districts", title: "City Council Districts", type: "feature",
    url: "https://maps.raleighnc.gov/arcgis/rest/services/Boundaries/MapServer/2",
    kind: "boundary", color: "#01426A", labelField: "COUNCIL_DIST", visible: true,
  },
  {
    id: "ncods", title: "Neighborhood Conservation Overlay Districts (NCODs)", type: "feature",
    url: "https://maps.raleighnc.gov/arcgis/rest/services/Planning/Overlays/MapServer/9",
    kind: "boundary", color: "#189ABC", labelField: "OLAY_NAME", visible: false,
  },
  {
    id: "transit_routes", title: "Transit Routes (GoRaleigh)", type: "feature",
    url: "https://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/GoRaleigh_Routes/FeatureServer/0",
    kind: "transit", color: "#73AB45", width: 1.5, visible: false,
  },
  {
    id: "brt", title: "Bus Rapid Transit corridors (Wake BRT)", type: "feature",
    url: "https://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/Bus_Rapid_Transit_Corridors/FeatureServer/0",
    kind: "transit", color: "#A8322D", width: 4, labelField: "Name", visible: false,
  },
  {
    id: "market_indicators", title: "Market Supply Indicators (by block group)", type: "feature",
    url: "https://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/RaleighBlockGroups_2014_2018_AllFields/FeatureServer/0",
    kind: "choropleth", defaultIndicator: "pct_owner_occ",
    indicators: [
      { id: "pct_owner_occ",     label: "% Owner-Occupied",              field: "PercentOwnerOccupied2018", format: "percent"  },
      { id: "pct_renter_occ",    label: "% Renter-Occupied",             field: "PercentRenterOccupied2018", format: "percent" },
      { id: "renter_units",      label: "Renter-Occupied Units (count)", field: "RENTER_CY_1",              format: "number"   },
      { id: "median_hh_income",  label: "Median Household Income",       field: "MEDHINC_CY_1",             format: "currency" },
      { id: "median_home_value", label: "Median Home Value",             field: "MEDVAL_CY_1",              format: "currency" },
      { id: "pct_vacant",        label: "% Vacant Housing Units",        field: null, expr: "IIf($feature.TOTHU_CY_1>0, $feature.VACANT_CY_1/$feature.TOTHU_CY_1*100, null)", format: "percent" },
      { id: "median_rent",       label: "Median Gross Rent (needs ACS layer)",       field: null, format: "currency" },
      { id: "pct_owner_cb",      label: "% Owners Cost-Burdened (needs ACS layer)",  field: null, format: "percent"  },
      { id: "pct_renter_cb",     label: "% Renters Cost-Burdened (needs ACS layer)", field: null, format: "percent"  },
    ],
    ramp: ["#F3F9EF", "#DAEFD3", "#A8C23E", "#73AB45", "#4C8C40", "#0D6937"],
    visible: false,
  },
];
