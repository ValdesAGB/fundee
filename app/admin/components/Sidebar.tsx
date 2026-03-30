"use client";

import styled from "styled-components";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

const NAV_ITEMS = [
  {
    label: "Produits",
    href: "/admin/products",
    icon: "bi-box-seam",
    exact: true,
  },
  { label: "Statistiques", href: "/admin/stats", icon: "bi bi-bar-chart-line" },
  { label: "Paramètres", href: "/admin/settings", icon: "bi-gear" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/business/auth/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
    }
  };

  return (
    <Container>
      {/* ── Brand ── */}
      <Brand>
        <BrandDot />
        <BrandName>Fundee</BrandName>
      </Brand>

      {/* ── Nav ── */}
      <Nav>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            $active={
              item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href)
            } // ✅
          >
            <i className={`bi ${item.icon}`} />
            <span>{item.label}</span>
            {(item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)) && <ActiveBar />}{" "}
          </NavLink>
        ))}
      </Nav>

      {/* ── Bottom ── */}
      <Bottom>
        <Divider />
        <LogoutBtn onClick={handleLogout}>
          <i className="bi bi-box-arrow-left" />
          <span>Déconnexion</span>
        </LogoutBtn>
      </Bottom>
    </Container>
  );
}

/* ── Styles ── */

const Container = styled.aside`
  width: 240px;
  min-height: 100vh;
  background: #0f172a;
  display: flex;
  flex-direction: column;
  padding: 28px 16px;
  position: sticky;
  top: 0;
  flex-shrink: 0;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px;
  margin-bottom: 40px;
`;

const BrandDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff6b00;
  box-shadow: 0 0 8px rgba(255, 107, 0, 0.6);
`;

const BrandName = styled.span`
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  font-size: 17px;
  color: white;
  letter-spacing: -0.3px;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 10px;
  text-decoration: none;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  color: ${({ $active }) => ($active ? "#ff6b00" : "rgba(255,255,255,0.55)")};
  background: ${({ $active }) =>
    $active ? "rgba(255,107,0,0.1)" : "transparent"};
  position: relative;
  transition: all 0.18s ease;

  i {
    font-size: 16px;
    flex-shrink: 0;
  }

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.06);
  }
`;

const ActiveBar = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  border-radius: 2px;
  background: #ff6b00;
`;

const Bottom = styled.div`
  margin-top: auto;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin-bottom: 16px;
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 11px 14px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.45);
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.18s ease;

  i {
    font-size: 16px;
  }

  &:hover {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.08);
  }
`;
