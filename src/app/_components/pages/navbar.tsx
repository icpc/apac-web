"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ThemeSwitcher } from "@/app/_components/pages/theme-switcher";
import Image from "next/image";
import styles from "@/app/_styles/navbar-styles.module.css";
import { ICPC_APAC } from "@/lib/constants";
import { useTheme } from "@/app/_components/pages/theme-context";

// Import the single navItems config
import { navItems } from "@/app/navConfig";

type MenuItem = {
    label: string;
    url?: string;
    enabled?: boolean;
    children?: MenuItem[];
};

export default function Navbar() {
    const { theme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const remPaddingSize = 1.5

    // For mobile toggles:
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    const [openSubSubMenu, setOpenSubSubMenu] = useState<string | null>(null);

    const mobileMenuRef = useRef<HTMLDivElement | null>(null);

    const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const toggleDropdown = (label: string) => {
        setOpenDropdown((prev) => (prev === label ? null : label));
    };
    const toggleSubMenu = (label: string) => {
        setOpenSubMenu((prev) => (prev === label ? null : label));
    };
    const toggleSubSubMenu = (label: string) => {
        setOpenSubSubMenu((prev) => (prev === label ? null : label));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target as Node)
            ) {
                closeMobileMenu();
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    // -----------------------------
    // DESKTOP MENU RENDER HELPERS
    // -----------------------------
    /**
     * Recursively render a nested menu for Desktop using Radix's NavigationMenu.
     * - If `item.children` exists, it becomes a dropdown (or sub-dropdown).
     * - If `item.enabled === false`, it's rendered as a disabled span.
     * - Otherwise, it's a Link.
     */
    const renderDesktopMenuItems = (items: MenuItem[], level = 0) => {
        return (
            <ul className={styles.dropdownList}>
                {items.map((item) => {
                    const { label, url, enabled = true, children } = item;
                    if (children && children.length > 0) {
                        return (
                            <li 
                                key={label}
                                style={{ paddingLeft: `${level * remPaddingSize}rem` }}
                            >
                                <NavigationMenu.Sub>
                                    <NavigationMenu.List>
                                        <NavigationMenu.Item>
                                            <NavigationMenu.Trigger
                                                className={
                                                    children[0]?.children
                                                        ? styles.dropdownListSubSubTrigger
                                                        : styles.dropdownListSubTrigger
                                                }
                                            >
                                                {label} ▼
                                            </NavigationMenu.Trigger>
                                            <NavigationMenu.Content>
                                                {renderDesktopMenuItems(children, level+1)}
                                            </NavigationMenu.Content>
                                        </NavigationMenu.Item>
                                    </NavigationMenu.List>
                                </NavigationMenu.Sub>
                            </li>
                        );
                    } else {
                        return (
                            <li
                                key={label}
                                style={{ paddingLeft: `${level * remPaddingSize}rem` }}
                            >
                                {enabled && url ? (
                                    <Link
                                        href={url}
                                        className={styles.dropdownListItem}
                                        onClick={closeMobileMenu}
                                    >
                                        {label}
                                    </Link>
                                ) : (
                                    <span className={styles.dropdownListItemDisabled}>{label}</span>
                                )}
                            </li>
                        );
                    }
                })}
            </ul>
        );
    };

    // -----------------------------
    // MOBILE MENU RENDER HELPERS
    // -----------------------------

    /**
     * Renders top-level items for mobile. If there are children, we use a <button>
     * that toggles openDropdown. Then we recursively render children in another <ul>.
     * We use openSubMenu and openSubSubMenu for deeper levels exactly as you had before.
     */
    const renderMobileMenuItems = (items: MenuItem[], level = 0) => {
        return (
            <ul className={styles.mobileMenuList}>
                {items.map((item) => {
                    const { label, url, enabled = true, children } = item;
                    const hasChildren = children && children.length > 0;

                    // If top-level has children, we treat it like your "About" or "Competition"
                    if (hasChildren) {
                        return (
                            <li key={label} style={{ paddingLeft: `${level * remPaddingSize}rem` }}>
                                <button
                                    onClick={() => toggleDropdown(label)}
                                    className={styles.dropdownButton}
                                >
                                    {label} ▼
                                </button>
                                {openDropdown === label && (
                                    <ul className={styles.mobileDropdownList}>
                                        {children.map((subItem) => {
                                            const hasSubChildren = subItem.children && subItem.children.length > 0;

                                            if (hasSubChildren) {
                                                return (
                                                    <li key={subItem.label}>
                                                        <button
                                                            onClick={() => toggleSubMenu(subItem.label)}
                                                            className={styles.dropdownButton}
                                                        >
                                                            {subItem.label} ▼
                                                        </button>
                                                        {openSubMenu === subItem.label && (
                                                            <ul className={styles.mobileDropdownSubList}>
                                                                {subItem.children!.map((subSubItem) => {
                                                                    const hasSubSubChildren =
                                                                        subSubItem.children && subSubItem.children.length > 0;

                                                                    if (hasSubSubChildren) {
                                                                        return (
                                                                            <li key={subSubItem.label}>
                                                                                <button
                                                                                    onClick={() => toggleSubSubMenu(subSubItem.label)}
                                                                                    className={styles.dropdownButton}
                                                                                >
                                                                                    {subSubItem.label} ▼
                                                                                </button>
                                                                                {openSubSubMenu === subSubItem.label && (
                                                                                    <ul className={styles.mobileDropdownSubList}>
                                                                                        {subSubItem.children!.map((deepItem) => (
                                                                                            <li key={deepItem.label}>
                                                                                                {deepItem.enabled !== false && deepItem.url ? (
                                                                                                    <Link
                                                                                                        href={deepItem.url}
                                                                                                        className={styles.mobileMenuLink}
                                                                                                        onClick={closeMobileMenu}
                                                                                                    >
                                                                                                        {deepItem.label}
                                                                                                    </Link>
                                                                                                ) : (
                                                                                                    <span className={styles.mobileMenuLinkDisabled}>
                                                                                                        {deepItem.label}
                                                                                                    </span>
                                                                                                )}
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
                                                                                )}
                                                                            </li>
                                                                        );
                                                                    } else {
                                                                        return (
                                                                            <li key={subSubItem.label}>
                                                                                {subSubItem.enabled !== false && subSubItem.url ? (
                                                                                    <Link
                                                                                        href={subSubItem.url}
                                                                                        className={styles.mobileMenuLink}
                                                                                        onClick={closeMobileMenu}
                                                                                    >
                                                                                        {subSubItem.label}
                                                                                    </Link>
                                                                                ) : (
                                                                                    <span className={styles.mobileMenuLinkDisabled}>
                                                                                        {subSubItem.label}
                                                                                    </span>
                                                                                )}
                                                                            </li>
                                                                        );
                                                                    }
                                                                })}
                                                            </ul>
                                                        )}
                                                    </li>
                                                );
                                            } else {
                                                // subItem is just a single link or disabled
                                                return (
                                                    <li key={subItem.label}>
                                                        {subItem.enabled !== false && subItem.url ? (
                                                            <Link
                                                                href={subItem.url}
                                                                className={styles.mobileMenuLink}
                                                                onClick={closeMobileMenu}
                                                            >
                                                                {subItem.label}
                                                            </Link>
                                                        ) : (
                                                            <span className={styles.mobileMenuLinkDisabled}>
                                                                {subItem.label}
                                                            </span>
                                                        )}
                                                    </li>
                                                );
                                            }
                                        })}
                                    </ul>
                                )}
                            </li>
                        );
                    } else {
                        return (
                            <li key={label}>
                                {enabled && url ? (
                                    <Link
                                        href={url}
                                        className={`${styles.mobileMenuLink} ${styles.noChildMenu}`}
                                        onClick={closeMobileMenu}
                                    >
                                        {label}
                                    </Link>
                                ) : (
                                    <span className={styles.mobileMenuLinkDisabled}>{label}</span>
                                )}
                            </li>
                        );
                    }
                })}
            </ul>
        );
    };

    return (
        <NavigationMenu.Root className={styles.navRoot}>
            <NavigationMenu.List className={styles.navList}>
                {/* Logo */}
                <NavigationMenu.Item>
                    <Link href="/" className={styles.logoContainer} onClick={closeMobileMenu}>
                        <span className={styles.logoLink}>
                            <Image
                                src={`/assets/icpc-logo.png`}
                                alt="ICPC Logo"
                                width={50}
                                height={50}
                            />
                        </span>
                        <span className={styles.logoText}>{ICPC_APAC}</span>
                    </Link>
                </NavigationMenu.Item>

                {/* -------------
                DESKTOP NAV 
                ------------- */}
                <div className={styles.desktopNav}>
                    {navItems.map((top) => {
                        const { label, url, enabled = true, children } = top;
                        if (children && children.length > 0) {
                            // Has dropdown
                            return (
                                <NavigationMenu.Item key={label}>
                                    <NavigationMenu.Trigger className={styles.triggerBtn}>
                                        {label} ▼
                                    </NavigationMenu.Trigger>
                                    <NavigationMenu.Content className={styles.dropdownContent}>
                                        {renderDesktopMenuItems(top.children ?? [])}
                                    </NavigationMenu.Content>
                                </NavigationMenu.Item>
                            );
                        } else {
                            return (
                                <NavigationMenu.Item key={label}>
                                    {enabled && url ? (
                                        <Link
                                            href={url}
                                            className={`${styles.triggerBtn} ${styles.noChildMenu}`}
                                            onClick={closeMobileMenu}
                                        >
                                            {label}
                                        </Link>
                                    ) : (
                                        <span
                                            className={`${styles.triggerBtn} ${styles.noChildMenu} ${styles.dropdownListItemDisabled}`}
                                        >
                                            {label}
                                        </span>
                                    )}
                                </NavigationMenu.Item>
                            );
                        }
                    })}

                    <NavigationMenu.Item>
                        <ThemeSwitcher />
                    </NavigationMenu.Item>
                </div>

                {/* -------------
                MOBILE NAV 
                ------------- */}
                <div ref={mobileMenuRef} className={styles.mobileMenuWrapper}>
                    <div className={styles.mobileToggleContainer}>
                        <li>
                            <ThemeSwitcher />
                        </li>
                        <button
                            className={styles.mobileToggleBtn}
                            onClick={toggleMobileMenu}
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? "✕" : "☰"}
                        </button>
                    </div>

                    {isMobileMenuOpen && (
                        <div className={styles.mobileMenuContainer}>
                            {renderMobileMenuItems(navItems, 0)}
                        </div>
                    )}
                </div>
            </NavigationMenu.List>
        </NavigationMenu.Root>
    );
}
