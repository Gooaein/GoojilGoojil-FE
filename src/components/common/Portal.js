import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Portal = ({ children }) => {
  const elRef = useRef(null);
  const rootRef = useRef(null);

  if (!elRef.current) {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    let portalRoot = document.getElementById("portal-root");
    if (!portalRoot) {
      portalRoot = document.createElement("div");
      portalRoot.id = "portal-root";
      document.body.appendChild(portalRoot);
      rootRef.current = portalRoot;
    }

    portalRoot.appendChild(elRef.current);

    return () => {
      elRef.current.remove();
      if (rootRef.current) {
        rootRef.current.remove();
      }
    };
  }, []);

  return createPortal(children, elRef.current);
};

export default Portal;
