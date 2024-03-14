export const theme = {
    colors: {
        success: 'forestgreen',
        info: 'cornflowerblue',
        warning: 'orange',
        error: 'indianred',
        attention: 'gold',
        ui: {
            appBg: "#15191df7",
            appBgOpaque: "#15191d",
            appBorder: "#1b2024",
            contentBg: "#292c37",

            background1: "rgba(20, 24, 28, 0.98)",
            background2: "rgba(30, 36, 42, 0.95)",
            background3: "#1c222a",
            background4: "#383d50",
            background5: "#23303c",

            element1: "#2b5f69",
            element2: "#1f4147",
            element3: "#163136",


            element31: "#204951",
            element41: "#3f9cb3",
            element51: "#2baac1",
            element61: "#35645f",
            element71: "#1f2932",
            element81: "#313131",
            element91: "#0e131c",
        },
        titleBar: {
            bg: "#15191dEE",
        },
        navBar: {
            bg: "#181f24ee",
            icon: "#166472EE",
            hoverBg: "#045b66EE",
            hoverIcon: "#54bed1",
            activeBg: "#10888d",
            activeIcon: "#6ce6fc",
        },
        submenu: {
            submenuBg: "#1c222a",
            bg: "#23303c",
            border: "#23303c",
            icon: "#166472",
            hoverBg: "#374451",
            hoverBorder: "#4aaec2",
            hoverIcon: "#4aaec2",
        },
        font: {
            icon: "#2bacc2",
            text: "#b8b9b9",
            textBright: "#f1f2f2",
            textActive: "#4aaec2",
            h1: "#6ae3f9",
            h2: "#387c86",
            h3: "#4f777f",
            h4: "#387c86",
        },
        input: {
            bg: "#163136",
            border: "#1f4046",
            hoverBg: "#204951",
            hoverBorder: "#3f9cb3",
            textDisabled: "#616161",
        },
        buttonPrimary: {
            bg: "#163136",
            border: "#1f4147",
            hoverBg: "#204952",
            hoverBorder: "#2b5f69",
            activeBg: "#1c6286",
            activeBorder: "#4aaec2",
        },
        buttonSecondary: {
            bg: "#23303c",
            border: "#23303c",
            hoverBg: "#374451",
            hoverBorder: "#4aaec2"
        },
    },
    fontSize: {
        regular: '16px',
        h1: '20px'
    }
};

export type ThemeType = typeof theme;
