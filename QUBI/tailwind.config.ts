import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        'dga-primary': {
          25: '#F7FDF9', 50: '#F3FCF6', 100: '#DFF6E7', 200: '#B8EACB',
          300: '#88D8AD', 400: '#54C08A', 500: '#25935F', 600: '#1B8354',
          700: '#166A45', 800: '#14573A', 900: '#104631', 950: '#092A1E',
        },
        'dga-gray': {
          25: '#FCFCFD', 50: '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB',
          300: '#D2D6DB', 400: '#9DA4AE', 500: '#6C737F', 600: '#4D5761',
          700: '#384250', 800: '#1F2A37', 900: '#111927', 950: '#0D121C',
        },
        'dga-gold': {
          25: '#FFFEF7', 50: '#FFFEF2', 100: '#FFFCE6', 200: '#FCF3BD',
          300: '#FAE996', 400: '#F7D54D', 500: '#F5BD02', 600: '#DBA102',
          700: '#B87B02', 800: '#945C01', 900: '#6E3C00', 950: '#472400',
        },
        'dga-lavender': {
          25: '#FEFCFF', 50: '#F9F5FA', 100: '#F2E9F5', 200: '#E1CCE8',
          300: '#CCADD9', 400: '#A57BBA', 500: '#80519F', 600: '#6D428F',
          700: '#532D75', 800: '#3D1D5E', 900: '#281047', 950: '#16072E',
        },
        'dga-error': {
          25: '#FFFBFA', 50: '#FEF3F2', 100: '#FEE4E2', 200: '#FECDCA',
          300: '#FDA29B', 400: '#F97066', 500: '#F04438', 600: '#D92D20',
          700: '#B42318', 800: '#912018', 900: '#7A271A', 950: '#55160C',
        },
        'dga-warning': {
          25: '#FFFCF5', 50: '#FFFAEB', 100: '#FEF0C7', 200: '#FEDF89',
          300: '#FEC84B', 400: '#FDB022', 500: '#F79009', 600: '#DC6803',
          700: '#B54708', 800: '#93370D', 900: '#7A2E0E', 950: '#4E1D09',
        },
        'dga-info': {
          25: '#F5FAFF', 50: '#ECFDF3', 100: '#D1E9FF', 200: '#B2DDFF',
          300: '#84CAFF', 400: '#53B1FD', 500: '#2E90FA', 600: '#1570EF',
          700: '#175CD3', 800: '#1849A9', 900: '#194185', 950: '#102A56',
        },
        'dga-success': {
          25: '#F6FEF9', 50: '#ECFDF3', 100: '#DCFAE6', 200: '#ABEFC6',
          300: '#75E0A7', 400: '#47CD89', 500: '#17B26A', 600: '#079455',
          700: '#067647', 800: '#085D3A', 900: '#074D31', 950: '#053321',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
export default config;
