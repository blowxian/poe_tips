import type {Config} from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            boxShadow: {
                'custom': '0 0 25px 5px rgba(0, 0, 0, 1)', // 自定义阴影效果
            },
            textShadow: {
                // 自定义你的字体阴影
                default: '0 0 2px rgba(223, 207, 153, 0.25)',
                md: '0 0 3px rgba(223, 207, 153, 0.35)',
                lg: '0 0 5px rgba(223, 207, 153, 0.65)',
                // 其他需要的阴影效果
            },
            fontFamily: {
                sans: ["FontinRegular", "Verdana", "Arial", "Helvetica", "sans-serif"],
            },
        },
    },
    plugins: [
        // 导入并使用插件以支持 text-shadow
        require('tailwindcss-textshadow')
    ],
} as any;
export default config;
