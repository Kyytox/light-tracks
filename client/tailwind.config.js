/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            transitionProperty: {
                height: "height",
            },
        },
        screens: {
            sm: "640px",
            // => @media (min-width: 640px) { ... }

            md: "768px",
            // => @media (min-width: 768px) { ... }

            lg: "1024px",
            // => @media (min-width: 1024px) { ... }

            xl: "1280px",
            // => @media (min-width: 1280px) { ... }

            "2xl": "1536px",
            // => @media (min-width: 1536px) { ... }
        },
        colors: {
            transparent: "transparent",
            bitcoin: "#f6921a",
            white: "#ffffff",
            primary: "#f6921a",
        },
    },
    plugins: [],
    variants: {
        transitionProperty: ["responsive", "motion-safe", "motion-reduce"],
        height: ["responsive", "hover", "focus"],
    },
};
