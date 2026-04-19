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

export function useTeacherStatus() {
  const [isTeacher, setIsTeacher] = useState(() => getRoleFromCookie() === "teacher");

  useEffect(() => {
    setIsTeacher(getRoleFromCookie() === "teacher");
  }, []);

  return { isTeacher };
}
