type MenuItem = {
    label: string;
    url?: string;
    enabled?: boolean;
    children?: MenuItem[];
};

export const navItems: MenuItem[] = [
    {
        label: "About", url: "/about"
    },
    {
        label: "Championship",
        url: "/championship/latest/information",
        children: [
            { label: "Information", url: "/championship/latest/information" },
            { label: "Competition", url: "/championship/latest/competition" },
            { label: "Teams", url: "/championship/latest/teams" },
            { label: "Schedule", url: "/championship/latest/schedule" },
            { label: "Travel", url: "/championship/latest/travel" }
        ],
    },
    {
        label: "Participate in the Regionals", url: "https://icpc.global/regionals"
    },
    {
        label: "Contact Us",
        url: "/contact-us",
    },
];
