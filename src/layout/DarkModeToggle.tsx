import React from "react";

export function DarkModeToggle() {
    const [dark, setDark] = React.useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    React.useEffect(() => {
        document.body.classList.toggle("dark", dark);
        localStorage.setItem("darkMode", dark ? "true" : "false");
    }, [dark]);

    return (
        <button
            onClick={() => setDark(!dark)}
            css={{ marginTop: 16 }}
        >
            {dark ? "Light Mode" : "Dark Mode"}
        </button>
    );
}
