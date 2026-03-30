// lib/reports-store.ts
export type ReportSection = {
  thesis: string;
  keyFinancials: { label: string; value: string }[];
  risks: string[];
  conclusion: string;
};

export type Report = {
  slug: string;
  ticker: string;
  sector: string;
  rec: "Buy" | "Hold" | "Sell" | null;
  title: string;
  desc: string;
  date: string;
  detail: ReportSection;
};

export const defaultReports: Report[] = [
  {
    slug: "bharti-airtel-dcf",
    ticker: "AIRTEL",
    sector: "Telecom",
    rec: "Buy",
    title: "Bharti Airtel: Corporate Valuation via DCF & Relative Analysis",
    desc: "Performed DCF and relative valuation to compute intrinsic value of Bharti Airtel. Developed a comprehensive 5-year financial model.",
    date: "PGDM Project",
    detail: {
      thesis: "Bharti Airtel remains one of India's most structurally sound telecom operators. With sustained ARPU expansion, accelerating 5G rollout, and a growing Africa business acting as a natural hedge, the company is well-positioned to compound FCF over the next 5 years. Our DCF model, anchored on conservative WACC assumptions of 11.2% and terminal growth of 4%, yields an intrinsic value significantly above current market price, indicating a meaningful margin of safety.",
      keyFinancials: [
        { label: "Intrinsic Value (DCF)", value: "₹1,240/share" },
        { label: "WACC", value: "11.2%" },
        { label: "Terminal Growth Rate", value: "4.0%" },
        { label: "EV/EBITDA (FY25E)", value: "9.2x" },
        { label: "Revenue CAGR (5yr)", value: "14.3%" },
        { label: "EBITDA Margin (FY25E)", value: "52.1%" },
      ],
      risks: [
        "Intensified pricing competition from Reliance Jio compressing ARPU growth",
        "Regulatory risk from spectrum auction cost overruns",
        "Macro headwinds in African markets (currency depreciation)",
        "Slower-than-expected 5G monetisation timeline",
      ],
      conclusion: "We initiate with a Buy recommendation and a 12-month price target of ₹1,240, implying ~18% upside. The risk-reward is attractive at current levels, supported by a clean balance sheet, disciplined capital allocation, and a management team with a strong execution track record.",
    },
  },
  {
    slug: "tata-tech-ipo",
    ticker: "TATATECH",
    sector: "Technology",
    rec: "Hold",
    title: "Tata Tech IPO: Stakeholder Impact & Financial Implications",
    desc: "Analysed the Tata Tech IPO and its impact on key stakeholders. Assessed financial implications including valuation multiples.",
    date: "Investment Banking",
    detail: {
      thesis: "Tata Technologies offers a differentiated pure-play on automotive ER&D services, backed by the Tata brand halo. The IPO was priced at ₹500, implying a 30x P/E on FY24E earnings — a premium that reflects the quality of the business but leaves limited upside in the near term. We assessed the IPO from the lens of key stakeholders: promoters, institutional allocatees, retail investors, and employees holding ESOPs.",
      keyFinancials: [
        { label: "IPO Price", value: "₹500/share" },
        { label: "P/E at IPO (FY24E)", value: "30.4x" },
        { label: "Market Cap at IPO", value: "₹20,314 Cr" },
        { label: "Revenue (FY23)", value: "₹3,926 Cr" },
        { label: "PAT Margin (FY23)", value: "12.8%" },
        { label: "Listing Premium", value: "~140%" },
      ],
      risks: [
        "High client concentration — top 5 clients contribute ~60% of revenue",
        "Dependence on automotive sector makes it cyclically exposed",
        "Post-listing re-rating risk if earnings disappoint",
        "Limited float given promoter holding of ~74%",
      ],
      conclusion: "We rate the IPO as Hold for investors who received allotment, with a 12-month view. The listing premium largely captures near-term upside. Long-term investors may accumulate on dips toward the ₹900–950 band for a better risk-adjusted entry. The business quality is not in question — it is purely a valuation call.",
    },
  },
  {
    slug: "sebi-index-derivatives",
    ticker: "INDEX",
    sector: "Derivatives",
    rec: null,
    title: "SEBI Consultation Paper: Index Derivatives — Primary Data Analysis",
    desc: "Conducted primary data analysis for SEBI's Consultation Paper on Index Derivatives. Compared global regulations and product offerings.",
    date: "Axis Capital, 2024",
    detail: {
      thesis: "India's derivatives market has witnessed exponential growth, with index options now constituting over 95% of total F&O turnover. SEBI's consultation paper seeks to address structural concerns — retail participation, speculative activity, and systemic risk — through measures such as upfront premium collection, intraday position monitoring, and rationalisation of weekly expiries. This analysis presents primary data collected from market participants and maps it against international regulatory frameworks.",
      keyFinancials: [
        { label: "India F&O Turnover (FY24)", value: "$6T+ monthly" },
        { label: "Retail Loss-Making %", value: "~89% (FY22–24)" },
        { label: "Weekly Expiry Contracts", value: "5 (pre-reform)" },
        { label: "Lot Size Increase", value: "2x–3x proposed" },
        { label: "Upfront Margin Req.", value: "100% of premium" },
        { label: "Calendar Spread Margin", value: "Revised upward" },
      ],
      risks: [
        "Over-regulation could drive volume to offshore platforms (GIFT City, SGX)",
        "Sudden liquidity withdrawal may increase bid-ask spreads",
        "Market maker economics could deteriorate under stricter margining",
        "Implementation timeline risk — phased rollout creates arbitrage windows",
      ],
      conclusion: "SEBI's reforms are structurally sound and align with the global trend of protecting retail participants. However, the pace and sequencing of implementation will be critical. We recommend a phased approach with continuous market impact monitoring. For institutional participants, the reforms create a net positive environment through improved price discovery and reduced noise.",
    },
  },
  {
    slug: "sharpe-ratio-portfolio",
    ticker: "PORTFOLIO",
    sector: "Multi-Sector",
    rec: "Buy",
    title: "Security Selection: Min-Correlation, Max Sharpe-Ratio Portfolio",
    desc: "Curated a virtual portfolio of stocks with minimum inter-stock correlation and maximum Sharpe ratio using Modern Portfolio Theory.",
    date: "PGDM Project",
    detail: {
      thesis: "Using Modern Portfolio Theory (Markowitz), we constructed an optimised equity portfolio of 8 stocks drawn from 6 sectors — Technology, FMCG, Banking, Pharma, Infrastructure, and Energy — with the twin objectives of minimising inter-stock correlation and maximising the portfolio Sharpe ratio. The efficient frontier was mapped using 3-year historical return data, and the optimal portfolio was identified at a risk-free rate of 6.5% (10Y G-Sec yield).",
      keyFinancials: [
        { label: "Portfolio Sharpe Ratio", value: "1.84" },
        { label: "Expected Annual Return", value: "18.6%" },
        { label: "Portfolio Volatility", value: "12.3%" },
        { label: "Avg. Correlation (pairs)", value: "0.21" },
        { label: "Number of Stocks", value: "8" },
        { label: "Benchmark (Nifty 50 Sharpe)", value: "0.97" },
      ],
      risks: [
        "Historical correlations may break down in tail-risk events (correlation convergence)",
        "Optimised portfolios suffer from estimation error in expected returns",
        "Concentration in smaller-cap names increases liquidity risk",
        "Rebalancing costs erode theoretical alpha in real-world implementation",
      ],
      conclusion: "The optimised portfolio achieved a Sharpe ratio of 1.84 versus the Nifty 50 benchmark of 0.97 — a near 2x improvement in risk-adjusted return. The low average pairwise correlation of 0.21 validates the sector diversification strategy. This exercise demonstrates that disciplined stock selection guided by quantitative portfolio construction can meaningfully outperform passive benchmarks on a risk-adjusted basis.",
    },
  },
];