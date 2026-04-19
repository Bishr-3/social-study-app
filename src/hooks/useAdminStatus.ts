"use client";

import { useEffect, useState } from "react";

function getRoleFromCookie() {
  if (typeof document === "undefined") return null;
  const roleCookie = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("user_role="));

  return roleCookie ? roleCookie.split("=")[1] : null;
}

export function useAdminStatus() {
  const [isAdmin, setIsAdmin] = useState(() => getRoleFromCookie() === "admin");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setIsAdmin(getRoleFromCookie() === "admin");
  }, []);

  return { isAdmin, checking };
}
