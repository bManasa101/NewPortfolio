export default function About() {
  return (
    <section id="about" style={{ padding: "100px 0", position: "relative", zIndex: 1 }}>
      <div className="max-w-6xl mx-auto px-10">
        <div style={{ fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 24, height: 1, background: "var(--gold)", display: "inline-block" }} /> About
        </div>
        <div className="grid md:grid-cols-2 gap-20 items-start">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {[
"I'm a finance professional spanning institutional equity sales, ERP consulting, and engineering research. Currently at Axis Capital's Institutional Equities division, I manage relationships with some of India's most sophisticated buy-side institutions - PMS firms, Category III AIFs, insurance companies, and pension funds, sitting at the exact interface where sell-side research meets capital allocation decisions.",
"I hold a PGDM in Finance from SPJIMR and a B.E. in Electrical & Electronics Engineering from BMS College of Engineering (9.21 CGPA), and have cleared CFA Levels I and II on the first attempt, scoring 90%+ in Quantitative Methods. I also hold a NISM Research Analyst certification (Series XV).",
"My research work spans corporate valuation (DCF and relative analysis on Bharti Airtel), IPO analysis (Tata Tech), primary data analysis for SEBI's Consultation Paper on Index Derivatives, and portfolio construction using Modern Portfolio Theory. Before finance, I built financial systems at Deloitte and KPMG, reducing processing time by 70% through automation and onboarding a $28M US banking entity into Workday Financials.",
].map((p, i) => (
              <p key={i} style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.9 }}>{p}</p>
            ))}
          </div>
          <div style={{ background: "var(--bg2)", border: "1px solid rgba(200,169,110,0.15)", borderLeft: "3px solid var(--gold)", borderRadius: 8, padding: "2rem", position: "relative", overflow: "hidden" }}>
            <span style={{ position: "absolute", top: -10, left: 16, fontSize: "6rem", color: "rgba(200,169,110,0.08)", fontFamily: "Georgia, serif", lineHeight: 1 }}>"</span>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "var(--text)", fontWeight: 300, fontStyle: "italic", position: "relative" }}>
I believe good analysis starts with the right question, not more data.            </p>
            <div style={{ marginTop: "1rem", fontSize: "0.75rem", color: "var(--gold)", letterSpacing: "0.1em", position: "relative" }}>— Manasa Basavaraju</div>
          </div>
        </div>
      </div>
    </section>
  );
}