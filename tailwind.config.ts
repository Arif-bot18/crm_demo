import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          light: "#EFF6FF",
          dark: "#1E40AF",
        },
        navy: {
          950: "#0B0F19",
          900: "#111827",
          850: "#161F33",
          800: "#1F2937",
          700: "#374151",
          muted: "#94A3B8",
        },
        workspace: "#F8FAFC",
        surface: "#FFFFFF",
        border: {
          subtle: "#E2E8F0",
          strong: "#CBD5E1",
        },
        text: {
          primary: "#0F172A",
          secondary: "#64748B",
          muted: "#94A3B8",
        },
        status: {
          success: {
            DEFAULT: "#16A34A",
            light: "#F0FDF4",
            border: "#BBF7D0",
          },
          warning: {
            DEFAULT: "#D97706",
            light: "#FFFBEB",
            border: "#FDE68A",
          },
          error: {
            DEFAULT: "#DC2626",
            light: "#FEF2F2",
            border: "#FECACA",
          },
          info: {
            DEFAULT: "#0284C7",
            light: "#F0F9FF",
            border: "#BAE6FD",
          },
        },
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        elevated: "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        crm: "0.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
