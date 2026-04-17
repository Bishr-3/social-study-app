"use client";

import { useEffect, useState } from "react";

export function useTeacherStatus() {
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/teacher/check");
        if (res.ok) {
          const data = await res.json();
          setIsTeacher(data.isTeacher);
        }
      } catch (err) {
        console.error("Teacher status check failed", err);
      }
    }
    checkStatus();
  }, []);

  return { isTeacher };
}
