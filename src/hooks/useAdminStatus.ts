"use client";

import { useEffect, useState } from "react";

export function useAdminStatus() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((d) => setIsAdmin(d.isAdmin === true))
      .catch(() => setIsAdmin(false))
      .finally(() => setChecking(false));
  }, []);

  return { isAdmin, checking };
}
