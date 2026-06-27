// components/ui/Sidebar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  LayoutDashboard, Music2, FileText, Library, Tag, Mic2, AlignLeft,
  ScrollText, DollarSign, ShoppingBag, ShoppingCart, Users, Ticket,
  BadgePercent, Newspaper, ImagePlay, UsersRound, Megaphone, BarChart3,
  Settings, ChevronLeft, ChevronRight, ChevronDown,
} from "lucide-react";
import { useSidebar } from "./SidebarContext";
import Button from "./Button";

type NavChild = { label: string; href: string; icon: React.ReactNode };
type NavItem = { label: string; icon: React.ReactNode; href?: string; children?: NavChild[] };

const NAV: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/dashboard" },
  {
    label: "Music", icon: <Music2 size={18} />,
    children: [
      { label: "Tracks", href: "/music/tracks", icon: <FileText size={15} /> },
      { label: "Collections", href: "/music/collections", icon: <Library size={15} /> },
      { label: "Genres", href: "/music/genres", icon: <Tag size={15} /> },
      { label: "Artists", href: "/music/artists", icon: <Mic2 size={15} /> },
      { label: "Lyrics", href: "/music/lyrics", icon: <AlignLeft size={15} /> },
    ],
  },
  {
    label: "Licensing", icon: <ScrollText size={18} />,
    children: [
      { label: "License Plans", href: "/licensing/plans", icon: <ScrollText size={15} /> },
      { label: "Track Pricing", href: "/licensing/pricing", icon: <DollarSign size={15} /> },
    ],
  },
  {
    label: "Store", icon: <ShoppingBag size={18} />,
    children: [
      { label: "Orders", href: "/store/orders", icon: <ShoppingCart size={15} /> },
      { label: "Customers", href: "/store/customers", icon: <Users size={15} /> },
      { label: "Offers", href: "/store/offers", icon: <Ticket size={15} /> },
      { label: "Coupons", href: "/store/coupons", icon: <BadgePercent size={15} /> },
    ],
  },
  { label: "Content", icon: <Newspaper size={18} />, href: "/content" },
  { label: "Media", icon: <ImagePlay size={18} />, href: "/media" },
  { label: "Users", icon: <UsersRound size={18} />, href: "/users" },
  { label: "Marketing", icon: <Megaphone size={18} />, href: "/marketing" },
  { label: "Reports", icon: <BarChart3 size={18} />, href: "/reports" },
  { label: "Settings", icon: <Settings size={18} />, href: "/settings" },
];

const S = {
  sidebar: { background: "#000000", borderRight: "1px solid #1f1f1f" },
  logoBorder: { borderBottom: "1px solid #1f1f1f" },
  navArea: { scrollbarWidth: "thin" as const, scrollbarColor: "rgba(255,255,255,0.1) transparent" },
  footerBorder: { borderTop: "1px solid #1f1f1f" },
  avatar: { background: "#1f1f1f" },
  rowIdle: { color: "#a0a0a0" },
  rowActive: { color: "#ffffff" },
  iconIdle: { color: "#555555" },
  iconActive: { color: "#ffffff" },
  chevron: { color: "#555555" },
  childIdle: { color: "#555555", fontWeight: 400 },
  childActive: { color: "#ffffff", background: "rgba(255,255,255,0.06)", fontWeight: 500 },
  tickIdle: { height: "55%", background: "#2e2e2e" },
  tickActive: { height: "55%", background: "#ffffff" },
  rowHoverBg: "#141414",
};

// Vertical centre of the logo bar: py-5 = 20px top + 20px bottom, logo = 32px → centre at 36px
const TOGGLE_TOP = 36;

export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();
  const [openGroups, setOpenGroups] = useState<string[]>(["Music"]);

  const toggleGroup = (label: string) =>
    setOpenGroups(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );

  const isActive = (href?: string) => !!href && pathname.startsWith(href);
  const isGroupActive = (item: NavItem) => item.children?.some(c => pathname.startsWith(c.href));

  return (
    /*
     * overflow-hidden is removed from the aside so the toggle button can
     * hang over the right edge when collapsed. The inner nav still clips
     * horizontally via overflow-x-hidden on its own element.
     */
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 h-dvh flex flex-col z-[300]"
      style={S.sidebar}
      aria-label="Main navigation"
    >
      {/* ── Logo bar ── */}
      <div className="flex items-center gap-3 px-4 py-5 flex-shrink-0" style={S.logoBorder}>
        <Image
          src="/assets/logo/ss-no-bg.png"
          alt="Sidez Logo"
          width={32}
          height={32}
          className="object-contain flex-shrink-0"
          priority
        />
      </div>

      {/*
       * ── Collapse toggle ──
       *
       * Absolutely positioned relative to the aside so it can overhang
       * the right border without being clipped.
       *
       * Expanded  → right edge of the button aligns with the sidebar border
       *             (translateX(50%) centres it on the border line)
       * Collapsed → pulled a little further right (translateX(60%)) so
       *             ~60 % of the button peeks out, hinting it can be opened
       *
       * top is computed to land in the vertical centre of the logo bar:
       *   py-5 (20px) + half of logo (16px) = 36px, minus half of btn (12px) = 24px
       */}
      <motion.div
        className="absolute z-[400]"
        style={{ top: TOGGLE_TOP - 12 }}   // 24px — vertically centred on the logo row
        animate={{
          right: collapsed ? -6 : 0,        // -6 → half the 12px button radius peeks past the border
          x: collapsed ? "50%" : "50%",     // always translate so the button straddles the right edge
        }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          icon={collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          className="w-6 h-6 !px-0 !py-0 !rounded-[10px] !border-[#2a2a2a] !bg-[#111111] !text-[#555555] hover:!text-white hover:!bg-[#1a1a1a]"
        />
      </motion.div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-3" style={S.navArea}>
        <ul className="flex flex-col gap-0.5 list-none m-0 p-0">
          {NAV.map(item => {
            const hasChildren = !!item.children?.length;
            const groupOpen = openGroups.includes(item.label);
            const groupActive = isGroupActive(item);
            const leafActive = isActive(item.href);

            return (
              <li key={item.label} className="list-none">
                {hasChildren ? (
                  <button
                    onClick={() => toggleGroup(item.label)}
                    aria-expanded={groupOpen}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[10px] border-0 bg-transparent text-left cursor-pointer whitespace-nowrap relative"
                    style={groupActive ? S.rowActive : S.rowIdle}
                    onMouseEnter={e => { if (!groupActive) { (e.currentTarget as HTMLElement).style.background = S.rowHoverBg; (e.currentTarget as HTMLElement).style.color = "#ffffff"; } }}
                    onMouseLeave={e => { if (!groupActive) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#a0a0a0"; } }}
                  >
                    <span className="flex items-center flex-shrink-0" style={groupActive ? S.iconActive : S.iconIdle}>
                      {item.icon}
                    </span>

                    <AnimatePresence initial={false}>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.15 }}
                          className="flex-1 overflow-hidden text-[13.5px] font-medium"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    <AnimatePresence initial={false}>
                      {!collapsed && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                          <motion.span
                            animate={{ rotate: groupOpen ? 180 : 0 }}
                            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                            className="flex"
                            style={S.chevron}
                          >
                            <ChevronDown size={14} />
                          </motion.span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {collapsed && groupActive && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-[10px] bg-white" />
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href!}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[10px] no-underline whitespace-nowrap relative"
                    style={leafActive ? { ...S.rowActive, background: "rgba(255,255,255,0.06)" } : S.rowIdle}
                    onMouseEnter={e => { if (!leafActive) { (e.currentTarget as HTMLElement).style.background = S.rowHoverBg; (e.currentTarget as HTMLElement).style.color = "#ffffff"; } }}
                    onMouseLeave={e => { if (!leafActive) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#a0a0a0"; } }}
                  >
                    <span className="flex items-center flex-shrink-0" style={leafActive ? S.iconActive : S.iconIdle}>
                      {item.icon}
                    </span>

                    <AnimatePresence initial={false}>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.15 }}
                          className="flex-1 overflow-hidden text-[13.5px] font-medium"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {collapsed && leafActive && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-[10px] bg-white" />
                    )}
                  </Link>
                )}

                {/* Children accordion */}
                <AnimatePresence initial={false}>
                  {hasChildren && !collapsed && groupOpen && (
                    <motion.ul
                      role="list"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden list-none m-0 mt-0.5 flex flex-col gap-0.5 pl-9"
                    >
                      {item.children!.map(child => {
                        const childActive = isActive(child.href);
                        return (
                          <li key={child.href} className="list-none">
                            <Link
                              href={child.href}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-[13px] no-underline relative whitespace-nowrap"
                              style={childActive ? S.childActive : S.childIdle}
                              onMouseEnter={e => { if (!childActive) { (e.currentTarget as HTMLElement).style.background = S.rowHoverBg; (e.currentTarget as HTMLElement).style.color = "#ffffff"; } }}
                              onMouseLeave={e => { if (!childActive) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#555555"; } }}
                            >
                              <span
                                className="absolute left-[-13px] top-1/2 -translate-y-1/2 w-px rounded-[10px]"
                                style={childActive ? S.tickActive : S.tickIdle}
                              />
                              <span className="flex items-center flex-shrink-0">{child.icon}</span>
                              <span>{child.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── User footer ── */}
      <Link
        href="/account-settings"
        className="flex items-center gap-3 px-4 py-4 flex-shrink-0 no-underline"
        style={S.footerBorder}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0 tracking-wide"
          style={S.avatar}
        >
          JC
        </div>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-0.5 overflow-hidden min-w-0"
            >
              <span className="text-[13.5px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: "#ffffff" }}>
                John Carter
              </span>
              <span className="text-[12px] whitespace-nowrap" style={{ color: "#555555" }}>
                Account settings
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </motion.aside>
  );
}
