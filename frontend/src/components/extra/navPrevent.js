import useNavigate from "hooks/useNavigate";
import { useEffect } from "react";

export function useNav(isValidNav) {
    const navigate = useNavigate();
    const currentPath = window.location.pathname.substring(1),
      isDirectNavAllowed =
        currentPath === PAGE_X ||
        currentPath === PAGE_Y ||
    useEffect(() => {
      if (isValidNav !== true && isDirectNavAllowed !== true) {
        navigate("/", { replace: true });
      }
    }, [isValidNav]);
  }
