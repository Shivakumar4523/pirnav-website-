import {
  Briefcase,
  Cloud,
  Database,
  LineChart,
  Monitor,
  Rocket,
  Server,
  Settings,
  ShieldCheck,
  Smartphone,
  Users,
  Workflow,
  Layers,
  Cpu,
  Landmark,
  Gauge,
} from "lucide-react";
import { products } from "./productsData";

export const company = {
  name: ["Pirnav", "Software Solutions"].join(" "),
  shortName: "Pirnav",
  phone: "040-35339312",
  email: "contact@pirnav.com",
  location: "Madhapur, Hyderabad, India",
  locations: ["Hyderabad", "Vijayawada", "Tirupathi", "Bangalore"],
  description:
    "Pirnav delivers enterprise software, cloud modernization, QA automation, and talent solutions for companies building at scale.",
};

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Careers", to: "/careers" },
  { label: "Contact", to: "/contact" },
];

const serviceImageMap = {
  "application-development":
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=2400&q=85",
  "testing-automation":
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2400&q=85",
  "maintainance-support":
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2400&q=85",
  "web-development": "/images/service.png",
  "mobile-app-development": "/images/app.jpg",
  "sap-solutions":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2400&q=85",
  "oracle-solutions":
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2400&q=85",
  "microsoft-solutions": "/images/hero9.png",
  cybersecurity:
    "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=2400&q=85",
  "ai-mlops":
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=2400&q=85",
  "data-science":
    "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=2400&q=85",
  "professional-services":
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2400&q=85",
};

const baseServiceItems = [
  {
    slug: "application-development",
    title: "Application Development",
    icon: Rocket,
    summary:
      "Custom product and platform engineering for enterprise workflows and customer-facing systems.",
    intro:
      "We design and build secure business applications with clean architecture, strong delivery governance, and long-term maintainability.",
    highlights: ["Product strategy", "Architecture design", "Full-cycle delivery"],
    features: [
      "Discovery, roadmap definition, and business workflow design",
      "Scalable web platforms and internal operations systems",
      "Delivery practices focused on security, reliability, and observability",
    ],
    outcomes: [
      "Shorter release cycles",
      "Lower engineering debt",
      "Better platform stability",
    ],
  },
  {
    slug: "testing-automation",
    title: "Testing / Automation",
    icon: ShieldCheck,
    summary:
      "Quality engineering that embeds automation into every release pipeline.",
    intro:
      "Our QA teams help product organizations release with confidence through scalable automation, regression coverage, and performance validation.",
    highlights: ["Automation suites", "Regression coverage", "Performance testing"],
    features: [
      "Test strategy across UI, API, data, and performance layers",
      "CI-ready automated suites for release confidence",
      "Quality dashboards and defect intelligence for engineering leaders",
    ],
    outcomes: [
      "Reduced production defects",
      "Faster validation cycles",
      "Higher release confidence",
    ],
  },
  {
    slug: "maintainance-support",
    title: "Maintenance & Support",
    icon: Settings,
    summary:
      "Ongoing support and optimization programs for critical applications and integrations.",
    intro:
      "We keep long-running enterprise systems healthy with structured support operations, proactive monitoring, and targeted enhancement work.",
    highlights: ["Support SLAs", "Monitoring", "Platform optimization"],
    features: [
      "L2 and L3 support for business-critical systems",
      "Performance tuning and issue triage workflows",
      "Enhancement backlogs managed alongside support operations",
    ],
    outcomes: ["Less downtime", "Faster incident response", "Stable operations"],
  },
  {
    slug: "web-development",
    title: "Web Development",
    icon: Monitor,
    summary:
      "Responsive web products designed for performance, usability, and enterprise integration.",
    intro:
      "We build modern websites and web applications that align design quality with real business workflows and measurable conversion goals.",
    highlights: ["Responsive UI", "Platform integration", "Conversion-focused UX"],
    features: [
      "Modern frontend development and design systems",
      "CMS, API, and enterprise platform integrations",
      "Performance-focused implementation across devices",
    ],
    outcomes: ["Stronger digital presence", "Better usability", "Scalable frontend systems"],
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    icon: Smartphone,
    summary:
      "Mobile products that connect users, operations, and backend platforms seamlessly.",
    intro:
      "Our mobile teams ship polished Android and iOS experiences backed by secure integrations, analytics, and maintainable release pipelines.",
    highlights: ["iOS and Android", "API-first architecture", "UX optimization"],
    features: [
      "Cross-platform and native mobile delivery options",
      "Mobile backend integration and authentication flows",
      "Analytics instrumentation and lifecycle support",
    ],
    outcomes: ["Higher user adoption", "Reliable mobile releases", "Consistent UX"],
  },
  {
    slug: "sap-solutions",
    title: "SAP Solutions",
    icon: Database,
    summary:
      "SAP implementation, customization, and support services for enterprise operations.",
    intro:
      "We help organizations streamline finance, HR, and supply chain workflows through SAP programs that stay grounded in operational outcomes.",
    highlights: ["Implementation", "Customization", "Operational alignment"],
    features: [
      "SAP rollout planning and module enhancements",
      "Business process analysis and system optimization",
      "Integration support across enterprise environments",
    ],
    outcomes: ["Improved efficiency", "Stronger process consistency", "Better system adoption"],
  },
  {
    slug: "oracle-solutions",
    title: "Oracle Solutions",
    icon: Server,
    summary:
      "Oracle services spanning database platforms, enterprise applications, and modernization work.",
    intro:
      "Our Oracle specialists support implementation, administration, and transformation initiatives that require both operational rigor and delivery speed.",
    highlights: ["Enterprise systems", "Database expertise", "Cloud readiness"],
    features: [
      "Oracle application support and enhancement",
      "Database performance, governance, and reliability improvements",
      "Migration planning and modernization execution",
    ],
    outcomes: ["Better data performance", "Lower operational risk", "Modernized platforms"],
  },
  {
    slug: "microsoft-solutions",
    title: "Microsoft Solutions",
    icon: Cloud,
    summary:
      "Microsoft ecosystem delivery for cloud, collaboration, productivity, and operations.",
    intro:
      "We help teams modernize around Microsoft platforms with Azure-driven infrastructure, collaboration tooling, and integrated delivery support.",
    highlights: ["Azure", "Collaboration", "Enterprise modernization"],
    features: [
      "Azure cloud architecture and migration support",
      "Productivity and collaboration solution delivery",
      "Integrated support across Microsoft business platforms",
    ],
    outcomes: ["Cloud maturity", "Improved collaboration", "Operational consistency"],
  },
  {
    slug: "cybersecurity",
    title: "Cybersecurity",
    icon: ShieldCheck,
    summary:
      "Security programs that protect applications, cloud workloads, identities, and enterprise operations.",
    intro:
      "We help organizations strengthen security posture with practical controls, monitoring, and remediation programs aligned to platform risk and delivery speed.",
    highlights: ["Security posture", "Identity protection", "Continuous monitoring"],
    features: [
      "Application, cloud, and infrastructure security assessments",
      "Identity, access, and endpoint protection planning",
      "Threat monitoring, remediation support, and governance improvements",
    ],
    outcomes: ["Reduced exposure", "Stronger compliance readiness", "Better operational resilience"],
  },
  {
    slug: "ai-mlops",
    title: "AI / MLOps",
    icon: Cpu,
    summary:
      "AI enablement and MLOps foundations for model deployment, observability, and governed scale.",
    intro:
      "We help teams move from experimentation to production with data pipelines, model operations, and platform practices that support reliable AI delivery.",
    highlights: ["Model operations", "AI pipelines", "Responsible scaling"],
    features: [
      "MLOps workflows for training, deployment, and monitoring",
      "Feature, inference, and evaluation pipeline design",
      "Governance patterns for reliability, cost control, and traceability",
    ],
    outcomes: ["Faster model delivery", "Higher AI reliability", "Better operational control"],
  },
  {
    slug: "data-science",
    title: "Data Science",
    icon: LineChart,
    summary:
      "Data science services that turn complex datasets into decision-ready insights and predictive models.",
    intro:
      "Our teams support analytics, forecasting, experimentation, and insight generation programs that help organizations make better product and operational decisions.",
    highlights: ["Predictive analytics", "Insight models", "Decision support"],
    features: [
      "Exploratory analysis and business insight modeling",
      "Forecasting, experimentation, and statistical evaluation",
      "Data storytelling aligned to operational and leadership decisions",
    ],
    outcomes: ["Clearer decisions", "Better forecasting accuracy", "More actionable insights"],
  },
  {
    slug: "professional-services",
    title: "Professional Services",
    icon: Briefcase,
    summary:
      "Technology consulting and staffing models structured around business delivery needs.",
    intro:
      "From niche engineering talent to leadership hiring, we help organizations scale teams, fill capability gaps, and deliver faster.",
    highlights: ["Staff augmentation", "Leadership hiring", "Flexible engagement models"],
    features: [
      "On-demand engineering and consulting talent",
      "Leadership hiring, RPO, and staffing support",
      "Engagement models aligned to long-term and short-term goals",
    ],
    outcomes: ["Faster hiring", "Delivery flexibility", "Stronger execution capacity"],
  },
];

const serviceDetails = {
  "application-development": {
    heroTitle: "Application Development Services",
    overview:
      "Design, build, and modernize secure business applications with architectures that support scale, integration, and long-term maintainability.",
    capabilities: [
      "Application architecture and platform design",
      "Cloud-native product engineering",
      "API design and systems integration",
      "Microservices and modular application delivery",
      "DevOps-enabled release management",
    ],
    benefits: [
      "Faster product delivery cycles",
      "Scalable application foundations",
      "Improved reliability and maintainability",
      "Lower long-term engineering debt",
    ],
    technologies: ["React", "Node.js", "Java", "Python", "AWS", "Azure", "Docker", "Kubernetes"],
    ctaTitle: "Ready to build scalable software platforms?",
  },
  "testing-automation": {
    heroTitle: "Testing and Automation Services",
    overview:
      "Embed quality engineering into delivery pipelines with automation frameworks, regression coverage, and performance validation aligned to release speed.",
    capabilities: [
      "UI, API, and integration test automation",
      "Performance and reliability testing",
      "Continuous testing in CI/CD pipelines",
      "Quality dashboards and defect analytics",
      "Release readiness governance",
    ],
    benefits: [
      "Higher release confidence",
      "Reduced production defects",
      "Faster validation cycles",
      "Better engineering visibility",
    ],
    technologies: ["Selenium", "Cypress", "Playwright", "Postman", "JMeter", "JUnit", "Azure DevOps", "GitHub Actions"],
    ctaTitle: "Ready to improve software quality at scale?",
  },
  "maintainance-support": {
    heroTitle: "Maintenance and Support Services",
    overview:
      "Keep critical applications stable with structured support operations, proactive monitoring, and enhancement programs built around service reliability.",
    capabilities: [
      "L2 and L3 application support",
      "Monitoring and incident management",
      "Performance tuning and optimization",
      "Enhancement backlog execution",
      "Operational reporting and SLA tracking",
    ],
    benefits: [
      "Less downtime for core platforms",
      "Faster incident resolution",
      "Stable business operations",
      "Improved support accountability",
    ],
    technologies: ["ServiceNow", "Splunk", "Azure Monitor", "Datadog", "SQL Server", "Oracle", "Linux", "Windows Server"],
    ctaTitle: "Need dependable support for business-critical systems?",
  },
  "web-development": {
    heroTitle: "Web Development Services",
    overview:
      "Create responsive digital products and enterprise web platforms with modern frontend architecture, strong UX, and scalable integrations.",
    capabilities: [
      "Frontend architecture and design systems",
      "Responsive enterprise web application development",
      "CMS and API integrations",
      "Performance optimization across devices",
      "Accessibility and usability improvements",
    ],
    benefits: [
      "Stronger digital user experiences",
      "Better frontend performance",
      "Scalable web platform foundations",
      "Improved conversion and usability",
    ],
    technologies: ["React", "TypeScript", "Next.js", "Node.js", "REST APIs", "GraphQL", "Figma", "Vite"],
    ctaTitle: "Ready to launch a stronger digital platform?",
  },
  "mobile-app-development": {
    heroTitle: "Mobile App Development Services",
    overview:
      "Build polished mobile experiences that connect users, business operations, and backend systems through secure, API-first product delivery.",
    capabilities: [
      "Cross-platform and native mobile delivery",
      "Mobile backend and authentication integration",
      "Analytics and performance instrumentation",
      "App lifecycle support and enhancement",
      "UX optimization for mobile workflows",
    ],
    benefits: [
      "Higher user adoption",
      "Reliable mobile release pipelines",
      "Consistent cross-platform experiences",
      "Improved operational connectivity",
    ],
    technologies: ["React Native", "Flutter", "iOS", "Android", "Firebase", "Node.js", "REST APIs", "App Center"],
    ctaTitle: "Ready to build high-quality mobile experiences?",
  },
  "sap-solutions": {
    heroTitle: "SAP Solutions Services",
    overview:
      "Support enterprise operations with SAP implementation, enhancement, and integration services grounded in process efficiency and business alignment.",
    capabilities: [
      "SAP implementation and rollout support",
      "Module customization and enhancement",
      "Process analysis and optimization",
      "Enterprise integration planning",
      "Operational support and ongoing improvement",
    ],
    benefits: [
      "Improved business process consistency",
      "Better enterprise system adoption",
      "Operational efficiency gains",
      "Lower implementation risk",
    ],
    technologies: ["SAP S/4HANA", "SAP Fiori", "ABAP", "SAP SuccessFactors", "SAP Basis", "Integration Suite", "SQL", "Power BI"],
    ctaTitle: "Ready to modernize enterprise workflows with SAP?",
  },
  "oracle-solutions": {
    heroTitle: "Oracle Solutions Services",
    overview:
      "Modernize Oracle platforms with services spanning enterprise applications, databases, performance optimization, and transformation planning.",
    capabilities: [
      "Oracle application support and enhancement",
      "Database administration and performance tuning",
      "Modernization and migration planning",
      "Governance and reliability improvements",
      "Integration across enterprise systems",
    ],
    benefits: [
      "Better data performance",
      "Lower operational risk",
      "Improved system reliability",
      "Clearer modernization roadmaps",
    ],
    technologies: ["Oracle Database", "PL/SQL", "Oracle Cloud", "Oracle EBS", "Java", "Linux", "ETL", "Monitoring Tools"],
    ctaTitle: "Ready to strengthen Oracle platforms and operations?",
  },
  "microsoft-solutions": {
    heroTitle: "Microsoft Solutions Services",
    overview:
      "Deliver Microsoft ecosystem solutions across cloud, collaboration, productivity, and enterprise modernization initiatives.",
    capabilities: [
      "Azure architecture and migration support",
      "Collaboration and productivity solutions",
      "Integration across Microsoft business platforms",
      "Cloud operations and governance",
      "Platform modernization programs",
    ],
    benefits: [
      "Improved cloud maturity",
      "Stronger collaboration across teams",
      "Operational consistency",
      "Better platform scalability",
    ],
    technologies: ["Azure", "Microsoft 365", "Power Platform", "Dynamics 365", "SharePoint", "Active Directory", "Teams", "DevOps"],
    ctaTitle: "Ready to accelerate Microsoft-led modernization?",
  },
  cybersecurity: {
    heroTitle: "Cybersecurity Services",
    overview:
      "Protect critical platforms with cybersecurity services that strengthen applications, cloud environments, identities, and operational controls.",
    capabilities: [
      "Security posture assessments and remediation planning",
      "Identity, access, and endpoint security design",
      "Threat monitoring and incident response support",
      "Cloud security controls and governance",
      "Policy alignment for audit and compliance readiness",
    ],
    benefits: [
      "Reduced operational security risk",
      "Stronger protection across platforms",
      "Improved compliance preparedness",
      "Better visibility into vulnerabilities and threats",
    ],
    technologies: ["Microsoft Defender", "CrowdStrike", "Okta", "AWS Security Hub", "Azure Sentinel", "Splunk", "SIEM", "IAM"],
    ctaTitle: "Ready to strengthen enterprise security posture?",
  },
  "ai-mlops": {
    heroTitle: "AI and MLOps Services",
    overview:
      "Operationalize AI initiatives with MLOps practices that support scalable deployment, monitoring, governance, and measurable business impact.",
    capabilities: [
      "Model training, deployment, and release workflows",
      "Feature engineering and inference pipeline design",
      "Monitoring for drift, performance, and reliability",
      "Governance for reproducibility and responsible AI delivery",
      "Platform integration across data and cloud environments",
    ],
    benefits: [
      "Faster transition from pilot to production",
      "Higher confidence in model performance",
      "Better observability and governance",
      "More scalable AI delivery operations",
    ],
    technologies: ["Python", "MLflow", "Kubeflow", "Docker", "Kubernetes", "Databricks", "AWS SageMaker", "Azure ML"],
    ctaTitle: "Ready to operationalize AI at enterprise scale?",
  },
  "data-science": {
    heroTitle: "Data Science Services",
    overview:
      "Use data science to uncover insights, improve forecasting, and build analytical models that support product, operational, and business decisions.",
    capabilities: [
      "Exploratory data analysis and pattern discovery",
      "Forecasting, experimentation, and statistical modeling",
      "Predictive modeling for business and product use cases",
      "Data storytelling and decision-support dashboards",
      "Analytical frameworks aligned to operational KPIs",
    ],
    benefits: [
      "More actionable business insight",
      "Improved planning and forecasting quality",
      "Stronger decision support for leaders",
      "Better use of enterprise data assets",
    ],
    technologies: ["Python", "Pandas", "NumPy", "scikit-learn", "Jupyter", "SQL", "Power BI", "Tableau"],
    ctaTitle: "Ready to turn enterprise data into insight?",
  },
  "professional-services": {
    heroTitle: "Professional Services",
    overview:
      "Scale execution with consulting, staff augmentation, and leadership hiring models aligned to enterprise delivery needs and growth priorities.",
    capabilities: [
      "Technology consulting and advisory support",
      "Staff augmentation for delivery programs",
      "Leadership hiring and talent solutions",
      "Flexible engagement models",
      "Capability planning around business demand",
    ],
    benefits: [
      "Faster access to specialized talent",
      "Greater delivery flexibility",
      "Improved execution capacity",
      "Better alignment between teams and priorities",
    ],
    technologies: ["React", "Java", "Python", "AWS", "Azure", "SAP", "Oracle", "Data Platforms"],
    ctaTitle: "Need consulting and delivery capacity quickly?",
  },
};

export const serviceItems = baseServiceItems.map((service) => ({
  ...service,
  image: serviceImageMap[service.slug],
  ...serviceDetails[service.slug],
}));

export const homeStats = [
  { value: "10+", label: "Service Lines" },
  { value: "100+", label: "Client Engagements" },
  { value: "10+", label: "Locations" },
  { value: "50+", label: "Projects Delivered" },
];

export const featureItems = [
  {
    title: "Enterprise-grade execution",
    description:
      "Strong delivery processes, technical depth, and predictable communication across every phase.",
    icon: Workflow,
  },
  {
    title: "Cross-functional teams",
    description:
      "Engineering, QA, cloud, and staffing support coordinated as one operating model.",
    icon: Layers,
  },
  {
    title: "Scalable architecture",
    description:
      "Solutions designed to evolve with business growth, performance demands, and security expectations.",
    icon: Cpu,
  },
  {
    title: "Business-aligned consulting",
    description:
      "Technology recommendations grounded in outcomes, budget discipline, and operational fit.",
    icon: Landmark,
  },
];

export const aboutPillars = [
  {
    title: "Innovation-first delivery",
    description: "Creative, technology-led solutions with practical implementation plans.",
    icon: Rocket,
  },
  {
    title: "Research-backed planning",
    description: "Clear discovery, analysis, and roadmap thinking before heavy execution begins.",
    icon: LineChart,
  },
  {
    title: "Experienced teams",
    description: "Delivery talent that blends technical competence with professional accountability.",
    icon: Users,
  },
  {
    title: "Cloud & Platform Expertise",
    description:
      "Deep experience designing scalable cloud architectures and modern platforms for enterprise applications.",
    icon: Cloud,
  },
];

export const testimonials = [
  {
    quote:
      "Pirnav integrated into our delivery process quickly and improved both release stability and communication quality.",
    name: "Delivery Lead",
    role: "Global Retail Technology Team",
  },
  {
    quote:
      "The team brought structure to cloud modernization work without slowing the business down.",
    name: "Program Manager",
    role: "Enterprise Infrastructure Program",
  },
  {
    quote:
      "They combined staffing flexibility with a strong engineering mindset, which is rare and valuable.",
    name: "Operations Director",
    role: "Digital Services Company",
  },
];

export const whyJoinUs = [
  {
    title: "Career growth",
    description: "Real delivery programs, new technologies, and visible ownership from early stages.",
    icon: Rocket,
  },
  {
    title: "Collaborative culture",
    description: "Direct access to experienced peers, shared problem-solving, and strong team support.",
    icon: Users,
  },
  {
    title: "Meaningful projects",
    description: "Work on products and enterprise programs that affect business-critical operations.",
    icon: Gauge,
  },
  {
    title: "Balanced environment",
    description: "A delivery culture that values sustainable execution over unnecessary chaos.",
    icon: Briefcase,
  },
];

export const productCatalog = products;

export const footerSections = {
  company: [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Services", to: "/services" },
  ],
  services: serviceItems.slice(0, 6).map((service) => ({
    label: service.title,
    to: `/services/${service.slug}`,
  })),
  resources: [
    { label: "Careers", to: "/careers" },
    { label: "Contact", to: "/contact" },
    { label: "About Us", to: "/about" },
  ],
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com" },
    { label: "Facebook", href: "https://www.facebook.com" },
  ],
};
