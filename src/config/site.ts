export const siteConfig = {
  name: "JSON Flattener",
  title: "JSON Flattener — Flatten & Unflatten Nested JSON Online",
  description:
    "Free online JSON flattener. Instantly flatten deeply nested JSON into dot-notation keys or unflatten dot-notation keys back to nested JSON. Supports custom delimiters, bracket notation, and one-click copy.",
  url: "https://json-flattener.tools.jagodana.com",
  ogImage: "/opengraph-image",

  headerIcon: "Layers",
  brandAccentColor: "#6366f1",

  keywords: [
    "json flattener",
    "flatten json",
    "unflatten json",
    "nested json to flat json",
    "dot notation json",
    "json converter online",
    "flatten json object",
    "json path converter",
    "json tools online",
    "developer tools",
  ],
  applicationCategory: "DeveloperApplication",

  themeColor: "#3b82f6",

  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  socialProfiles: [
    "https://twitter.com/jagodana",
  ],

  links: {
    github: "https://github.com/Jagodana-Studio-Private-Limited/json-flattener",
    website: "https://jagodana.com",
  },

  footer: {
    about:
      "JSON Flattener is a free browser-based tool that transforms deeply nested JSON structures into flat key-value pairs using dot notation, and back again. No data leaves your browser.",
    featuresTitle: "Features",
    features: [
      "Flatten nested JSON instantly",
      "Unflatten dot-notation keys",
      "Custom delimiter support",
      "One-click copy to clipboard",
    ],
  },

  hero: {
    badge: "Free JSON Utility",
    titleLine1: "Flatten & Unflatten",
    titleGradient: "JSON in Seconds",
    subtitle:
      "Transform deeply nested JSON objects into flat dot-notation key-value pairs — or reverse the process. Perfect for config files, API responses, and form data. 100% client-side, no data leaves your browser.",
  },

  featureCards: [
    {
      icon: "🗜️",
      title: "Instant Flattening",
      description:
        "Convert any nested JSON object into flat dot-notation keys in real time as you type.",
    },
    {
      icon: "🔁",
      title: "Bidirectional",
      description:
        "Flatten nested JSON or unflatten dot-notation keys back to nested objects with one click.",
    },
    {
      icon: "⚙️",
      title: "Custom Delimiter",
      description:
        "Choose your separator: dot (user.name), underscore (user_name), or any custom character.",
    },
  ],

  relatedTools: [
    {
      name: "JSON Formatter",
      url: "https://json-formatter.tools.jagodana.com",
      icon: "📄",
      description: "Prettify and minify JSON with syntax highlighting.",
    },
    {
      name: "JSON Diff Viewer",
      url: "https://json-diff-viewer.tools.jagodana.com",
      icon: "🔍",
      description: "Compare two JSON objects side-by-side.",
    },
    {
      name: "JSON to TypeScript",
      url: "https://json-to-typescript.tools.jagodana.com",
      icon: "📘",
      description: "Generate TypeScript interfaces from any JSON.",
    },
    {
      name: "JSON Schema Generator",
      url: "https://json-schema-generator.tools.jagodana.com",
      icon: "🧩",
      description: "Auto-generate JSON Schema from a JSON sample.",
    },
    {
      name: "JWT Decoder",
      url: "https://jwt-decoder.tools.jagodana.com",
      icon: "🔐",
      description: "Decode and inspect JWT tokens instantly.",
    },
    {
      name: "URL Encoder / Decoder",
      url: "https://url-encoder-decoder.tools.jagodana.com",
      icon: "🔗",
      description: "Encode or decode URL components in one click.",
    },
  ],

  howToSteps: [
    {
      name: "Paste your JSON",
      text: "Paste or type any nested JSON object into the input panel on the left.",
      url: "",
    },
    {
      name: "Choose flatten or unflatten",
      text: "Select Flatten to convert nested keys to dot-notation, or Unflatten to rebuild nested structure from flat keys.",
      url: "",
    },
    {
      name: "Copy the result",
      text: "Click the Copy button to copy the flattened or unflattened JSON to your clipboard.",
      url: "",
    },
  ],
  howToTotalTime: "PT30S",

  faq: [
    {
      question: "What does a JSON flattener do?",
      answer:
        "A JSON flattener converts a deeply nested JSON object into a single-level object where nested keys are combined using a delimiter (usually a dot). For example, {\"user\":{\"name\":\"Alice\"}} becomes {\"user.name\":\"Alice\"}. This is useful when working with configuration files, databases that store flat records, or APIs that expect flat query parameters.",
    },
    {
      question: "What is dot-notation JSON?",
      answer:
        "Dot-notation JSON is a flat representation of a nested JSON object where each nested key path is joined by dots. For example, the nested path user → address → city becomes the flat key \"user.address.city\". It is widely used in MongoDB queries, environment variable naming, and configuration systems.",
    },
    {
      question: "Can I unflatten JSON back to nested?",
      answer:
        "Yes. Switch to the Unflatten tab and paste flat dot-notation JSON. The tool will reconstruct the original nested structure. For example, {\"user.name\":\"Alice\",\"user.age\":30} becomes {\"user\":{\"name\":\"Alice\",\"age\":30}}.",
    },
    {
      question: "Can I change the delimiter used for flattening?",
      answer:
        "Yes. By default the tool uses a dot (.) as the delimiter, but you can change it to any character — underscore (_), slash (/), or anything else — using the Delimiter option above the output panel.",
    },
    {
      question: "Is my JSON data sent to a server?",
      answer:
        "No. All processing happens entirely in your browser using JavaScript. Your JSON never leaves your device, making this tool safe to use with sensitive configuration data or API responses.",
    },
    {
      question: "Does it handle arrays in nested JSON?",
      answer:
        "Yes. Arrays are flattened using bracket-style index keys. For example, {\"items\":[\"a\",\"b\"]} becomes {\"items[0]\":\"a\",\"items[1]\":\"b\"}. This keeps array indices unambiguous and easy to reconstruct.",
    },
  ],

  pages: {
    "/": {
      title: "JSON Flattener — Flatten & Unflatten Nested JSON Online",
      description:
        "Free online JSON flattener. Instantly flatten deeply nested JSON into dot-notation keys or unflatten flat keys back to nested JSON. 100% client-side.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
