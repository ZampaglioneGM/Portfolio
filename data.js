/*
 * Portfolio data for the Animus-style neural map.
 * Coordinates are in the SVG viewBox space (0..1400 x, 0..900 y).
 * `type: "core"` is the central identity node; the rest are memory nodes.
 */
const PORTFOLIO = {
  profile: {
    name: "GASTON ZAMPAGLIONE",
    title: "QA AUTOMATION ENGINEER / SDET",
    subject: "GASTON ZAMPAGLIONE",
    tagline: "Testing high-stakes systems across finance, judicial, e-commerce, and AI product domains.",
  },

  nodes: [
    {
      id: "core",
      type: "core",
      x: 700,
      y: 450,
      role: "QA Automation Engineer / SDET",
      company: "Gaston Zampaglione",
      period: "2020 — PRESENT",
      location: "Cordoba, Argentina",
      summary:
        "I'm a Senior QA Automation Engineer / SDET with 6+ years building end to end test coverage for products where correctness actually matters, finance, judicial systems, e commerce, and AI powered tools.\n\n" +
        "My core stack is Playwright, Cypress.io, TypeScript, and Java with JUnit 5, plus BDD/Gherkin, SQL, and solid CI/CD experience through GitHub Actions. Right now most of my work sits at the intersection of QA and AI. I use GitHub Copilot and Claude to design end to end testing suites and strategies faster, and I test AI assisted and LLM powered features themselves, which means validating correctness, edge cases, and failure modes in systems where outputs are probabilistic rather than deterministic.\n\n" +
        "Day to day I move between manual, exploratory, and automated testing depending on what a feature actually needs, track quality through tools like TestRail, Datadog, Elastic, and Splunk, and work closely with engineers and product to make sure \"done\" actually means something.\n\n" +
        "I've done this across identity platforms, court case management systems, wealth management tools, and now AI native products, so I'm comfortable dropping into complex, regulated, or high stakes domains and figuring out fast where the real risk lives.\n\n" +
        "Open to QA/SDET roles where quality is treated as a product responsibility, not an afterthought.",
      tags: ["Playwright", "TypeScript", "CI/CD", "AI-Assisted Testing", "Manual Testing", "Test Case Design", "Test Planning"],
    },
    {
      id: "n1",
      x: 340,
      y: 200,
      role: "QA Automation Engineer",
      company: "MajorKey Technologies (Atria Wealth Solutions)",
      nodeLabel: "MajorKey Technologies",
      period: "Sep 2021 — Sep 2023",
      location: "Remote",
      summary:
        "Built and maintained the automated test suite for a financial-services client; authored new test cases and technical documentation with flowcharts. Executed regression testing in Cypress.io.",
      tags: ["Cypress.io", "Regression Testing", "Documentation"],
    },
    {
      id: "n2",
      x: 300,
      y: 500,
      role: "QA Engineer, QA Automation",
      company: "GoJiraf",
      period: "Sep 2020 — Jul 2022",
      location: "Remote",
      summary:
        "Ran manual and automated testing across frontend, API, and backend layers using Cypress, Postman, JMeter, AWS, and Appium. Executed smoke, sanity, regression, stress, performance, and load testing, tracking issues through resolution.",
      tags: ["Cypress", "Postman", "JMeter", "AWS", "Appium", "Manual Testing", "Test Case Design", "Test Planning"],
    },
    {
      id: "n3",
      x: 430,
      y: 730,
      role: "Systems Engineering, Informatics",
      company: "Universidad Tecnologica Nacional",
      period: "2017 — 2020",
      location: "Cordoba, Argentina",
      summary:
        "Completed a degree in Systems Engineering, Informatics — the foundation for a career in software quality and test automation. Followed up with a Cypress course (Udemy, 2020) heading into the first QA role.",
      tags: ["Systems Engineering", "Education"],
    },
    {
      id: "n4",
      x: 700,
      y: 150,
      role: "QA Engineer, QA Automation",
      company: "IncluIT — Texas Office of Court Administration",
      nodeLabel: "IncluIT",
      period: "Jan 2022 — Jul 2023",
      location: "Remote",
      summary:
        "Supported the refactor of the UCMS (Universal Case Management System) using Cypress.io with BDD/Gherkin/Cucumber. Managed two QA squads and designed test cases and scenarios for a judicial case-management platform.",
      tags: ["Cypress.io", "BDD/Gherkin", "Cucumber", "Leadership", "Manual Testing", "Test Case Design", "Test Planning"],
    },
    {
      id: "n5",
      x: 1010,
      y: 230,
      role: "QA Automation / SDET",
      company: "Nauto",
      period: "Jan 2023 — Jul 2026",
      location: "Remote",
      summary:
        "Developed and maintained QA automation suites using Cypress.io and Playwright with TypeScript. Built CI/CD test automation workflows in GitHub Actions.",
      tags: ["Cypress.io", "Playwright", "TypeScript", "GitHub Actions"],
    },
    {
      id: "n6",
      x: 1090,
      y: 540,
      role: "Senior QA Engineer",
      company: "Blizzard Entertainment",
      period: "Apr 2023 — PRESENT",
      location: "Remote",
      summary:
        "Built and maintained E2E automated suites for Identity applications using Playwright with Java and JUnit 5. Manually and automatically tested features affecting thousands of players across Desktop, Mobile, and Console, including hands-on manual testing of login services and account flows. Applied GitHub Copilot and Claude AI to speed up test authoring and maintenance. Tracked system health and test execution via Elastic (Kibana/Grafana) and Splunk; managed test case intake in TestRail.",
      tags: ["Playwright", "Java", "JUnit 5", "Cross-Platform", "Elastic", "TestRail", "Manual Testing", "Test Case Design", "Test Planning"],
    },
    {
      id: "n7",
      x: 960,
      y: 740,
      role: "Senior QA Engineer",
      company: "ReflexAI",
      period: "Dec 2023 — PRESENT",
      location: "Remote",
      summary:
        "Designed and maintained E2E automated test suites in Playwright/TypeScript for AI-facing products, including testing of AI-generated simulations and an administrative dashboard surfacing data across all simulation runs. Used GitHub Copilot and Claude AI to generate test cases and expand coverage, and built CI/CD pipelines in GitHub Actions. Monitored test and application health in Datadog; validated data integrity via queries against MongoDB Atlas.",
      tags: ["Playwright", "TypeScript", "AI Simulations", "Datadog", "MongoDB Atlas", "Manual Testing", "Test Case Design", "Test Planning"],
    },
  ],

  // Synaptic connections. Each pair is [fromId, toId].
  edges: [
    ["core", "n1"],
    ["core", "n2"],
    ["core", "n3"],
    ["core", "n4"],
    ["core", "n5"],
    ["core", "n6"],
    ["core", "n7"],
    ["n1", "n2"],
    ["n2", "n3"],
    ["n1", "n4"],
    ["n4", "n5"],
    ["n5", "n6"],
    ["n6", "n7"],
  ],
};
