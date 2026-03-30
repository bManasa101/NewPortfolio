// ─── data/portfolio.ts ───────────────────────────────────────────────────────

export type Report = {
  sector: string;
  rec: string | null;
  ticker: string;
  title: string;
  desc: string;
  date: string;
};

export type EducationItem = {
  type: string;
  degree: string;
  school: string;
  year: string;
};

export const profile = {
  name: "Manasa Basavaraju",
  title: "Finance Management, PGDM",
  tagline: "Turning Markets\nInto ",
  taglineAccent: "Conviction",
  description:
    "CFA Level 2 Charterholder with 32 months of experience across institutional equity sales, ERP consulting, and financial modelling. NISM Research Analyst certified with hands-on exposure to block placements, derivatives markets, and corporate valuation.",
  email: "pgdm.placom@spjimr.org",
  linkedin: "linkedin.com/in/manasabasavaraju",
  location: "Mumbai, India",
};

export const stats = [
  { value: "CFA Candidate",  label: "L1 & L2 · First Attempt" },
  { value: "SEBI - Licensed", label: "NISM Series XV _ research analyst cleared" },
  { value: "Institutional Coverage", label: "4 Client Types - AIF CAT III, PMS, insurance and pension funds" },
  { value: "Analytical Foundation",   label: "B.E. EEE · 9.21 CGPA" },
];

export const coverage = [
  { name: "Bharti Airtel",  sector: "Telecom",     rec: "",  pt: "DCF Model",   chg: "5-yr Forecast", up: true },
  { name: "Tata Tech IPO",  sector: "Technology",  rec: "", pt: "IPO Analysis", chg: "Stakeholder Impact", up: false },
  { name: "Index Deriv.",   sector: "Derivatives", rec: "",  pt: "SEBI Paper",  chg: "Primary Analysis", up: true },
  { name: "Passive Funds",  sector: "AMC/ETF",     rec: "",  pt: "India Trends", chg: "US Benchmarked", up: true },
  { name: "Infra Project",  sector: "Infrastructure", rec: "", pt: "Fin. Model", chg: "Sensitivity Anal.", up: false },
];

export const experience = [
  {
    date: "May 2025 - Present",
    firm: "Axis Capital",
    title: "Institutional Sales",
    location: "Mumbai, India",
    desc: "Institutional sales coverage specialist managing relationships with PMS, AIFs and insurance funds. Worked closely on live deals with trading, research and ECM teams to build allocation demand, facilitate price discovery and ensure successful deal closures. Actively involved in block placements, sourcing institutional interest and coordinating with the desk.",
    tags: ["Institutional Sales", "Block Placements", "ECM", "PMS/AIF"],
  },
  {
    date: "Aug 2024 - Oct 2024",
    firm: "Axis Capital",
    title: "Corporate Autumn Intern",
    location: "Mumbai, India",
    desc: "Engaged in Management Sales Teach-ins to address key sales team queries and equip for roadshows. Conducted primary data analysis for proposals in SEBI's Consultation Paper on Index Derivatives. Analysed India's passive investing growth, forecasting trends based on US market developments. Presented on global derivatives market comparing regulations, participant mix and product offerings.",
    tags: ["Derivatives", "SEBI Research", "Passive Investing", "Sales"],
  },
  {
    date: "Nov 2022 - May 2023",
    firm: "KPMG",
    title: "Associate Consultant",
    location: "Banglore, India",
    desc: "Onboarded $28M worth US banking entity into Workday ERP. Institutionalised and optimised financial processes. Maintained 90%+ quality compliance for 50+ ERP project portfolios within the Quality Management System.",
    tags: ["Workday ERP", "QMS", "$28M Onboarding", "Banking"],
  },
  {
    date: "Sept 2020 - Oct 2022",
    firm: "Deloitte Consulting",
    title: "Analyst",
    location: "Banglore, India",
    desc: "Wireframed ledger accounts with hierarchies and accounting details, transforming business event data. Reduced processing time by 70% by creating SQL scripts, digitising conversion while loading legacy data. Developed and customised balance sheet reports by analysing client legacy data. Hosted seminar for 200+ employees as lead speaker on Advanced Security in Workday Implementation.",
    tags: ["SQL", "Workday", "ERP", "70% Efficiency Gain"],
  },
];

export const reports: Report[] = [
  {
    sector: "Telecom",
    rec: "Buy",
    ticker: "AIRTEL",
    title: "Bharti Airtel: Corporate Valuation via DCF & Relative Analysis",
    desc: "Performed DCF and relative valuation to compute intrinsic value of Bharti Airtel. Developed a comprehensive 5-year financial model incorporating revenue drivers, margin assumptions and terminal value.",
    date: "PGDM Project",
  },
  {
    sector: "Technology",
    rec: null,
    ticker: "TATATECH",
    title: "Tata Tech IPO: Stakeholder Impact & Financial Implications",
    desc: "Analysed the Tata Tech IPO and its impact on key stakeholders. Assessed financial implications of the IPO including valuation multiples, grey market premium, and post-listing performance expectations.",
    date: "Investment Banking",
  },
  {
    sector: "Derivatives",
    rec: null,
    ticker: "INDEX",
    title: "SEBI Consultation Paper: Index Derivatives — Primary Data Analysis",
    desc: "Conducted primary data analysis for proposals in SEBI's Consultation Paper on Index Derivatives. Compared global derivatives regulations, participant mix and product offerings across major exchanges.",
    date: "Axis Capital, 2024",
  },
  {
    sector: "Multi-Sector",
    rec: "Buy",
    ticker: "PORTFOLIO",
    title: "Security Selection: Min-Correlation, Max Sharpe-Ratio Portfolio",
    desc: "Curated a virtual portfolio of stocks from different sectors with minimum inter-stock correlation and maximum Sharpe ratio, applying Modern Portfolio Theory principles to optimise risk-adjusted returns.",
    date: "PGDM Project",
  },
];

export const skillGroups = [
  {
    title: "Valuation & Modelling",
    items: [
      { name: "DCF Analysis", pct: 90 },
      { name: "Relative Valuation", pct: 88 },
      { name: "Financial Modelling", pct: 85 },
      { name: "Sensitivity Analysis", pct: 82 },
    ],
  },
  {
    title: "Platforms & Data",
    items: [
      { name: "Bloomberg Terminal", pct: 88 },
      { name: "Workday ERP", pct: 92 },
      { name: "LSEG / Refinitiv", pct: 78 },
      { name: "Trading View", pct: 85 },
    ],
  },
  {
    title: "Technical Skills",
    items: [
      { name: "SQL", pct: 80 },
      { name: "Excel / Modelling", pct: 90 },
      { name: "Data Analysis", pct: 82 },
      { name: "QMS / ERP", pct: 85 },
    ],
  },
  {
    title: "Domain Expertise",
    items: [
      { name: "Equity Research", pct: 88 },
      { name: "Derivatives", pct: 80 },
      { name: "Fixed Income / FX", pct: 75 },
      { name: "Institutional Sales", pct: 85 },
    ],
  },
];

export const education: EducationItem[] = [
  {
    type: "Postgraduate",
    degree: "PGDM – Finance Management",
    school: "S.P. Jain Institute of Management & Research, Mumbai",
    year: "2023 – 2025",
  },
  {
    type: "Undergraduate",
    degree: "B.E. – Electrical & Electronics Engineering",
    school: "BMS College of Engineering",
    year: "2020 · CGPA 9.21/10",
  },
  {
    type: "Certification",
    degree: "CFA Level 2",
    school: "CFA Institute — Cleared First Attempt, 90%+ in Quant Methods",
    year: "2025",
  },
  {
    type: "Certification",
    degree: "NISM Research Analyst (Series XV)",
    school: "NISM — 84/100",
    year: "2024",
  },
];