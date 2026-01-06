type MenuItem = {
    label: string;
    url?: string;
    enabled?: boolean;
    children?: MenuItem[];
};

export const navItems: MenuItem[] = [
    {
        label: "About", url: "/about",
        children: [
            { label: "🔗 ICPC Global", url: "https://icpc.global/" },
            { label: "🔗 ICPC Foundation", url: "https://icpc.foundation/" },
            { label: "🔗 ICPC Asia Council Chair CJ Hwang's Blog", url: "https://icpcasia.wp.txstate.edu/" },
            { label: "🔗 ICPC APAC Rules and News", url: "https://icpc.jp/apac/" },
            { label: "🔗 ICPC APAC Photos Gallery", url: "https://news.icpc.global/galleryAP/" },
        ]
    },
    {
        label: "Championship",
        url: "/championship/latest/information",
        children: [
            { label: "Information", url: "/championship/latest/information" },
            { label: "Competition", url: "/championship/latest/competition" },
            { label: "Resources", url: "/championship/latest/resources" },
            { label: "Teams", url: "/championship/latest/teams" },
            { label: "Schedule", url: "/championship/latest/schedule" },
            { label: "Travel", url: "/championship/latest/travel" },
            { label: "Committee", url: "/championship/latest/committee" }
        ],
    },
    {
        label: "Participate in the Regionals", url: "https://icpc.global/"
    },
    {
        label: "Contact Us",
        url: "/contact-us",
    },
];
