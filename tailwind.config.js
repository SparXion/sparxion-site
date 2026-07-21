/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#ffffff',
        'dark-gray': '#333333',
        'medium-gray': '#666666',
        'light-gray': '#999999',
        'border-gray': '#e0e0e0',
        'bg-gray': '#f5f5f5',
        'very-light-gray': '#fafafa',
      },
      fontFamily: {
        sans: ["'Figtree'", "'Exo 2'", 'sans-serif'],
        mono: ["'Monaco'", "'Menlo'", "'Courier New'", 'monospace'],
        logo: ["'Exo 2'", 'sans-serif'],
        display: ["'Exo 2'", 'sans-serif'],
      },
      fontSize: {
        // Large headings - use weight for emphasis
        'h1': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '500' }],
        'h2': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '500' }],
        
        // Medium headings - consistent medium weight
        'h3': ['1.2rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
        'h4': ['1rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '500' }],
        
        // Body text hierarchy - unified Regular (400) weight, size creates distinction
        'body': ['1rem', { lineHeight: '1.6', letterSpacing: '0.01em', fontWeight: '400' }],
        'small': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '400' }],
        'tiny': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '400' }],
      },
      spacing: {
        'tiny': '8px',
        'small': '12px',
        'medium': '20px',
        'large': '30px',
        'xlarge': '50px',
      },
      borderRadius: {
        'subtle': '4px',
        'card': '6px',
        'modal': '8px',
      },
      borderWidth: {
        'bold': '2px',
      },
      transitionDuration: {
        'standard': '200ms',
        'smooth': '300ms',
        'fast': '100ms',
      },
      boxShadow: {
        'subtle': '0 2px 4px rgba(0,0,0,0.1)',
        'medium': '0 2px 8px rgba(0,0,0,0.15)',
        'strong': '0 3px 12px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
}
