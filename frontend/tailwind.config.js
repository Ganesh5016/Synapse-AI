/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F8FC",
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#F0F3FA",
          subtle: "#F9FAFD",
        },
        primary: {
          DEFAULT: "#7667F5",
          hover: "#6656E6",
          light: "#EAE7FD",
          text: "#20243A",
        },
        accent: {
          DEFAULT: "#9B8AFB",
          hover: "#8774F8",
          light: "#F2EFFF",
        },
        muted: {
          DEFAULT: "#69728A",
          light: "#8F98B0",
          border: "rgba(113, 122, 160, 0.16)",
          hover: "rgba(113, 122, 160, 0.08)",
        },
        success: {
          DEFAULT: "#229B72",
          light: "#E3F7EF",
        },
        warning: {
          DEFAULT: "#D99A32",
          light: "#FCF4E6",
        },
        error: {
          DEFAULT: "#D9536B",
          light: "#FDECEF",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(118, 103, 245, 0.07)",
        "glass-sm": "0 4px 16px 0 rgba(118, 103, 245, 0.05)",
        "glass-lg": "0 16px 48px 0 rgba(118, 103, 245, 0.12)",
        "glass-card": "0 10px 30px -10px rgba(113, 122, 160, 0.12)",
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      backdropBlur: {
        xs: "2px",
        glass: "16px",
        panel: "20px",
      },
    },
  },
  plugins: [],
}
