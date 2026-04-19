"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function useAdminStatus() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setChecking(true);
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((d) => setIsAdmin(d.isAdmin === true))
      .catch(() => setIsAdmin(false))
      .finally(() => setChecking(false));
  }, [pathname]);

  return { isAdmin, checking };
}
