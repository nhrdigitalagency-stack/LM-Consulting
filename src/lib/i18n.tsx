import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  cabinet as cabinetFr,
  faqData as faqFr,
  getActiveServices as getActiveServicesFr,
  getAllResources as getAllResourcesFr,
  implantationsData as implantationsFr,
  legalData as legalFr,
  servicesSection as servicesSectionFr,
  type OfficeItem,
  type ServiceItem,
} from './content';
import type { ParsedMdxArticle } from './mdx';

export type Locale = 'fr' | 'en';

const STORAGE_KEY = 'lm_consulting_locale_v1';

const cabinetEn: typeof cabinetFr = {
  ...cabinetFr,
  brand: {
    ...cabinetFr.brand,
    baseline: 'A genuine pleasure to support your growth',
    shortPositioning:
      'Advisory, corporate upgrading, and financial structuring firm in Cameroon.',
    engagement:
      'Tailored, high-standard advisory support to bring your business projects to fruition and achieve your corporate objectives.',
  },
  contact: {
    ...cabinetFr.contact,
    phones: [
      {
        display: '(+237)\u00A0695\u00A0491\u00A0296',
        tel: '+237695491296',
        label: 'Direct Line & Executive Management',
        isWhatsapp: true,
      },
      {
        display: '(+237)\u00A0653\u00A0808\u00A0106',
        tel: '+237653808106',
        label: 'Front Desk & Client Files',
        isWhatsapp: false,
      },
    ],
  },
  hero: {
    ...cabinetFr.hero,
    h1: 'Corporate Advisory & Business Upgrading Firm in Cameroon',
    visualHook: 'Structure. Finance. Endure.',
    visualHookVariants: [
      'Structure. Finance. Endure.',
      'Accounting discipline at the service of your decisions.',
      'Putting your company in full working order.',
    ],
    subtitle:
      'From our offices in Yaoundé (Warda) and Douala (Bonanjo), we support SME executives, entrepreneurs, and project sponsors across their accounting organization, tax compliance, and financing applications.',
    primaryCta: {
      label: 'Schedule a consultation',
      href: '/contact',
    },
    secondaryCta: {
      label: 'Explore our services',
      href: '/services',
    },
    architecturalPlateCaption:
      'Yaoundé (ADJAL Building, Warda) · Douala (ONCPB Building, Bonanjo)',
  },
  positioning: {
    sectionNumber: '01',
    label: 'Positioning',
    scrubStatement:
      'Many Cameroonian businesses hold a genuine market share yet stumble over three specific hurdles: accounting reconstructed under pressure, poorly anticipated tax exposure, and loan applications rejected for lack of reliable financial statements. Our profession is to set these foundations straight.',
    supportingNote:
      'We intervene both in organizational turnarounds and in ongoing executive and financial advisory.',
  },
  metrics: [
    {
      id: 'entreprises',
      prefix: '+',
      value: 120,
      suffix: '',
      label: 'Companies supported',
      detail: 'SMEs, growing enterprises, and project sponsors advised across Cameroon.',
    },
    {
      id: 'satisfaction',
      prefix: '',
      value: 95,
      suffix: '\u00A0%',
      label: 'Satisfied clients',
      detail: 'Retention measured across ongoing accounting, tax, and strategic mandates.',
    },
    {
      id: 'experience',
      prefix: '',
      value: 5,
      suffix: '\u00A0yrs',
      label: 'Years of practice',
      detail: 'Continuous hands-on operations in the economic hubs of Yaoundé and Douala.',
    },
  ],
  audiences: {
    sectionNumber: '03',
    label: 'Who we serve',
    heading: 'Three corporate realities, one shared requirement for financial clarity',
    intro:
      'Our engagements adapt to the maturity of your organization without weighing down daily operations.',
    profiles: [
      {
        number: 'I',
        title: 'Established SME Executives',
        situation:
          'Your revenue is growing, yet visibility over margins, cash flow, or tax deadlines remains partial.',
        intervention:
          'Comprehensive strategic diagnosis, monthly executive dashboards, internal control, tax regularization, and DSF preparation.',
        recommendedServiceSlug: 'mise-a-niveau-structuration-strategique',
        recommendedServiceLabel: 'View corporate upgrading',
      },
      {
        number: 'II',
        title: 'Scaling Entrepreneurs',
        situation:
          'You are applying for a bank loan, equipment lease, or institutional financing that requires coherent projections and auditable accounts.',
        intervention:
          'Preliminary financial audit, fully costed business plan, credit file assembly, and hands-on support until disbursement.',
        recommendedServiceSlug: 'business-plan-et-financement',
        recommendedServiceLabel: 'View financing advisory',
      },
      {
        number: 'III',
        title: 'Project Sponsors & Founders',
        situation:
          'You are launching operations in Cameroon and want to avoid early mistakes in legal form, tax regime, or initial bookkeeping setup.',
        intervention:
          'Selection of the appropriate legal framework, incorporation formalities, initial tax and CNPS registration, and chart of accounts setup.',
        recommendedServiceSlug: 'creation-d-entreprise',
        recommendedServiceLabel: 'View company formation',
      },
    ],
  },
  methodology: {
    sectionNumber: '04',
    label: 'Our methodology',
    heading: 'Four working sequences to stabilize and then scale your operations',
    intro:
      'Every engagement follows a clear progression: understand current operations, install reliable tools, consolidate profitability, and prepare the next stage.',
    steps: [
      {
        step: '01',
        title: 'Initial Support',
        subtitle: 'Scoping, design, and launch',
        description:
          'Review of existing records, assessment of the accounting, tax, and operational posture, and definition of a realistic action schedule to launch or restructure the project.',
        deliverable: 'Scoping memo and prioritized action plan',
      },
      {
        step: '02',
        title: 'Development',
        subtitle: 'Management tools and growth strategies',
        description:
          'Deployment of accounting procedures, operating budgets, financing files, and monitoring tables that sustain commercial expansion without losing control.',
        deliverable: 'Dashboards, procedures, and structured files',
      },
      {
        step: '03',
        title: 'Optimization',
        subtitle: 'Operational efficiency and profitability',
        description:
          'Cost price analysis, internal control hardening, securing periodic filings (taxes, CNPS, DSF), and targeted training for your internal teams.',
        deliverable: 'Reliable financial statements and autonomous teams',
      },
      {
        step: '04',
        title: 'Continuous Innovation',
        subtitle: 'Technology integration and market evolution',
        description:
          'Guidance on fintech adoption, digital payment reconciliation, and continuous upgrading of management systems in response to regulatory and sector changes.',
        deliverable: 'Modernized payment flows and ongoing adaptation',
      },
    ],
  },
  values: {
    sectionNumber: '06',
    label: 'Commitments & Values',
    heading: 'The principles governing every mandate we undertake',
    vision:
      'Deliver quality advisory services tailored to each client’s specific needs, pursue constant improvement to exceed agreed expectations, and stand as the benchmark for business upgrading in Cameroon and across the subregion.',
    items: [
      {
        code: '01',
        title: 'Expertise',
        description:
          'Accounting, financial, and tax practice maintained through continuous training and permanent regulatory watch on Cameroonian business law.',
      },
      {
        code: '02',
        title: 'Innovation',
        description:
          'Ongoing methodological research to adapt management tools, advanced Excel modeling, and fintech solutions to SME realities.',
      },
      {
        code: '03',
        title: 'Trust',
        description:
          'Clear reporting through readable performance reviews, strict confidentiality of financial figures, and candor regarding risk areas.',
      },
      {
        code: '04',
        title: 'Partnership',
        description:
          'Long-term client relationships extended through regular corporate seminars and a dedicated training program for Cameroonian SME executives.',
      },
    ],
    programs: {
      title: 'Corporate Seminars & Executive Training',
      description:
        'Beyond individual mandates, LM CONSULTING regularly hosts corporate seminars and a capacity-building program designed for Cameroonian SME executives and their accounting teams (financial statement analysis, management control, and advanced Excel mastery).',
    },
  },
  founder: {
    ...cabinetFr.founder,
    sectionNumber: '08',
    label: 'Firm Leadership',
    role: 'Managing Director, LM CONSULTING',
    degree: 'Professional Bachelor’s Degree in Management — Accounting & Finance',
    photo: {
      ...cabinetFr.founder.photo,
      alt: 'Laurentine MVONDO, Managing Director of LM CONSULTING in Yaoundé and Douala',
    },
    shortBio:
      'Holding a Professional Bachelor’s Degree in Management (Accounting and Finance), Laurentine MVONDO served as an accountant and Chief Financial & Administrative Officer across several companies before founding her advisory firm.',
    extendedBio: [
      'Before leading LM CONSULTING, Laurentine MVONDO served successively as an accountant and Administrative & Financial Director (CFO) in numerous Cameroonian companies. This operational background gives her direct insight into the pressures executives face: cash flow strain, sensitive year-end closings, tax audits, and banking negotiations.',
      'Holding a Professional Bachelor’s Degree in Management (Accounting and Finance), she entered advisory entrepreneurship with a clear conviction: an SME only grows sustainably when its numbers are accurate, understood by its leader, and defensible before financial institutions and tax authorities alike.',
      'Leading the firm between Yaoundé and Douala, she personally supervises corporate upgrading diagnostics, Statistical and Tax Return (DSF) preparation, and financing applications.',
    ],
    quote:
      'An executive backed by rigorous accounting and financial guidance makes calmer, faster, and better-defended decisions before partners.',
  },
};

const servicesSectionEn = {
  sectionNumber: '02',
  label: 'Practice Areas',
  heading: 'Our accounting, tax, financial, and strategic advisory practices',
  intro:
    'We intervene across the vital functions of Cameroonian enterprises: financial clarity, statutory compliance, margin control, and capacity to mobilize financing.',
};

const servicesEnMap: Record<string, Partial<ServiceItem>> = {
  'mise-a-niveau-structuration-strategique': {
    shortTitle: 'Corporate Upgrading & Strategic Structuring',
    title: 'Corporate Upgrading and Strategic Structuring in Cameroon',
    category: 'Strategy & Organization',
    previewPalette: {
      ground: '#0A1931',
      accent: '#EA7B1A',
      caption: 'Global Diagnosis · Financial Audit · Restructuring Plan',
    },
    seo: {
      title: 'Corporate Upgrading in Cameroon | LM Consulting',
      description:
        'Comprehensive strategic diagnosis, financial audit, and SME restructuring in Yaoundé and Douala to secure your accounts and governance.',
    },
    summary:
      'Comprehensive strategic diagnosis, in-depth financial audit, and tailored restructuring plans for SMEs scaling up or navigating operational tension.',
    introduction: [
      'When an SME grows rapidly or faces an economic slowdown, the gap between its commercial activity and its internal organization quickly becomes costly: decisions made without reliable cash flow visibility, poorly separated cashier and accounting duties, and documentation delays that block access to contracts or bank facilities.',
      'Our corporate upgrading practice in Yaoundé, Douala, and across Cameroon does not consist of writing a theoretical report. We review all of your operational and financial cycles to pinpoint concrete vulnerabilities, then guide the adjustments needed to put the business in full working order.',
      'This work also prepares your organization for the requirements of national and international upgrading programs, credit institutions, and major corporate buyers that audit supplier governance.',
    ],
    deliverables: [
      {
        title: 'Strategic & Organizational Diagnostic Report',
        detail:
          'Documented analysis of governance, the sales-purchasing-cash cycle, allocation of responsibilities, and operational risks.',
      },
      {
        title: 'Financial Audit & Account Reliability Review',
        detail:
          'Examination of balance sheet structure, working capital requirement (WCR), debt profile, real profitability by business line, and latent liabilities.',
      },
      {
        title: 'Costed & Sequenced Restructuring Plan',
        detail:
          'Operational 3-, 6-, and 12-month roadmap detailing priority measures, designated owners, and recovery indicators.',
      },
      {
        title: 'Core Procedures Manual',
        detail:
          'Formalization of expenditure commitment rules, billing workflows, cash desk management, and hierarchical sign-off.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Document Collection & On-Site Interviews',
        detail:
          'Meetings with executive leadership and operational heads, review of past financial statements, bank statements, and key contracts.',
      },
      {
        step: '02',
        title: 'Cross-Functional Financial, Tax & Operational Diagnosis',
        detail:
          'Identification of margin leakage, administrative bottlenecks, and tax or social security exposure.',
      },
      {
        step: '03',
        title: 'Upgrading Plan Arbitration with Executive Management',
        detail:
          'Transparent presentation of findings and selection of actions with immediate impact on cash flow and accounting clarity.',
      },
      {
        step: '04',
        title: 'Deployment Support & Milestone Reviews',
        detail:
          'Hands-on assistance with your teams and periodic verification of implementation progress.',
      },
    ],
    audience: [
      'Family-owned or independent SMEs whose administrative structure has lagged behind revenue growth.',
      'Companies facing margin erosion or recurring cash tensions despite an active order book.',
      'Enterprises seeking qualification with development donors, upgrading programs, or institutional partners.',
    ],
    faq: [
      {
        question: 'How long does a corporate upgrading diagnostic typically take?',
        answer:
          'Depending on company size and how accounting records are filed, the initial diagnostic phase generally spans two to four weeks, followed by modular support for executing the action plan.',
      },
      {
        question: 'Can you intervene when financial difficulties are already acute?',
        answer:
          'Yes. The earlier the diagnosis begins, the broader the room for maneuver. We help management separate profitable lines from loss-making items and prepare a credible settlement plan for creditors.',
      },
    ],
  },
  'conseil-en-gestion-controle': {
    shortTitle: 'Management Advisory & Internal Control',
    title: 'Management Control, Internal Control & Executive Dashboards for SMEs',
    category: 'Performance & Control',
    previewPalette: {
      ground: '#0F2342',
      accent: '#EA7B1A',
      caption: 'Management Control · Dashboards · Advanced Excel Training',
    },
    seo: {
      title: 'Management Advisory & Internal Control | LM Consulting',
      description:
        'Executive dashboards, management control, internal audit, and advanced Excel training for leadership and finance teams in Yaoundé and Douala.',
    },
    summary:
      'Implementation of management control, monthly executive dashboards, internal control hardening, operational audit, and advanced Excel training.',
    introduction: [
      'Waiting until year-end closing to discover the true net result of a business leaves leadership flying blind for twelve months. Without analytical cost tracking, rising sales can conceal steady margin erosion or operational leakage in inventory and purchasing.',
      'Our Management Advisory practice installs simple, robust, and directly actionable measurement instruments within your SME: unit cost calculations, operating budgets, monthly variance tracking, and internal control procedures that curb both errors and fraud risk.',
      'Because a tool is only useful if mastered internally, we complement our mandates with practical training sessions on advanced Excel and financial data analysis for your accountants, controllers, and operations managers.',
    ],
    deliverables: [
      {
        title: 'Tailored Executive Dashboards',
        detail:
          'Key monthly metrics: revenue by line, gross margin, fixed overhead, break-even point, net cash position, and customer/supplier payment days.',
      },
      {
        title: 'Internal Control Framework & Segregation of Duties',
        detail:
          'Securing procurement circuits, inventory movements, cash desk operations, and bank reconciliations.',
      },
      {
        title: 'Budget Models & Cost Accounting',
        detail:
          'Pricing grids, full cost calculation, and monthly actual-versus-budget variance reviews.',
      },
      {
        title: 'Operational Advanced Excel Training',
        detail:
          'Workshops applied to your company’s real data: pivot tables, automated financial reporting, and consistency checks.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Business Model & Cost Center Mapping',
        detail:
          'Identification of the margin drivers specific to your sector (distribution, construction, services, manufacturing, logistics).',
      },
      {
        step: '02',
        title: 'Tool Architecture & Control Rules',
        detail:
          'Design of tracking matrices and definition of mandatory verification checkpoints across the administrative chain.',
      },
      {
        step: '03',
        title: 'Live Testing Over a Monthly Cycle',
        detail:
          'Guided population of the first monthly dashboard using your accounting and commercial data.',
      },
      {
        step: '04',
        title: 'Skills Transfer to Internal Teams',
        detail:
          'Practical staff training and establishment of a monthly management review with the executive director.',
      },
    ],
    audience: [
      'Executives who want reliable monthly figures before the 10th of each month.',
      'Multi-site or multi-activity businesses needing to isolate the profitability of each branch or contract.',
      'Finance departments seeking to upskill their accounting staff on advanced Excel.',
    ],
    faq: [
      {
        question: 'Do we need expensive software to start management control?',
        answer:
          'No. For most SMEs, well-coded bookkeeping paired with structured, locked Excel models delivers high-precision dashboards rapidly without disproportionate software spend.',
      },
      {
        question: 'Can advanced Excel training be delivered at our premises?',
        answer:
          'Yes, we organize in-house sessions at your offices in Yaoundé or Douala, as well as inter-company seminars for finance managers and executives.',
      },
    ],
  },
  'conseil-fiscal-et-comptable': {
    shortTitle: 'Tax Advisory, DSF & Bookkeeping',
    title: 'Tax & Accounting Advisory, Filings, and DSF Preparation in Cameroon',
    category: 'Accounting & Taxation',
    previewPalette: {
      ground: '#0A1931',
      accent: '#EA7B1A',
      caption: 'OHADA Accounting · Tax & CNPS Filings · DSF Preparation',
    },
    seo: {
      title: 'Tax, Accounting & DSF Preparation | LM Consulting',
      description:
        'Bookkeeping, periodic tax and CNPS filings, tax regularization, and annual DSF preparation in Yaoundé and Douala by LM Consulting.',
    },
    summary:
      'Organization and maintenance of accounting records, periodic tax and CNPS filings, tax compliance regularization, and rigorous annual DSF assembly.',
    introduction: [
      'In Cameroon, the legal and financial security of a company rests directly on the regularity of its bookkeeping and strict compliance with filing deadlines. Approximate account coding, a missed monthly return, or an inconsistent Statistical and Tax Return (DSF) rapidly exposes the business to heavy penalties and blocks its tax clearance certificate.',
      'LM CONSULTING handles the full organization or supervision of your accounting function under the revised OHADA standard, tracks your periodic tax and social security (CNPS) filings, and prepares your complete year-end DSF.',
      'When your company faces filing arrears or unclosed fiscal years, we conduct methodical account reconstruction and tax regularization to durably clear your administrative file.',
    ],
    deliverables: [
      {
        title: 'Accounting Organization & Ongoing Bookkeeping',
        detail:
          'Standardized filing of supporting vouchers, entry under the revised SYSCOHADA chart of accounts, third-party matching, and bank reconciliations.',
      },
      {
        title: 'Periodic Tax & CNPS Declarations',
        detail:
          'Timely preparation of monthly and periodic tax and CNPS social security returns according to your company’s tax regime.',
      },
      {
        title: 'Complete Statistical and Tax Return (DSF) Assembly',
        detail:
          'Year-end inventory entries, account auditing, transition from accounting profit to taxable income, and completion of standardized DSF tables.',
      },
      {
        title: 'Tax Regularization File',
        detail:
          'Detailed reconciliation of outstanding filings, verification of tax bases, and technical assistance in your interactions with the tax administration.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Review of Accounting Posture & Tax Regime',
        detail:
          'Verification of the existing tax file, past submissions, CNPS obligations, and voucher organization.',
      },
      {
        step: '02',
        title: 'Filing Calendar Setup & Monthly Collection',
        detail:
          'Simple monthly protocol for handing over invoices, cash vouchers, payroll sheets, and bank statements.',
      },
      {
        step: '03',
        title: 'Consistency Checks & Periodic Filings',
        detail:
          'Systematic verification of taxable bases and validation with management prior to each deadline.',
      },
      {
        step: '04',
        title: 'Year-End Closing & DSF Submission',
        detail:
          'Annual closing of accounts, full DSF package assembly, and commented presentation of results to management.',
      },
    ],
    audience: [
      'SMEs without a senior in-house chief accountant seeking to secure their statutory obligations.',
      'Companies with an internal accounting team looking for external review and expert support for year-end closing and DSF preparation.',
      'Executives needing to regularize multiple filing periods to restore full tax compliance.',
    ],
    faq: [
      {
        question: 'Can you work alongside our internal accountant?',
        answer:
          'Absolutely. In many SMEs, the internal team handles daily data entry while our firm provides monthly supervision, validates tax returns, and prepares the annual DSF.',
      },
      {
        question: 'What if some supporting vouchers from a past fiscal year are missing?',
        answer:
          'We first reconstruct transactions from bank statements, invoice stubs, and third-party confirmations to rebuild auditable accounts and identify exact tax exposure.',
      },
    ],
  },
  'business-plan-et-financement': {
    shortTitle: 'Business Plan & Financing Advisory',
    title: 'Business Plan Structuring and Financing Advisory in Cameroon',
    category: 'Financial Engineering',
    previewPalette: {
      ground: '#0F2342',
      accent: '#EA7B1A',
      caption: 'Financial Modeling · Credit File · End-to-End Financing Support',
    },
    seo: {
      title: 'Business Plan & SME Financing Cameroon | LM Consulting',
      description:
        'Business plan modeling, credit application files, and end-to-end financing support for SMEs and projects in Yaoundé and Douala.',
    },
    summary:
      'Preparation of fully costed business plans, assembly of financing applications, and active support throughout negotiations until funding is secured.',
    introduction: [
      'In Cameroon, many economically viable projects face bank rejection for a recurring reason: the submitted file relies on overly optimistic sales assumptions, overlooks initial working capital needs, or fails to clearly demonstrate debt service capacity.',
      'At LM CONSULTING, we design the business plan as a rigorous financial decision tool rather than a mere administrative formality. We test your assumptions against local cost realities, model coherent multi-year financial statements, and structure a file aligned with credit committee evaluation grids.',
      'Above all, our involvement does not stop when the document is handed over: we assist you in identifying suitable financing windows and support you throughout technical discussions until the financing process is completed.',
    ],
    deliverables: [
      {
        title: 'Comprehensive Business Plan (Strategic & Operational)',
        detail:
          'Structured presentation of the sponsor or existing company, documented market analysis, revenue model, operations plan, and governance.',
      },
      {
        title: 'Detailed Financial Projection Model',
        detail:
          'Initial investment and financing plan, projected income statement, monthly cash flow forecast, WCR calculation, break-even point, and sensitivity scenarios.',
      },
      {
        title: 'Complete Bank or Institutional Credit File',
        detail:
          'Compilation and formatting of administrative, accounting, tax, and collateral documents required by financial institutions.',
      },
      {
        title: 'Executive Summary & Committee Preparation',
        detail:
          'Executive brief for financial decision-makers and preparation of the business leader for credit committee questions.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Scoping Financing Needs & Debt Capacity',
        detail:
          'Objective assessment of the amount to finance (equipment, WCR, expansion) and available equity contribution.',
      },
      {
        step: '02',
        title: 'Financial Modeling & Business Plan Drafting',
        detail:
          'Rigorous costing of operating expenses, applicable taxes, and free cash flow available for debt service.',
      },
      {
        step: '03',
        title: 'Targeting Financial Partners & File Submission',
        detail:
          'Orientation toward commercial banks, category-2 microfinance institutions, leasing companies, or specialized funds.',
      },
      {
        step: '04',
        title: 'Follow-Up & Responses to Credit Analysts',
        detail:
          'Technical support during discussions with credit analysts right through to final approval and disbursement.',
      },
    ],
    audience: [
      'Existing SMEs preparing a productive investment, equipment purchase, or working capital facility for a major contract.',
      'Entrepreneurs applying for a cash line, medium-term loan, or equipment lease.',
      'Structured project sponsors with initial equity seeking a financial partner in Cameroon.',
    ],
    faq: [
      {
        question: 'Do you guarantee automatic bank approval?',
        answer:
          'No serious advisory firm can promise the sovereign decision of a credit committee. However, we eliminate rejections caused by incomplete, poorly costed, or inconsistent files, and we technically defend the project’s financial viability alongside you.',
      },
      {
        question: 'Does an operating company need its past DSFs to request financing?',
        answer:
          'Yes, financial institutions systematically require historical financial statements and tax compliance for past fiscal years. Where needed, we bring your accounts up to date before submitting the application.',
      },
    ],
  },
  'creation-d-entreprise': {
    shortTitle: 'Company Formation in Cameroon',
    title: 'Company Formation & Business Incorporation in Yaoundé and Douala',
    category: 'Incorporation & Launch',
    previewPalette: {
      ground: '#0A1931',
      accent: '#EA7B1A',
      caption: 'Legal Form Selection · Registration · Initial Accounting Setup',
    },
    seo: {
      title: 'Company Formation in Yaoundé & Douala | LM Consulting',
      description:
        'Full support for company formation in Cameroon: legal structure selection, registration formalities, tax setup, CNPS, and initial bookkeeping.',
    },
    summary:
      'Guidance on legal and tax structure, preparation of incorporation files, mandatory registrations, and immediate setup of sound management practices.',
    introduction: [
      'Forming a company in Cameroon goes far beyond obtaining a trade register extract. A poor initial choice between a sole proprietorship, SARL, or another OHADA corporate form—or overlooking tax and social security obligations in the very first quarter—often triggers penalties before the first franc of profit is earned.',
      'LM CONSULTING supports founders, local partners, and diaspora investors across every stage of incorporating their structure in Yaoundé and Douala, ensuring the chosen legal framework matches your real activity, shareholder governance, and financing plans.',
      'As soon as registration is complete, we install essential management routines with you (compliant invoicing, cash tracking, tax and CNPS filing calendar) to prevent administrative drift at launch.',
    ],
    deliverables: [
      {
        title: 'Legal, Tax & Social Security Orientation Memo',
        detail:
          'Practical comparison of corporate structures based on your capital, number of partners, asset liability, and tax regime.',
      },
      {
        title: 'Incorporation File Assembly & Follow-Up',
        detail:
          'Preparation of required documentation and step-by-step support through trade registration and tax assignment.',
      },
      {
        title: 'Initial Social Security Registration (CNPS)',
        detail:
          'Support with employer registration and scoping of initial obligations relating to salaried staff.',
      },
      {
        title: 'Accounting & Financial Starter Kit',
        detail:
          'Opening of the company’s chart of accounts, compliant invoice templates, and annual statutory filing calendar.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Entrepreneurial Project Scoping Interview',
        detail:
          'Analysis of the planned activity, equity split, initial investments, and launch timeline.',
      },
      {
        step: '02',
        title: 'Document Preparation & Incorporation Formalities',
        detail: 'Collection of supporting records and rigorous coordination of registration steps.',
      },
      {
        step: '03',
        title: 'Tax Registration & Social Security File Opening',
        detail:
          'Verification of proper tax regime assignment and filing obligations from the start of operations.',
      },
      {
        step: '04',
        title: 'First-Year Accounting Launch',
        detail:
          'Setup of document filing procedures to secure the very first monthly declarations.',
      },
    ],
    audience: [
      'Project sponsors wishing to launch operations on impeccable administrative and tax foundations.',
      'Informal or sole-trader entrepreneurs ready to transition into a structured corporate entity.',
      'Diaspora investors or foreign partners establishing a subsidiary or operating company in Yaoundé or Douala.',
    ],
    faq: [
      {
        question: 'Does a newly formed company with zero revenue already have filing obligations?',
        answer:
          'Yes. As soon as the company is registered and assigned to a tax center, periodic returns must be filed within statutory deadlines—even when “nil”—to avoid late-filing penalties.',
      },
      {
        question: 'Can company formation be paired with a business plan?',
        answer:
          'We strongly recommend doing so whenever launch requires bank financing or outside equity partners: the business plan directly informs capital sizing and corporate form.',
      },
    ],
  },
  'solutions-fintech': {
    shortTitle: 'Fintech Solutions Integration',
    title: 'Fintech Solutions Integration & Digital Cash Flow Management',
    category: 'Payments & Cash Flows',
    previewPalette: {
      ground: '#0F2342',
      accent: '#EA7B1A',
      caption: 'Merchant Payments · Accounting Reconciliation · Cash Traceability',
    },
    seo: {
      title: 'Fintech Integration for SMEs in Cameroon | LM Consulting',
      description:
        'Supporting Cameroonian SMEs with fintech integration, digital merchant payments, cash traceability, and accounting reconciliation.',
    },
    summary:
      'Scoping, selection, and accounting integration of electronic payment solutions, mobile collection, and digital treasury management.',
    introduction: [
      'The rapid growth of corporate Mobile Money, merchant payment gateways, and digital disbursement tools in Cameroon offers substantial commercial flexibility, but frequently creates an accounting blind spot: unreconciled merchant wallets, poorly isolated operator fees, and discrepancies between collected sales and booked revenue.',
      'LM CONSULTING approaches fintech solutions through the lens of the Chief Financial Officer and accountant. We help your business select payment and collection tools suited to your actual transaction volumes, and connect them cleanly to your internal controls and bookkeeping.',
      'You gain collection speed with your customers while maintaining a clear audit trail—essential during year-end closing and tax audits.',
    ],
    deliverables: [
      {
        title: 'Collection & Disbursement Flow Mapping',
        detail:
          'Analysis of current payment methods (cash, bank transfers, Mobile Money, cards), transaction fees, and loss exposure.',
      },
      {
        title: 'Requirements Brief & Fintech Partner Selection',
        detail:
          'Reasoned selection of merchant solutions compliant with CEMAC regulations and suited to your transaction profile.',
      },
      {
        title: 'Reconciliation & Accounting Entry Procedure',
        detail:
          'Precise method for booking digital transaction logs, operator commissions, and bank settlements.',
      },
      {
        title: 'Merchant Account Governance & Security Rules',
        detail:
          'Definition of access rights, approval thresholds, and daily checks to safeguard digital treasury.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Audit of Collections & Friction Points',
        detail:
          'Review of customer payment journeys, reconciliation delays, and cash-handling exposure.',
      },
      {
        step: '02',
        title: 'Selection & Organizational Configuration',
        detail:
          'Support with opening corporate merchant accounts and strict separation between personal and company accounts.',
      },
      {
        step: '03',
        title: 'Integration into the Accounting Workflow',
        detail:
          'Creation of dedicated journals and automated matching between operator statements, customer invoices, and bank accounts.',
      },
      {
        step: '04',
        title: 'Cashier & Accountant Training',
        detail:
          'Hands-on training on daily closing reports and periodic verification of zero discrepancy.',
      },
    ],
    audience: [
      'Retailers, distribution networks, schools, clinics, and service providers handling high volumes of mobile payments.',
      'SMEs seeking to reduce physical cash handling and secure revenue traceability.',
      'Growing companies deploying new online or subscription sales channels in Cameroon.',
    ],
    faq: [
      {
        question: 'Why shouldn’t we use a personal Mobile Money number to collect customer payments?',
        answer:
          'Mixing a personal wallet with company revenue distorts the audit trail, complicates justification of bank flows, and exposes both the company and the executive during a tax audit.',
      },
      {
        question: 'Are you tied to a single operator or software vendor?',
        answer:
          'No. Our advisory remains strictly independent: we recommend the collection and tracking architecture that best fits your clientele, fee structure, and accounting setup.',
      },
    ],
  },
  'digitalisation-et-systemes': {
    shortTitle: 'Digitalization & Business Systems',
    title: 'Process Digitalization, Business Applications & IT Hygiene',
    category: 'Systems & Tools',
    previewPalette: {
      ground: '#0A1931',
      accent: '#EA7B1A',
      caption: 'Custom Tools · Software Integration · Data Protection',
    },
    seo: {
      title: 'SME Digitalization & Software Integration | LM Consulting',
      description:
        'Supporting SMEs in Cameroon with management digitalization, software integration, business web applications, and IT data security.',
    },
    summary:
      'Scoping digital requirements, deploying management applications, and integrating software to serve accounting reliability and corporate data protection.',
    introduction: [
      'Digitalizing an SME only makes economic sense if it genuinely simplifies invoicing, inventory tracking, customer management, or accounting production. Too many companies fund poorly sized tools that end up abandoned a few months later for lack of clear specifications and team onboarding.',
      'Directly aligned with our management and internal control expertise, we guide businesses in expressing functional needs, integrating management software or custom web applications, and strengthening security practices around sensitive financial data.',
      'Every digital project is thus driven by your staff’s real workflows and the reliability of the financial information it must produce.',
    ],
    deliverables: [
      {
        title: 'Management-Oriented Functional Specifications',
        detail:
          'Precise translation of your accounting, commercial, and logistics workflows into verifiable specifications.',
      },
      {
        title: 'Software Integration & Business Applications',
        detail:
          'Deployment of tailored tools (billing, commercial management, dedicated web portals) interconnected with your accounting organization.',
      },
      {
        title: 'IT Hygiene Audit & Data Backup Policy',
        detail:
          'Verification of accounting workstation protection, regular backup policies, access management, and business continuity.',
      },
      {
        title: 'Change Management & User Acceptance Testing',
        detail:
          'Verification of calculation accuracy (taxes, discounts, inventory) and training of end users.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Review of Existing Tools & Redundant Entries',
        detail:
          'Identification of duplicate data entry across paper ledgers, scattered spreadsheets, and accounting software.',
      },
      {
        step: '02',
        title: 'Target Architecture & Solution Selection',
        detail:
          'Pragmatic arbitration between configuring proven management software and developing a custom module.',
      },
      {
        step: '03',
        title: 'Phased Rollout, Data Migration & Testing',
        detail:
          'Controlled migration of customer lists, items, and opening balances with accounting verification.',
      },
      {
        step: '04',
        title: 'Access Hardening & Post-Launch Support',
        detail:
          'Setup of automated backups and assistance during the first monthly closings on the new system.',
      },
    ],
    audience: [
      'SMEs transitioning from isolated spreadsheets to a coherent commercial and accounting system.',
      'Executives keen to protect their accounting and commercial databases against data loss or unauthorized access.',
      'Organizations needing a business web application connected to their operational workflows.',
    ],
    faq: [
      {
        question: 'Where should we start when everything is still managed on paper or disconnected files?',
        answer:
          'We always start by stabilizing your core procedures (voucher numbering, approval circuit, item nomenclature) before computerizing: digitizing a disorganized process only speeds up errors.',
      },
      {
        question: 'Do you ensure consistency between commercial software and OHADA accounting?',
        answer:
          'That is precisely the added value of an accounting-led advisory firm: every workflow configured in the business tool is verified from the standpoint of its accounting and tax translation.',
      },
    ],
  },
};

export interface TestimonialItem {
  id: string;
  company: string;
  sector: string;
  city: string;
  authorName: string;
  authorRole: string;
  serviceSlug: string;
  serviceLabel: string;
  metricValue: string;
  metricContext: string;
  beforeState: string;
  quote: string;
}

const testimonialsFr: TestimonialItem[] = [
  {
    id: 'transcam-logistique',
    company: 'TransCam Logistics SARL',
    sector: 'Transport & Transit portuaire',
    city: 'Douala · Bonanjo',
    authorName: 'Hervé Mbarga',
    authorRole: 'Directeur Général',
    serviceSlug: 'business-plan-et-financement',
    serviceLabel: 'Business plan & financement',
    metricValue: '85 M FCFA',
    metricContext: 'Crédit d’équipement obtenu en 11 semaines',
    beforeState:
      'Deux dossiers de financement ajournés faute de prévisionnel de trésorerie cohérent avec nos DSF.',
    quote:
      'LM Consulting a repris nos trois derniers exercices, recalé nos hypothèses de BFR et bâti un business plan défendable devant le comité de crédit. Le financement de quatre camions supplémentaires a été débloqué dans les délais prévus.',
  },
  {
    id: 'agro-centre-cameroun',
    company: 'Société Agro-Centre SA',
    sector: 'Transformation agroalimentaire',
    city: 'Yaoundé · Centre',
    authorName: 'Chantal Ngono',
    authorRole: 'Présidente Directrice Générale',
    serviceSlug: 'conseil-fiscal-et-comptable',
    serviceLabel: 'Conseil fiscal, DSF & comptabilité',
    metricValue: '100 %',
    metricContext: 'Conformité DSF & CNPS rétablie sur 3 exercices',
    beforeState:
      'Retard cumulé sur les rapprochements bancaires et écarts entre déclarations mensuelles et clôture.',
    quote:
      'En moins d’un trimestre, l’équipe de Laurentine MVONDO a apuré nos suspens comptables, régularisé nos déclarations CNPS et livré une DSF irréprochable. Nous abordons désormais chaque échéance fiscale sans tension.',
  },
  {
    id: 'batiment-travaux-littoral',
    company: 'BTP Horizon & Ingénierie',
    sector: 'Génie civil & Marchés privés',
    city: 'Douala · Akwa',
    authorName: 'Paul-Éric Tchoumba',
    authorRole: 'Gérant fondateur',
    serviceSlug: 'mise-a-niveau-structuration-strategique',
    serviceLabel: 'Mise à niveau & contrôle de gestion',
    metricValue: '+14 pts',
    metricContext: 'Amélioration de la marge nette chantier sur 9 mois',
    beforeState:
      'Chiffre d’affaires en forte hausse mais trésorerie tendue et coût de revient mal suivi par chantier.',
    quote:
      'Le diagnostic initial a immédiatement isolé les postes de dérapage sur nos achats matériaux. Grâce aux tableaux de bord mensuels et à la formation Excel de notre comptable, nous connaissons notre marge réelle avant le 10 de chaque mois.',
  },
  {
    id: 'distri-pay-yaounde',
    company: 'Solaire & Énergie Distribution',
    sector: 'Commerce B2B & Réseau multi-points',
    city: 'Yaoundé · Bastos',
    authorName: 'Aminatou Bello',
    authorRole: 'Directrice des Opérations',
    serviceSlug: 'solutions-fintech',
    serviceLabel: 'Intégration fintech & réconciliation',
    metricValue: '0 écart',
    metricContext: 'Réconciliation mensuelle Mobile Money & banque',
    beforeState:
      'Encaissements dispersés sur plusieurs portefeuilles mobiles sans piste d’audit fiable.',
    quote:
      'En séparant nos comptes marchands et en installant un journal de rapprochement quotidien, nous avons éliminé les écarts de caisse digitale tout en gardant la souplesse de paiement appréciée par nos clients.',
  },
];

const testimonialsEn: TestimonialItem[] = [
  {
    id: 'transcam-logistique',
    company: 'TransCam Logistics SARL',
    sector: 'Freight & Port Transit',
    city: 'Douala · Bonanjo',
    authorName: 'Hervé Mbarga',
    authorRole: 'Managing Director',
    serviceSlug: 'business-plan-et-financement',
    serviceLabel: 'Business plan & financing',
    metricValue: '85M FCFA',
    metricContext: 'Equipment loan approved in 11 weeks',
    beforeState:
      'Two prior loan applications deferred due to cash-flow forecasts disconnected from our historical DSFs.',
    quote:
      'LM Consulting reviewed our last three fiscal years, recalibrated working capital assumptions, and built a credit-ready business plan. Financing for four additional trucks was approved on schedule.',
  },
  {
    id: 'agro-centre-cameroun',
    company: 'Société Agro-Centre SA',
    sector: 'Agri-food Processing',
    city: 'Yaoundé · Centre',
    authorName: 'Chantal Ngono',
    authorRole: 'Chief Executive Officer',
    serviceSlug: 'conseil-fiscal-et-comptable',
    serviceLabel: 'Tax advisory, DSF & accounting',
    metricValue: '100%',
    metricContext: 'DSF & CNPS compliance restored across 3 fiscal years',
    beforeState:
      'Backlog in bank reconciliations and mismatches between monthly tax returns and annual accounts.',
    quote:
      'In less than one quarter, Laurentine MVONDO’s team cleared our suspense accounts, regularized our CNPS filings, and delivered an impeccable DSF. Every statutory deadline is now met calmly.',
  },
  {
    id: 'batiment-travaux-littoral',
    company: 'BTP Horizon & Ingénierie',
    sector: 'Civil Works & Contracting',
    city: 'Douala · Akwa',
    authorName: 'Paul-Éric Tchoumba',
    authorRole: 'Founder & Managing Partner',
    serviceSlug: 'mise-a-niveau-structuration-strategique',
    serviceLabel: 'Corporate upgrading & control',
    metricValue: '+14 pts',
    metricContext: 'Net project margin improvement in 9 months',
    beforeState:
      'Fast-growing revenue alongside cash strain and no project-level cost visibility.',
    quote:
      'The initial diagnostic pinpointed material procurement leakage immediately. With monthly dashboards and targeted Excel training for our accountant, we now review true net margins before the 10th of each month.',
  },
  {
    id: 'distri-pay-yaounde',
    company: 'Solaire & Énergie Distribution',
    sector: 'B2B Commerce & Multi-Branch',
    city: 'Yaoundé · Bastos',
    authorName: 'Aminatou Bello',
    authorRole: 'Chief Operating Officer',
    serviceSlug: 'solutions-fintech',
    serviceLabel: 'Fintech integration & reconciliation',
    metricValue: '0 gap',
    metricContext: 'Monthly Mobile Money & bank reconciliation',
    beforeState:
      'Customer payments scattered across multiple mobile wallets without an auditable trail.',
    quote:
      'By separating our corporate merchant accounts and installing a daily reconciliation workflow, we eliminated digital cash discrepancies while preserving instant mobile payments for our clients.',
  },
];

const faqEn: typeof faqFr = {
  sectionNumber: '10',
  label: 'Frequently Asked Questions',
  heading: 'Answers to the questions company executives ask us most often',
  items: [
    {
      id: 'faq-premier-echange',
      category: 'accompagnement',
      question:
        'How does an initial consultation take place at your Yaoundé or Douala office?',
      answer:
        'The first meeting—at our offices in the ADJAL Building (Warda, Yaoundé), the ONCPB Building (Bonanjo, Douala), or by phone—reviews your current posture, priority deadlines, and available records. Following this discussion, we send you a tailored engagement proposal detailing the exact scope, deliverables, and timeline.',
    },
    {
      id: 'faq-mise-a-niveau',
      category: 'accompagnement',
      question: 'What do you concretely mean by “corporate upgrading”?',
      answer:
        'Corporate upgrading consists of aligning a company’s internal organization, bookkeeping, tax compliance, and financial steering with the demands of its real activity and external partners (banks, investors, major contractors). It always starts with a comprehensive strategic and financial diagnosis before deploying a pragmatic structuring plan.',
    },
    {
      id: 'faq-retard-comptable-fiscal',
      category: 'fiscalite',
      question: 'Can you step in if our bookkeeping or tax filings are behind schedule?',
      answer:
        'Yes. A significant share of our mandates involves accounting reconstruction, clearing suspense accounts, and orderly regularization of tax and social security (CNPS) obligations. We first establish a precise inventory of missing or corrective returns to secure your file ahead of DSF submission.',
    },
    {
      id: 'faq-montage-dsf',
      category: 'fiscalite',
      question:
        'When should we begin preparing the Statistical and Tax Return (DSF)?',
      answer:
        'A reliable DSF is prepared well ahead of year-end closing through regular account reconciliation, fixed asset tracking, inventory counts, and bank matching. We can either provide periodic accounting supervision throughout the fiscal year or step in specifically for account auditing and full DSF assembly within statutory deadlines.',
    },
    {
      id: 'faq-controle-fiscal',
      category: 'fiscalite',
      question: 'How do you protect a company ahead of a DGI tax audit or CNPS inspection?',
      answer:
        'Prevention relies on three disciplines: substantiating every entry with compliant source vouchers, reconciling declared VAT/corporate tax revenue against actual bank inflows, and auditing payroll withholdings and CNPS filings monthly. During a tax audit notification, we prepare the technical justification file alongside your management.',
    },
    {
      id: 'faq-regime-fiscal-cameroun',
      category: 'fiscalite',
      question:
        'What are our monthly statutory filings under Cameroon’s tax regimes (IGS, Simplified, Standard)?',
      answer:
        'Filing obligations depend on annual revenue and tax classification: corporate income tax installments, VAT returns, payroll tax withholdings (IRPP, CFC, FNE), and CNPS social contributions before monthly deadlines. Upon onboarding, we build a tailored statutory calendar to eliminate avoidable penalties.',
    },
    {
      id: 'faq-business-plan-financement',
      category: 'financement',
      question: 'Do you support the executive after drafting the business plan?',
      answer:
        'Yes. A standalone document is rarely enough to unlock credit. Our mandate covers the costed feasibility study, complete assembly of the financing file, identification of relevant financial institutions (commercial banks, leasing companies, investment funds), and technical support during credit committee reviews until conclusion.',
    },
    {
      id: 'faq-criteres-banques-financement',
      category: 'financement',
      question:
        'What metrics do Cameroonian banks examine first before approving corporate credit?',
      answer:
        'Credit analysts check consistency across your last three DSFs or financial statements, net free cash flow coverage of future debt installments, working capital requirement (WCR) sizing, tax clearance certificates, and collateral coverage. We benchmark and strengthen each indicator prior to submission.',
    },
    {
      id: 'faq-fintech-mobile-money',
      category: 'comptabilite',
      question:
        'How should Mobile Money collections and digital payments be booked under OHADA accounting?',
      answer:
        'Corporate merchant wallets (Orange Money, MTN MoMo, payment aggregators) must be accounted for as dedicated treasury accounts in the company’s name. We set up daily reconciliation journals separating gross sales, operator fees, and bank settlements to preserve a clean audit trail.',
    },
    {
      id: 'faq-taille-entreprise',
      category: 'accompagnement',
      question: 'Do you only work with already incorporated companies?',
      answer:
        'No. We advise established SMEs with several fiscal years of history as well as sole proprietors transitioning into an SARL or SA corporate structure, and project sponsors or diaspora investors incorporating a new company in Cameroon.',
    },
    {
      id: 'faq-collaboration-comptable-interne',
      category: 'comptabilite',
      question: 'Can you work in tandem with our internal accountant?',
      answer:
        'Yes. Across many SMEs in Yaoundé and Douala, the internal team handles daily voucher entry and invoicing while LM CONSULTING delivers monthly supervision, validates tax filings, trains staff on advanced Excel, and finalizes year-end inventory and the DSF.',
    },
    {
      id: 'faq-confidentialite',
      category: 'comptabilite',
      question: 'How is the confidentiality of our accounting and banking records protected?',
      answer:
        'All accounting vouchers, bank statements, contracts, and payroll data shared with the firm are handled under strict professional secrecy. File access is restricted to the consultants directly assigned to your mandate under the supervision of firm leadership.',
    },
  ],
};

const implantationsEn: typeof implantationsFr = {
  sectionNumber: '07',
  label: 'Locations in Cameroon',
  heading: 'Two executive offices at the heart of Cameroon’s institutional and economic hubs',
  intro:
    'LM CONSULTING welcomes executives by appointment in Yaoundé and Douala, and advises businesses operating across the entire Cameroonian territory.',
  offices: implantationsFr.offices.map((office) => {
    if (office.slug === 'yaounde') {
      return {
        ...office,
        role: 'Firm Headquarters',
        district: 'Warda District, Administrative & Commercial Center',
        region: 'Centre Region, Cameroon',
        fullAddress: 'ADJAL Building, Warda, Yaoundé, Cameroon',
        schedule:
          'Monday to Friday · by appointment (detailed hours confirmed upon booking)',
        missingPhotoCaption:
          'Building facade — ADJAL Building, Warda, Yaoundé (office photography to be integrated)',
        seo: {
          title: 'Business Advisory Firm in Yaoundé (Warda) | LM Consulting',
          description:
            'Management advisory, DSF preparation, tax and accounting supervision, business plans, and company formation in Yaoundé, ADJAL Building Warda.',
          h1: 'Corporate Advisory & Business Upgrading Firm in Yaoundé',
        },
        presentation: [
          'Located in the ADJAL Building in the Warda district, LM CONSULTING’s Yaoundé headquarters advises SMEs, public and private sector contractors, commercial enterprises, and project sponsors across the capital and the Centre Region.',
          'Immediate proximity to central administrations and financial institutions streamlines company formation formalities, tax and social security regularizations, and financing applications.',
        ],
        keyFocusAreas: [
          'Comprehensive strategic diagnosis and upgrading for SMEs established in Yaoundé',
          'Bookkeeping, periodic tax returns, CNPS tracking, and annual DSF assembly',
          'Business plan structuring and accompaniment before banks and financing windows',
          'Company formation and team training in management control and advanced Excel',
        ],
        accessNote:
          'The Warda district is directly accessible from downtown Yaoundé, Bastos, and the May 20th Boulevard axis. Please schedule a slot in advance by phone or via our contact form so a senior consultant is dedicated to your visit.',
        mapVector: {
          ...office.mapVector,
          title: 'Urban Locator — Warda District, Yaoundé',
          pinLabel: 'ADJAL Building, Warda',
          pinSublabel: 'LM CONSULTING Headquarters',
        },
      };
    }
    return {
      ...office,
      role: 'Littoral Office & Economic Hub',
      district: 'Bonanjo Administrative & Financial District',
      region: 'Littoral Region, Cameroon',
      fullAddress: 'ONCPB Building, Bonanjo, Douala, Cameroon',
      schedule:
        'Monday to Friday · by appointment (detailed hours confirmed upon booking)',
      missingPhotoCaption:
        'Building facade — ONCPB Building, Bonanjo, Douala (office photography to be integrated)',
      seo: {
        title: 'Business Advisory Firm in Douala (Bonanjo) | LM Consulting',
        description:
          'SME upgrading, tax and accounting advisory, DSF preparation, management control, and financing search in Douala Bonanjo (ONCPB Building).',
        h1: 'Corporate Advisory, Management & Tax Firm in Douala (Bonanjo)',
      },
      presentation: [
        'Located in the ONCPB Building at the heart of the Bonanjo business district, our Douala office serves the operational needs of industrial, commercial, logistics, and service enterprises active in Cameroon’s economic capital.',
        'In an environment defined by fast operating cycles and cash flows, we help Littoral executives secure their management control, meet tax deadlines, and present solid financial files to bank headquarters located in Bonanjo and Akwa.',
      ],
      keyFocusAreas: [
        'Management control, margin analysis, executive dashboards, and internal control for Littoral SMEs',
        'Financial audit, account review, monthly tax filings, and annual DSF preparation',
        'Investment or working capital credit files and banking accompaniment in Douala',
        'Fintech integration and modernization of merchant collections and reconciliations',
      ],
      accessNote:
        'The ONCPB Building sits in central Bonanjo, in immediate proximity to bank headquarters, consular institutions, and the axis linking Akwa to the administrative plateau. Prior appointment recommended.',
      mapVector: {
        ...office.mapVector,
        title: 'Urban Locator — Bonanjo Plateau, Douala',
        pinLabel: 'ONCPB Building, Bonanjo',
        pinSublabel: 'LM CONSULTING Douala Office',
      },
    };
  }),
};

const resourcesEn: ParsedMdxArticle[] = [
  {
    frontmatter: {
      slug: 'qu-est-ce-que-la-dsf-et-qui-doit-la-deposer',
      title: 'What is the DSF in Cameroon and how do you prepare it without errors?',
      seoTitle: 'What is the DSF in Cameroon? SME Guide | LM Consulting',
      seoDescription:
        'Understand the role of the Statistical and Tax Return (DSF) in Cameroon, which companies must file it, and how to prepare your accounting closing.',
      category: 'Taxation & Accounting',
      publishedAt: '2026-10-18',
      updatedAt: '2026-11-05',
      readingTime: '6 min',
      author: 'Laurentine MVONDO',
      status: 'brouillon_a_valider',
      relatedServiceSlug: 'conseil-fiscal-et-comptable',
      relatedServiceAnchor: 'Explore our tax advisory and DSF preparation practice',
    },
    excerpt:
      'For many SME executives in Yaoundé and Douala, year-end accounting closing remains a period of high administrative pressure. At the heart of this deadline lies a decisive document: the Statistical and Tax Return (DSF)…',
    blocks: [
      {
        type: 'paragraph',
        text: 'For many SME executives in Yaoundé and Douala, year-end accounting closing remains a period of high administrative pressure. At the heart of this deadline lies a decisive document: the **Statistical and Tax Return (DSF)**. Far more than a routine annual formality, the DSF is the official snapshot of your company’s economic, balance-sheet, and tax health.',
      },
      {
        type: 'h2',
        id: 'what-purpose-does-the-dsf-serve',
        text: 'What purpose does the Statistical and Tax Return actually serve?',
      },
      {
        type: 'paragraph',
        text: 'The DSF fulfills a dual function for public authorities and the company’s financial partners:',
      },
      {
        type: 'ol',
        items: [
          '**An accounting and statistical function**: it synthesizes, under the **revised SYSCOHADA** accounting standard, the balance sheet, income statement, cash flow statement, and explanatory notes describing the past fiscal year.',
          '**A tax function**: it establishes the rigorous transition from accounting profit to taxable income, incorporating additions and deductions under Cameroonian tax law.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Beyond the tax administration, the DSF is the very first document requested by commercial banks, leasing institutions, and corporate contractors when an SME applies for financing or bids on a major tender.',
      },
      {
        type: 'h2',
        id: 'which-companies-must-file-a-dsf',
        text: 'Which companies must file a DSF?',
      },
      {
        type: 'paragraph',
        text: 'In Cameroon, the obligation to produce and e-file a DSF depends on the **tax regime** to which the business is assigned as well as its legal form. The presentation of financial statements (standard system or minimal cash system provided under the OHADA Uniform Act on Accounting Law and Financial Reporting) varies according to entity size and revenue.',
      },
      {
        type: 'paragraph',
        text: 'Because threshold rules, electronic filing procedures, and statutory deadlines may be adjusted in each annual Finance Law, executives should systematically refer to official texts published by the **Directorate General of Taxation (DGI)** and the **General Tax Code** in force, or have their status verified by a tax advisor.',
      },
      {
        type: 'callout',
        title: 'Key vigilance point for executives',
        text: 'A temporarily dormant company or one that recorded zero revenue during a fiscal year remains bound by its statutory filing obligations as long as cessation or suspension has not been formally registered with the competent administration.',
      },
      {
        type: 'h2',
        id: 'common-errors-that-weaken-a-dsf',
        text: 'The errors that most frequently weaken a DSF',
      },
      {
        type: 'ul',
        items: [
          '**Lack of reconciliation between monthly filings and the annual return**: revenue or payroll figures reported in the DSF show unexplained discrepancies with periodic tax and CNPS social security returns filed during the year.',
          '**Unjustified cash or third-party balances**: bank accounts not reconciled at fiscal year-end, abnormal cash desk balances, or customer and supplier accounts never matched.',
          '**Poor separation between deductible business expenses and personal outlays**: supporting invoices that fail formal tax requirements, exposing the business to tax reassessments.',
          '**Omission of physical inventory work**: lack of documented stock counts and updated fixed asset depreciation schedules.',
        ],
      },
      {
        type: 'h2',
        id: 'how-to-prepare-your-annual-closing',
        text: 'How to prepare your annual closing smoothly',
      },
      {
        type: 'ol',
        items: [
          '**File and enter vouchers every month** using a stable classification (purchases, sales, banks, cash desk, payroll, and social charges).',
          '**Perform a pre-closing review before year-end** to identify missing invoices, customer disputes, and necessary adjustments in time.',
          '**Verify tax and social consistency** between the general trial balance, monthly tax receipts, and CNPS declarations.',
          '**Maintain a complete audit file** capable of substantiating every balance-sheet line several years after closing.',
        ],
      },
      {
        type: 'paragraph',
        text: 'If your bookkeeping is behind schedule or you wish to secure your upcoming annual closing in Yaoundé or Douala, explore our [tax advisory, bookkeeping, and DSF preparation practice](/services/conseil-fiscal-et-comptable) or [schedule a confidential consultation with our firm](/contact).',
      },
    ],
  },
  {
    frontmatter: {
      slug: 'structurer-un-business-plan-pour-obtenir-un-financement',
      title: 'How to structure a credible business plan to secure financing in Cameroon',
      seoTitle: 'Structuring a Business Plan in Cameroon | LM Consulting',
      seoDescription:
        'Practical method for building a bankable business plan in Yaoundé and Douala: financial modeling, working capital, and debt service coverage.',
      category: 'Financing & Projects',
      publishedAt: '2026-10-26',
      updatedAt: '2026-11-08',
      readingTime: '7 min',
      author: 'Laurentine MVONDO',
      status: 'brouillon_a_valider',
      relatedServiceSlug: 'business-plan-et-financement',
      relatedServiceAnchor: 'Explore our business plan and financing advisory practice',
    },
    excerpt:
      'Every year in Douala and Yaoundé, SME executives and project sponsors with genuinely profitable activities see their credit applications deferred. In most cases, the issue is the financial structure of the file…',
    blocks: [
      {
        type: 'paragraph',
        text: 'Every year in Douala and Yaoundé, SME executives and project sponsors with genuinely profitable activities see their credit applications deferred. In the vast majority of cases, it is not the commercial relevance of the idea that is questioned by the credit committee, but the **financial structure of the submitted file**.',
      },
      {
        type: 'paragraph',
        text: 'A convincing business plan does not try to persuade with adjectives: it demonstrates, backed by proforma invoices and calculations, how borrowed funds will be converted into available cash flow to repay the lender without suffocating daily operations.',
      },
      {
        type: 'h2',
        id: 'what-a-credit-analyst-looks-at-first',
        text: 'What a credit analyst actually looks at first',
      },
      {
        type: 'ul',
        items: [
          '**Consistency between historical records and projections**: for an operating SME, forecasts must build upon reliable past financial statements (and regularly filed DSFs).',
          '**Realistic working capital requirement (WCR) sizing**: actual customer payment delays, raw material or merchandise stock rotation, supplier advances, and logistics lead times.',
          '**Sponsor financial commitment**: equity level, shareholder current account contributions, or retained earnings reinvested.',
          '**Cash flow generation and debt service coverage**: does net operating cash flow comfortably cover principal and interest repayments even if sales ramp up slower than planned?',
        ],
      },
      {
        type: 'h2',
        id: 'five-essential-pillars-of-a-bankable-file',
        text: 'The five essential pillars of a bankable file',
      },
      {
        type: 'h3',
        id: '1-sponsor-track-record-and-governance',
        text: '1. Clear presentation of the sponsor and governance',
      },
      {
        type: 'paragraph',
        text: 'Financial institutions fund a team capable of executing the project. The file must clearly present the leader’s background, shareholding structure, accounting organization, and technical skills deployed on the ground.',
      },
      {
        type: 'h3',
        id: '2-market-study-grounded-in-local-realities',
        text: '2. A market study grounded in local realities',
      },
      {
        type: 'paragraph',
        text: 'Rather than quoting generic global statistics, document your concrete outlets: exact customer segments targeted in Yaoundé, Douala, or regional markets, signed contracts or letters of intent, competitor pricing structures, and supply chain constraints.',
      },
      {
        type: 'h3',
        id: '3-substantiated-capital-expenditure',
        text: '3. Substantiated investment program',
      },
      {
        type: 'paragraph',
        text: 'Every investment line (production equipment, vehicles, fit-out, software) must be backed by **verifiable proforma invoices**, clearly separating pre-tax amounts, applicable taxes, and installation costs.',
      },
      {
        type: 'h3',
        id: '4-integrated-projected-financial-statements',
        text: '4. Integrated financial projections',
      },
      {
        type: 'ol',
        items: [
          'The **initial and multi-year financing plan**;',
          'The **projected income statement** detailing volumes, unit prices, intermediate inputs, and staff costs;',
          'The **first-year monthly cash flow forecast**, essential for spotting seasonal troughs;',
          'The **break-even calculation** and a **sensitivity analysis** testing a conservative scenario.',
        ],
      },
      {
        type: 'callout',
        title: 'The frequent mistake to avoid',
        text: 'Confusing projected accounting profit with available cash. A business can show a book profit on paper while defaulting on payments if customers pay at 90 days while suppliers and operating charges are paid in cash.',
      },
      {
        type: 'paragraph',
        text: 'Preparing an investment, business expansion, or structured incorporation? Explore our [business plan and financing advisory practice](/services/business-plan-et-financement), review our support for [company formation in Cameroon](/services/creation-d-entreprise), or [book a consultation with our team](/contact).',
      },
    ],
  },
  {
    frontmatter: {
      slug: 'mise-a-niveau-d-entreprise-par-ou-commencer',
      title: 'Upgrading an SME in Cameroon: where should you concretely begin?',
      seoTitle: 'SME Corporate Upgrading in Cameroon | LM Consulting',
      seoDescription:
        'Key steps to successfully upgrade a Cameroonian SME: comprehensive diagnosis, accounting cleanup, internal control, and margin steering.',
      category: 'Strategy & Governance',
      publishedAt: '2026-11-02',
      updatedAt: '2026-11-10',
      readingTime: '6 min',
      author: 'Laurentine MVONDO',
      status: 'brouillon_a_valider',
      relatedServiceSlug: 'mise-a-niveau-structuration-strategique',
      relatedServiceAnchor: 'View our corporate upgrading and strategic structuring practice',
    },
    excerpt:
      'Many Cameroonian SMEs grow thanks to the commercial drive of their founder. As long as the team is small, the executive can oversee everything from memory. Once volumes expand, the lack of written procedures turns growth into strain…',
    blocks: [
      {
        type: 'paragraph',
        text: 'Many Cameroonian SMEs grow thanks to the commercial drive of their founder. As long as the team has a few employees and a limited number of customers, the executive can oversee everything from memory. Yet as soon as volumes expand, the absence of written procedures and dashboards turns growth into exhaustion: cash discrepancies, billing delays, unexpected tax penalties, and uncertainty over true net margins.',
      },
      {
        type: 'paragraph',
        text: 'Launching a **corporate upgrading process** means replacing crisis management with a readable, controllable, and bankable business architecture.',
      },
      {
        type: 'h2',
        id: 'signals-that-upgrading-is-now-a-priority',
        text: 'Signals that corporate upgrading has become a priority',
      },
      {
        type: 'ul',
        items: [
          'You know your collected revenue, but cannot tell your **net margin by product or contract** for several months.',
          'The executive’s personal assets and corporate accounts are not yet strictly separated in daily flows.',
          'Every tax or social security deadline triggers a scramble for missing vouchers.',
          'Your tender bids or bank credit applications stall over administrative and financial files deemed incomplete.',
          'The absence of a single person in the accounting department is enough to freeze financial visibility.',
        ],
      },
      {
        type: 'h2',
        id: 'step-1-conduct-an-uncompromising-diagnosis',
        text: 'Step 1: Conduct an uncompromising comprehensive diagnosis',
      },
      {
        type: 'ol',
        items: [
          '**Financial and balance-sheet reality**: reconstruction of net cash, aged receivables, supplier payables, and potential tax or social liabilities.',
          '**Operational internal control**: who orders, who receives goods, who authorizes payment, and who books the accounting entry?',
          '**Commercial profitability**: which customers, branches, or product lines genuinely generate cash and which consume resources at a loss?',
          '**Team skills**: alignment between roles held and mastery of accounting and spreadsheet tools (notably Excel).',
        ],
      },
      {
        type: 'h2',
        id: 'step-2-clean-up-accounting-and-filing-fundamentals',
        text: 'Step 2: Clean up accounting and filing fundamentals first',
      },
      {
        type: 'ul',
        items: [
          'Continuous numbering and systematic archiving of invoices, delivery notes, and cash vouchers;',
          'Monthly bank reconciliations (including corporate mobile payment wallets);',
          'Updating the statutory filing calendar to eliminate avoidable penalties.',
        ],
      },
      {
        type: 'callout',
        title: 'A field-proven principle',
        text: 'A simple procedure applied every week by your staff is always worth more than a complex manual left in a drawer. Corporate upgrading succeeds when tailored to the real size of your SME.',
      },
      {
        type: 'h2',
        id: 'step-3-install-management-control-and-train-teams',
        text: 'Step 3: Install management control and train teams',
      },
      {
        type: 'paragraph',
        text: 'Once bookkeeping is reliable, the firm establishes a concise **monthly executive dashboard** focused on decisive indicators: billed versus collected revenue, gross margin, fixed overhead, inventory levels, and 30- and 60-day cash forecasts.',
      },
      {
        type: 'paragraph',
        text: 'To assess the current posture of your organization in Yaoundé or Douala, review our mandates in [corporate upgrading and strategic structuring](/services/mise-a-niveau-structuration-strategique), [management advisory and internal control](/services/conseil-en-gestion-controle), or [request an initial scoping meeting](/contact).',
      },
    ],
  },
];

const legalEn: typeof legalFr = {
  ...legalFr,
  mentionsLegales: {
    title: 'Legal Notice',
    seoTitle: 'Legal Notice | LM Consulting Cameroon',
    seoDescription:
      'Legal information regarding the publisher of the LM Consulting website, advisory firm based in Yaoundé and Douala (Cameroon).',
    lastUpdated: 'November 2026',
    notice:
      'This legal notice governs the use of the corporate website of LM CONSULTING. Statutory registration identifiers (RCCM and Unique Tax Identifier) are completed from the firm’s official incorporation records upon production deployment.',
    sections: [
      {
        heading: '1. Website Publisher',
        paragraphs: [
          'This website is published by LM CONSULTING, a corporate advisory, business upgrading, and capacity-building firm in Cameroon.',
          'Headquarters: ADJAL Building, Warda, Yaoundé, Cameroon.',
          'Littoral Office: ONCPB Building, Bonanjo, Douala, Cameroon.',
          'Publication Director: Laurentine MVONDO, Managing Director.',
          'Telephones: (+237) 695 491 296 / (+237) 653 808 106.',
          'Email: lmconsulting685@gmail.com.',
        ],
      },
      {
        heading: '2. Purpose of Published Information',
        paragraphs: [
          'The contents, guides, and presentations published on this website are provided strictly for general information. They do not replace a personalized consultation taking into account the specific legal, accounting, and tax situation of each enterprise.',
          'In tax, accounting, and social security matters, only the official texts in force in the Republic of Cameroon and the OHADA area (General Tax Code, annual Finance Laws, OHADA Uniform Acts, and CNPS regulations) are authoritative.',
        ],
      },
      {
        heading: '3. Intellectual Property',
        paragraphs: [
          'All texts, graphics, distinctive marks, logos, and layouts making up this website are the exclusive property of LM CONSULTING, unless explicitly stated otherwise.',
          'Any reproduction, representation, extraction, or reuse of these contents in whole or in part without prior written authorization from the firm is prohibited.',
        ],
      },
      {
        heading: '4. Liability & External Links',
        paragraphs: [
          'LM CONSULTING strives to ensure the accuracy and currency of information published on its site, without guaranteeing the absence of regulatory changes occurring after an article is published.',
          'External links pointing to third-party services (map directions, instant messaging, or institutional portals) are provided for user convenience and remain governed by those platforms’ own terms.',
        ],
      },
    ],
  },
  politiqueConfidentialite: {
    title: 'Privacy Policy',
    seoTitle: 'Privacy Policy | LM Consulting Cameroon',
    seoDescription:
      'Processing of personal data submitted through the contact form of LM Consulting in Yaoundé and Douala.',
    lastUpdated: 'November 2026',
    notice:
      'In accordance with personal data protection principles applicable in the Republic of Cameroon, LM CONSULTING collects only the information strictly necessary to process your professional inquiries.',
    sections: [
      {
        heading: '1. Data Collected via the Contact Form & Customer Support',
        paragraphs: [
          'When you send us an inquiry via the Contact page or the Customer Service widget, we collect only the information you voluntarily provide: full name, business email address, telephone number, company name, relevant practice area, and message content.',
          'No banking details or confidential accounting ledgers are requested during this initial inquiry.',
        ],
      },
      {
        heading: '2. Purpose & Legal Basis of Processing',
        paragraphs: [
          'This information is processed exclusively to respond to your inquiry, schedule an initial consultation in Yaoundé, Douala, or remotely, and prepare a tailored engagement proposal where appropriate.',
          'LM CONSULTING never sells, rents, or transfers your contact details to third parties for commercial or advertising purposes.',
        ],
      },
      {
        heading: '3. Retention & Security of Exchanges',
        paragraphs: [
          'Inquiries received are retained for the time needed to follow up on pre-contractual exchanges and, when a mandate is entrusted to the firm, for the statutory period applicable to professional client files.',
          'The website implements technical protection measures including strict input validation, request rate limiting, and HTTPS encryption.',
        ],
      },
      {
        heading: '4. Audience Measurement & Cookies',
        paragraphs: [
          'This website uses no third-party advertising trackers or behavioral profiling. When an audience measurement tool is enabled, it operates without advertising cookies solely to assess page readability.',
        ],
      },
      {
        heading: '5. Exercising Your Rights',
        paragraphs: [
          'You may request access to, correction of, or deletion of your personal information at any time by writing to lmconsulting685@gmail.com or contacting the firm’s headquarters in Yaoundé.',
        ],
      },
    ],
  },
};

export const uiDictionary = {
  fr: {
    nav: {
      home: 'Accueil',
      services: 'Services',
      about: 'À propos',
      yaounde: 'Yaoundé',
      douala: 'Douala',
      faq: 'FAQ',
      resources: 'Ressources',
      contact: 'Contact',
      cta: 'Planifier un échange',
      skipToContent: 'Aller au contenu principal',
      openMenu: 'Ouvrir le menu de navigation',
      closeMenu: 'Fermer le menu',
      langSwitchLabel: 'Changer la langue du site',
    },
    common: {
      scrollDown: 'Faire défiler',
      headquartersYaounde: 'Siège Yaoundé',
      officeDouala: 'Bureau Douala',
      accountingStandard: 'Référentiel comptable',
      allServicesLink: 'Vue d’ensemble des services',
      structuredDeliverables: 'livrables structurés',
      previewPrefix: 'Aperçu du pôle',
      deliverableLabel: 'Livrable repère',
      sequenceLabel: 'Séquence',
      measuredImpactLabel: '05 · Impact mesuré',
      measuredImpactHeading:
        'Cinq années d’interventions concrètes auprès des entreprises camerounaises',
      viewOfficeIn: 'Consulter le bureau de',
      googleMapsDirections: 'Itinéraire Google Maps',
      openInGoogleMaps: 'Ouvrir dans Google Maps',
      founderHeading:
        'Une direction issue de la pratique comptable et financière en entreprise',
      discoverFirmAndFounder: 'Découvrir le cabinet et le parcours de la dirigeante',
      faqSideNote:
        'Une question particulière sur votre régime fiscal, votre DSF ou un projet de financement\u00A0? Écrivez-nous directement via la page Contact.',
      viewAllFaq: 'Consulter toute la FAQ fiscalité & finance',
      backToTop: 'Haut de page',
      allRightsReserved: 'Tous droits réservés · Yaoundé & Douala, Cameroun.',
      legalNotice: 'Mentions légales',
      privacyPolicy: 'Politique de confidentialité',
      directContact: 'Contact direct',
      locations: 'Implantations',
      practiceAreas: 'Pôles d’expertise',
      breadcrumbAria: 'Fil d’Ariane',
    },
    testimonialsSection: {
      sectionNumber: '08',
      label: 'Retours clients & cas concrets',
      heading: 'Ce que nos clients dirigent et obtiennent sur le terrain',
      intro:
        'Des PME et groupes camerounais accompagnés sur la régularisation fiscale, le montage de la DSF, le contrôle de marge et la levée de financements bancaires.',
      beforeLabel: 'Situation initiale',
      serviceLinkLabel: 'Solliciter une mission similaire',
      prevAria: 'Témoignage précédent',
      nextAria: 'Témoignage suivant',
      slideOf: 'Cas client',
    },
    faqPage: {
      kicker: 'Centre de réponses dirigeants',
      h1: 'Foire aux questions — Fiscalité, DSF, comptabilité OHADA et financement',
      intro:
        'Retrouvez les réponses pratiques de notre direction sur les obligations fiscales au Cameroun, la préparation de la DSF, la structuration financière et l’accompagnement bancaire.',
      searchPlaceholder: 'Rechercher une question (ex. DSF, CNPS, crédit, contrôle fiscal…)',
      clearSearch: 'Effacer',
      allCategories: 'Toutes les thématiques',
      categories: {
        fiscalite: 'Fiscalité & DSF',
        financement: 'Financement & Business Plan',
        comptabilite: 'Comptabilité & Fintech',
        accompagnement: 'Mise à niveau & Création',
      },
      expandAll: 'Tout déplier',
      collapseAll: 'Tout replier',
      emptyStateTitle: 'Aucune question ne correspond à votre recherche.',
      emptyStateBody:
        'Posez directement votre question à nos consultants à Yaoundé ou Douala pour obtenir un éclairage adapté à votre entreprise.',
      emptyStateCta: 'Poser ma question au cabinet',
      resultsCountSuffix: 'questions affichées',
      quickAssistanceTitle: 'Besoin d’un avis confidentiel sur votre dossier\u00A0?',
      quickAssistanceBody:
        'Nos consultants examinent votre situation fiscale ou votre plan de financement lors d’un premier entretien.',
      quickAssistanceCta: 'Planifier un échange',
    },
    banner: {
      kicker: 'Premier échange sans engagement',
      defaultHeading: 'Parlons concrètement de la situation de votre entreprise',
      defaultSubtitle:
        'Un premier entretien confidentiel à Yaoundé (Warda), à Douala (Bonanjo) ou à distance permet de cadrer vos priorités comptables, fiscales ou financières.',
      cta: 'Planifier un échange',
    },
    servicesPage: {
      h1: 'Services de conseil, fiscalité, comptabilité et financement au Cameroun',
      introSuffix:
        'Nos équipes interviennent depuis Yaoundé (Immeuble ADJAL Warda) et Douala (Immeuble ONCPB, Bonanjo) sur des missions ponctuelles de redressement comme en suivi annuel régulier.',
      onSiteHeading: 'Interventions à Yaoundé, Douala et sur site client',
      onSiteBody:
        'Selon la nature des travaux (audit financier, tenue comptable, montage de DSF ou formation Excel avancé), les séances de travail se tiennent dans nos bureaux ou au sein même de votre entreprise afin d’impliquer directement vos collaborateurs.',
      yaoundeLink: 'Bureau de Yaoundé (Warda)',
      doualaLink: 'Bureau de Douala (Bonanjo)',
      bannerHeading: 'Vous hésitez entre plusieurs modes d’accompagnement ?',
      bannerSubtitle:
        'Décrivez-nous votre contexte actuel : nous vous orienterons vers l’intervention prioritaire (mise à niveau, régularisation fiscale, tenue comptable ou dossier de financement).',
      requestServiceCta: 'Solliciter ce pôle',
      operationalStakes: 'Enjeux opérationnels pour votre entreprise',
      relatedResourceKicker: 'Note méthodologique associée',
      whoIsItFor: 'À qui s’adresse cette mission',
      deliverablesKicker: 'Livrables remis au dirigeant',
      deliverablesHeading: 'Ce que nous produisons concrètement au cours de la mission',
      deliverableItemPrefix: 'Livrable',
      executionMethodKicker: 'Méthode d’exécution',
      executionMethodHeading: 'Déroulé type de notre accompagnement',
      faqKicker: 'Questions fréquentes',
      faqHeading: 'Précisions pratiques sur ce pôle',
      relatedServicesKicker: 'Maillage des expertises',
      relatedServicesHeading: 'Services complémentaires fréquemment articulés',
      viewService: 'Consulter le service',
      detailBannerPrefix: 'Échanger sur un besoin en',
    },
    aboutPage: {
      kicker: 'Le cabinet LM CONSULTING',
      h1: 'Accompagner la structuration et la solidité financière des entreprises camerounaises',
      intro:
        'Implanté à Yaoundé (Immeuble ADJAL Warda) et à Douala (Immeuble ONCPB, Bonanjo), LM CONSULTING est un cabinet de mise à niveau et de renforcement des capacités dédié aux PME, aux entrepreneurs et aux porteurs de projets.',
      visionKicker: 'Notre vision',
      visionHeading: 'Devenir une référence exigeante de la mise à niveau au Cameroun',
      missionKicker: 'Notre mission en quatre temps',
      founderKicker: 'Parcours de la dirigeante',
      founderHeading: 'Laurentine MVONDO, Manager du cabinet',
      valuesKicker: 'Nos valeurs cardinales',
      valuesHeading: 'Quatre engagements tenus dans chaque dossier',
      accessInfoPrefix: 'Voir les informations d’accès à',
    },
    localPage: {
      introPrefix: 'Nous recevons sur rendez-vous les dirigeants de PME, les entrepreneurs et les porteurs de projets.',
      proximityHeadingPrefix: 'Votre cabinet de proximité à',
      frequentMissionsPrefix: 'Missions fréquemment conduites depuis',
      coordinatesHeadingPrefix: 'Coordonnées & accueil —',
      addressLabel: 'Adresse',
      phonesLabel: 'Téléphones',
      emailLabel: 'Courrier électronique',
      receptionLabel: 'Modalités de réception',
      availableServicesKicker: 'Prestations disponibles',
      availableServicesHeadingPrefix: 'Services assurés par notre bureau de',
      seeOtherOfficePrefix: 'Voir aussi notre bureau de',
      serviceDetailLink: 'Détail du service',
      bannerHeadingPrefix: 'Planifier un rendez-vous à',
    },
    resourcesPage: {
      kicker: 'Publications & repères méthodologiques',
      h1: 'Guides pratiques de gestion, fiscalité et financement pour dirigeants au Cameroun',
      intro:
        'Nos notes synthétisent les bonnes pratiques de gouvernance comptable, de montage de la DSF, de préparation de business plans et de mise à niveau des PME à Yaoundé et Douala.',
      readingLabel: 'Lecture',
      readArticle: 'Lire la note',
      readingTimePrefix: 'Temps de lecture',
      byAuthorPrefix: 'Par',
      publishedOn: 'Publié le',
      updatedOn: 'Mis à jour le',
      regulatoryNoticeTitle: 'Note d’usage réglementaire\u00A0:',
      regulatoryNoticeBody:
        'ce guide méthodologique présente des repères généraux de gestion. Les dispositions fiscales, sociales et comptables applicables à votre entreprise relèvent des textes officiels en vigueur en République du Cameroun (Code Général des Impôts, lois de finances annuelles publiées par la Direction Générale des Impôts, réglementation CNPS et Actes uniformes OHADA).',
      relatedPracticeKicker: 'Pôle d’expertise lié',
      otherPublicationsKicker: 'Autres publications',
    },
    contactPage: {
      kicker: 'Prise de rendez-vous & renseignements',
      h1: 'Planifier un échange avec LM Consulting à Yaoundé ou Douala',
      intro:
        'Présentez-nous votre besoin en toute confidentialité. Vous pouvez également joindre notre équipe par téléphone ou via WhatsApp pour convenir d’un créneau rapide.',
      callBtnPrefix: 'Appeler ·',
      whatsappBtn: 'Écrire sur WhatsApp',
      formHeading: 'Formulaire de prise de contact',
      requiredNote:
        'Les champs marqués d’un astérisque (*) sont requis pour traiter votre demande.',
      successTitle: 'Demande enregistrée',
      errorTitle: 'Vérification requise',
      fullNameLabel: 'Nom et prénom *',
      fullNamePlaceholder: 'Ex. Jean-Marc Nkoa',
      companyLabel: 'Entreprise ou projet',
      companyPlaceholder: 'Raison sociale ou projet en création',
      emailLabel: 'Adresse électronique *',
      emailPlaceholder: 'direction@entreprise.cm',
      phoneLabel: 'Téléphone (Cameroun ou international) *',
      phonePlaceholder: '+237 6XX XXX XXX',
      serviceLabel: 'Service concerné *',
      otherServiceOption: 'Autre demande / Séminaire dirigeant',
      officeLabel: 'Bureau privilégié',
      officeYaounde: 'Yaoundé — Immeuble ADJAL Warda',
      officeDouala: 'Douala — Immeuble ONCPB, Bonanjo',
      officeOther: 'Autre ville / À distance',
      messageLabel: 'Contexte et objectif de votre demande *',
      messagePlaceholder:
        'Décrivez brièvement votre activité, vos échéances éventuelles (DSF, régularisation, dossier bancaire, création) et vos attentes.',
      submitIdle: 'Envoyer la demande',
      submitBusy: 'Transmission en cours…',
      privacyGuarantee: 'Confidentialité garantie ·',
      generalCoordinatesKicker: 'Coordonnées générales',
      phoneLinesLabel: 'Lignes téléphoniques',
      emailAddressLabel: 'Courrier électronique',
      socialNetworksLabel: 'Réseaux professionnels',
      facebookPagePrefix: 'Page Facebook ·',
      localPagePrefix: 'Page locale',
    },
    customerService: {
      triggerLabel: 'Service client',
      triggerAria: 'Ouvrir l’assistance Service Client LM Consulting',
      closeAria: 'Fermer la fenêtre Service Client',
      badge: 'Service Client · LM Consulting',
      heading: 'Comment pouvons-nous vous aider ?',
      subtitle:
        'Réponse directe par nos équipes à Yaoundé (Warda) et Douala (Bonanjo).',
      tabChannels: 'Canaux directs',
      tabCallback: 'Demande rapide',
      whatsappTitle: 'Discussion WhatsApp directe',
      whatsappDesc: 'Réponse rapide sur vos questions urgentes (DSF, fiscalité, RDV).',
      whatsappCta: 'Démarrer sur WhatsApp',
      whatsappPrefill:
        'Bonjour LM Consulting, je souhaite échanger avec votre service client concernant mon entreprise.',
      callYaoundeTitle: 'Ligne directe & Direction',
      callSecondaryTitle: 'Secrétariat & suivi dossiers',
      emailDirectTitle: 'Envoyer un e-mail direct',
      officesHoursNote: 'Lundi – Vendredi · Yaoundé (Warda) & Douala (Bonanjo)',
      quickFormIntro:
        'Laissez vos coordonnées et votre question : un consultant vous rappelle rapidement.',
      namePlaceholder: 'Votre nom et prénom *',
      phonePlaceholder: 'Votre numéro de téléphone *',
      emailPlaceholder: 'Votre e-mail professionnel *',
      messagePlaceholder: 'Votre besoin (ex. montage DSF, création, financement…) *',
      sendQuickBtn: 'Être recontacté rapidement',
      sendingQuickBtn: 'Envoi en cours…',
      quickSuccess:
        'Merci ! Votre demande a été transmise au service client LM Consulting.',
      fullContactLink: 'Ouvrir le formulaire complet de la page Contact',
    },
    notFound: {
      kicker: 'Erreur 404 · Page introuvable',
      h1: 'Cette adresse ne correspond à aucune page active du cabinet.',
      body: 'Le document recherché a pu être déplacé ou son lien comporte une erreur de saisie. Vous pouvez rejoindre directement l’accueil, consulter nos pôles de conseil ou nous contacter.',
      backHome: 'Retourner à l’accueil',
      browseServices: 'Parcourir nos services',
      contactOffices: 'Contacter nos bureaux',
    },
    newsletterSection: {
      kicker: 'Veille finance & fiscalité',
      heading: 'Recevez nos repères sur la DSF, la fiscalité OHADA et le financement PME',
      subtitle:
        'Une note de synthèse mensuelle rédigée par la direction du cabinet pour anticiper vos échéances comptables et bancaires.',
      emailLabel: 'Votre adresse e-mail professionnelle',
      emailPlaceholder: 'direction@entreprise.cm',
      subscribeLabel: 'S’abonner',
      submittingLabel: 'Inscription…',
      invalidEmail: 'Veuillez saisir une adresse e-mail professionnelle valide.',
      successTitle: 'Inscription confirmée',
      successMessage:
        'Merci. Votre adresse est désormais inscrite à la veille finance d’entreprise de LM CONSULTING.',
      alreadySubscribed: 'Cette adresse e-mail est déjà inscrite à notre veille.',
      errorFallback: 'Impossible d’enregistrer votre inscription pour le moment.',
      privacyNote: 'Désinscription libre à tout moment ·',
    },
  },
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      about: 'About',
      yaounde: 'Yaoundé',
      douala: 'Douala',
      faq: 'FAQ',
      resources: 'Insights',
      contact: 'Contact',
      cta: 'Schedule a call',
      skipToContent: 'Skip to main content',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close menu',
      langSwitchLabel: 'Switch website language',
    },
    common: {
      scrollDown: 'Scroll down',
      headquartersYaounde: 'Yaoundé HQ',
      officeDouala: 'Douala Office',
      accountingStandard: 'Accounting Framework',
      allServicesLink: 'Overview of all services',
      structuredDeliverables: 'structured deliverables',
      previewPrefix: 'Practice preview',
      deliverableLabel: 'Key deliverable',
      sequenceLabel: 'Sequence',
      measuredImpactLabel: '05 · Measured Impact',
      measuredImpactHeading:
        'Five years of hands-on advisory mandates alongside Cameroonian businesses',
      viewOfficeIn: 'View office in',
      googleMapsDirections: 'Google Maps directions',
      openInGoogleMaps: 'Open in Google Maps',
      founderHeading:
        'Executive leadership grounded in corporate accounting and financial practice',
      discoverFirmAndFounder: 'Discover the firm and the Managing Director’s background',
      faqSideNote:
        'Have a specific question regarding your tax regime, your DSF, or a financing project? Write to us directly via our Contact page.',
      viewAllFaq: 'Browse full Tax & Finance FAQ',
      backToTop: 'Back to top',
      allRightsReserved: 'All rights reserved · Yaoundé & Douala, Cameroon.',
      legalNotice: 'Legal Notice',
      privacyPolicy: 'Privacy Policy',
      directContact: 'Direct Contact',
      locations: 'Locations',
      practiceAreas: 'Practice Areas',
      breadcrumbAria: 'Breadcrumb',
    },
    testimonialsSection: {
      sectionNumber: '08',
      label: 'Client Testimonials & Outcomes',
      heading: 'What our corporate clients achieve on the ground',
      intro:
        'Cameroonian SMEs and corporate groups supported across tax regularization, DSF preparation, margin control, and bank financing.',
      beforeLabel: 'Initial situation',
      serviceLinkLabel: 'Request a similar mandate',
      prevAria: 'Previous testimonial',
      nextAria: 'Next testimonial',
      slideOf: 'Client case',
    },
    faqPage: {
      kicker: 'Executive Answers Center',
      h1: 'Frequently Asked Questions — Tax, DSF, OHADA Accounting & Corporate Finance',
      intro:
        'Practical answers from our leadership regarding statutory tax compliance in Cameroon, DSF closing, financial modeling, and bank credit advisory.',
      searchPlaceholder: 'Search a question (e.g. DSF, CNPS, bank loan, tax audit…)',
      clearSearch: 'Clear',
      allCategories: 'All topics',
      categories: {
        fiscalite: 'Tax & DSF',
        financement: 'Finance & Business Plan',
        comptabilite: 'Accounting & Fintech',
        accompagnement: 'Upgrading & Formation',
      },
      expandAll: 'Expand all',
      collapseAll: 'Collapse all',
      emptyStateTitle: 'No question matches your search.',
      emptyStateBody:
        'Ask our consultants directly in Yaoundé or Douala to receive guidance tailored to your business.',
      emptyStateCta: 'Ask our team',
      resultsCountSuffix: 'questions displayed',
      quickAssistanceTitle: 'Need confidential advice on your file?',
      quickAssistanceBody:
        'Our consultants review your tax posture or financing structure during an initial consultation.',
      quickAssistanceCta: 'Schedule a consultation',
    },
    banner: {
      kicker: 'Initial consultation without obligation',
      defaultHeading: 'Let’s discuss your company’s concrete priorities',
      defaultSubtitle:
        'A confidential initial meeting in Yaoundé (Warda), Douala (Bonanjo), or remotely helps scope your accounting, tax, or financing priorities.',
      cta: 'Schedule a consultation',
    },
    servicesPage: {
      h1: 'Advisory, Tax, Accounting & Financing Services in Cameroon',
      introSuffix:
        'Our teams operate out of Yaoundé (ADJAL Building, Warda) and Douala (ONCPB Building, Bonanjo) for both targeted turnaround mandates and ongoing annual supervision.',
      onSiteHeading: 'Engagements in Yaoundé, Douala, and at client premises',
      onSiteBody:
        'Depending on the nature of the mandate (financial audit, bookkeeping, DSF preparation, or advanced Excel training), working sessions take place at our offices or directly within your company to involve your staff.',
      yaoundeLink: 'Yaoundé Office (Warda)',
      doualaLink: 'Douala Office (Bonanjo)',
      bannerHeading: 'Unsure which advisory format best fits your needs?',
      bannerSubtitle:
        'Describe your current situation: we will guide you toward the priority intervention (corporate upgrading, tax regularization, bookkeeping, or financing file).',
      requestServiceCta: 'Inquire about this practice',
      operationalStakes: 'Operational stakes for your business',
      relatedResourceKicker: 'Related methodological guide',
      whoIsItFor: 'Who this mandate is designed for',
      deliverablesKicker: 'Deliverables handed to management',
      deliverablesHeading: 'What we concretely produce during the mandate',
      deliverableItemPrefix: 'Deliverable',
      executionMethodKicker: 'Execution methodology',
      executionMethodHeading: 'Typical progression of our support',
      faqKicker: 'Frequently Asked Questions',
      faqHeading: 'Practical details regarding this practice',
      relatedServicesKicker: 'Connected expertise',
      relatedServicesHeading: 'Complementary services frequently combined',
      viewService: 'View service details',
      detailBannerPrefix: 'Discuss your requirements in',
    },
    aboutPage: {
      kicker: 'About LM CONSULTING',
      h1: 'Supporting the structuring and financial strength of Cameroonian enterprises',
      intro:
        'With offices in Yaoundé (ADJAL Building, Warda) and Douala (ONCPB Building, Bonanjo), LM CONSULTING is a corporate upgrading and capacity-building firm dedicated to SMEs, entrepreneurs, and project sponsors.',
      visionKicker: 'Our Vision',
      visionHeading: 'Becoming an exacting benchmark for corporate upgrading in Cameroon',
      missionKicker: 'Our four-stage mission',
      founderKicker: 'Managing Director’s Track Record',
      founderHeading: 'Laurentine MVONDO, Managing Director',
      valuesKicker: 'Our Core Values',
      valuesHeading: 'Four commitments upheld in every client file',
      accessInfoPrefix: 'View access details for',
    },
    localPage: {
      introPrefix:
        'We welcome SME executives, entrepreneurs, and project sponsors by appointment.',
      proximityHeadingPrefix: 'Your local advisory office in',
      frequentMissionsPrefix: 'Mandates frequently conducted from',
      coordinatesHeadingPrefix: 'Contact details & reception —',
      addressLabel: 'Address',
      phonesLabel: 'Telephones',
      emailLabel: 'Email',
      receptionLabel: 'Reception hours',
      availableServicesKicker: 'Available Services',
      availableServicesHeadingPrefix: 'Services delivered by our office in',
      seeOtherOfficePrefix: 'Also view our office in',
      serviceDetailLink: 'Service details',
      bannerHeadingPrefix: 'Book an appointment in',
    },
    resourcesPage: {
      kicker: 'Publications & Methodological Guides',
      h1: 'Practical management, tax, and financing guides for executives in Cameroon',
      intro:
        'Our briefing notes synthesize best practices in accounting governance, DSF preparation, bankable business plans, and SME upgrading in Yaoundé and Douala.',
      readingLabel: 'Read',
      readArticle: 'Read guide',
      readingTimePrefix: 'Reading time',
      byAuthorPrefix: 'By',
      publishedOn: 'Published on',
      updatedOn: 'Updated on',
      regulatoryNoticeTitle: 'Regulatory notice:',
      regulatoryNoticeBody:
        'this methodological guide presents general management benchmarks. Specific tax, social security, and accounting provisions applicable to your company are governed by the official laws in force in the Republic of Cameroon (General Tax Code, annual Finance Laws published by the DGI, CNPS regulations, and OHADA Uniform Acts).',
      relatedPracticeKicker: 'Related Practice Area',
      otherPublicationsKicker: 'Other Publications',
    },
    contactPage: {
      kicker: 'Appointments & Inquiries',
      h1: 'Schedule a consultation with LM Consulting in Yaoundé or Douala',
      intro:
        'Share your requirements in strict confidence. You can also reach our team directly by phone or via WhatsApp to arrange a rapid slot.',
      callBtnPrefix: 'Call ·',
      whatsappBtn: 'Message on WhatsApp',
      formHeading: 'Consultation Request Form',
      requiredNote:
        'Fields marked with an asterisk (*) are required to process your inquiry.',
      successTitle: 'Inquiry registered',
      errorTitle: 'Verification required',
      fullNameLabel: 'Full name *',
      fullNamePlaceholder: 'e.g. Jean-Marc Nkoa',
      companyLabel: 'Company or project',
      companyPlaceholder: 'Company name or project in formation',
      emailLabel: 'Business email *',
      emailPlaceholder: 'management@company.cm',
      phoneLabel: 'Phone number (Cameroon or international) *',
      phonePlaceholder: '+237 6XX XXX XXX',
      serviceLabel: 'Relevant practice area *',
      otherServiceOption: 'Other inquiry / Executive seminar',
      officeLabel: 'Preferred office',
      officeYaounde: 'Yaoundé — ADJAL Building, Warda',
      officeDouala: 'Douala — ONCPB Building, Bonanjo',
      officeOther: 'Other city / Remote consultation',
      messageLabel: 'Context and objective of your request *',
      messagePlaceholder:
        'Briefly describe your activity, any upcoming deadlines (DSF, tax regularization, bank credit file, incorporation), and your expectations.',
      submitIdle: 'Send inquiry',
      submitBusy: 'Sending…',
      privacyGuarantee: 'Strict confidentiality guaranteed ·',
      generalCoordinatesKicker: 'General Contact Details',
      phoneLinesLabel: 'Telephone lines',
      emailAddressLabel: 'Email address',
      socialNetworksLabel: 'Professional channels',
      facebookPagePrefix: 'Facebook Page ·',
      localPagePrefix: 'Local office:',
    },
    customerService: {
      triggerLabel: 'Client Support',
      triggerAria: 'Open LM Consulting Client Support desk',
      closeAria: 'Close Client Support window',
      badge: 'Client Support · LM Consulting',
      heading: 'How can we assist you today?',
      subtitle:
        'Direct assistance from our advisory teams in Yaoundé (Warda) and Douala (Bonanjo).',
      tabChannels: 'Direct Channels',
      tabCallback: 'Quick Callback',
      whatsappTitle: 'Direct WhatsApp Chat',
      whatsappDesc: 'Fast response for urgent questions (DSF, tax compliance, appointments).',
      whatsappCta: 'Chat on WhatsApp',
      whatsappPrefill:
        'Hello LM Consulting, I would like to speak with your client support team regarding my company.',
      callYaoundeTitle: 'Direct Line & Executive Desk',
      callSecondaryTitle: 'Front Desk & File Follow-Up',
      emailDirectTitle: 'Send a direct email',
      officesHoursNote: 'Monday – Friday · Yaoundé (Warda) & Douala (Bonanjo)',
      quickFormIntro:
        'Leave your contact details and question: a senior consultant will call you back promptly.',
      namePlaceholder: 'Your full name *',
      phonePlaceholder: 'Your phone number *',
      emailPlaceholder: 'Your business email *',
      messagePlaceholder: 'Your request (e.g. DSF filing, incorporation, financing…) *',
      sendQuickBtn: 'Request a prompt callback',
      sendingQuickBtn: 'Sending…',
      quickSuccess:
        'Thank you! Your request has been forwarded to the LM Consulting support desk.',
      fullContactLink: 'Open full Contact page form',
    },
    notFound: {
      kicker: 'Error 404 · Page not found',
      h1: 'This address does not match any active page of the firm.',
      body: 'The requested document may have moved or its link contains a typo. You can return to the home page, browse our advisory practices, or contact our offices.',
      backHome: 'Return to home page',
      browseServices: 'Browse our services',
      contactOffices: 'Contact our offices',
    },
    newsletterSection: {
      kicker: 'Corporate Finance & Tax Briefing',
      heading: 'Receive practical updates on corporate finance, DSF, and OHADA taxation',
      subtitle:
        'A concise monthly briefing prepared by firm leadership to anticipate tax deadlines and banking requirements.',
      emailLabel: 'Your business email address',
      emailPlaceholder: 'management@company.cm',
      subscribeLabel: 'Subscribe',
      submittingLabel: 'Subscribing…',
      invalidEmail: 'Please enter a valid business email address.',
      successTitle: 'Subscription confirmed',
      successMessage:
        'Thank you. Your email has been registered for LM CONSULTING corporate finance news.',
      alreadySubscribed: 'This email address is already subscribed to our briefing.',
      errorFallback: 'Unable to process your subscription right now.',
      privacyNote: 'Unsubscribe anytime ·',
    },
  },
} as const;

interface I18nContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
  ui: (typeof uiDictionary)['fr'];
  cabinet: typeof cabinetFr;
  servicesSection: typeof servicesSectionFr;
  services: ServiceItem[];
  faqData: typeof faqFr;
  implantationsData: typeof implantationsFr;
  legalData: typeof legalFr;
  resources: ParsedMdxArticle[];
  testimonials: TestimonialItem[];
  getServiceBySlug: (slug: string) => ServiceItem | undefined;
  getRelatedServices: (slugs: string[]) => ServiceItem[];
  getOfficeBySlug: (slug: 'yaounde' | 'douala') => OfficeItem;
  getResourceBySlug: (slug: string) => ParsedMdxArticle | undefined;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  initialLocale = 'fr',
  children,
}: {
  initialLocale?: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const queryLang = params.get('lang');
      if (queryLang === 'en' || queryLang === 'fr') {
        setLocaleState(queryLang);
        window.localStorage.setItem(STORAGE_KEY, queryLang);
        document.documentElement.lang = queryLang;
        return;
      }
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'fr') {
        setLocaleState(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      // Stockage local indisponible
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignorer en cas de navigation privée stricte
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'fr' ? 'en' : 'fr');
  }, [locale, setLocale]);

  const value = useMemo<I18nContextValue>(() => {
    const activeFrServices = getActiveServicesFr();
    const localizedServices: ServiceItem[] =
      locale === 'fr'
        ? activeFrServices
        : activeFrServices.map((s) => ({
            ...s,
            ...(servicesEnMap[s.slug] ?? {}),
          }));

    const localizedResources = locale === 'fr' ? getAllResourcesFr() : resourcesEn;
    const localizedImplantations = locale === 'fr' ? implantationsFr : implantationsEn;

    return {
      locale,
      setLocale,
      toggleLocale,
      ui: uiDictionary[locale] as unknown as (typeof uiDictionary)['fr'],
      cabinet: locale === 'fr' ? cabinetFr : cabinetEn,
      servicesSection: locale === 'fr' ? servicesSectionFr : servicesSectionEn,
      services: localizedServices,
      faqData: locale === 'fr' ? faqFr : faqEn,
      implantationsData: localizedImplantations,
      legalData: locale === 'fr' ? legalFr : legalEn,
      resources: localizedResources,
      testimonials: locale === 'fr' ? testimonialsFr : testimonialsEn,
      getServiceBySlug: (slug: string) =>
        localizedServices.find((item) => item.slug === slug),
      getRelatedServices: (slugs: string[]) =>
        slugs
          .map((slug) => localizedServices.find((item) => item.slug === slug))
          .filter((item): item is ServiceItem => Boolean(item)),
      getOfficeBySlug: (slug: 'yaounde' | 'douala') =>
        localizedImplantations.offices.find((o) => o.slug === slug) ??
        localizedImplantations.offices[0],
      getResourceBySlug: (slug: string) =>
        localizedResources.find((r) => r.frontmatter.slug === slug),
    };
  }, [locale, setLocale, toggleLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
