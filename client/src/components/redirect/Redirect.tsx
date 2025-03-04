import { useEffect } from "react";
import { useNavigate } from "react-router";

interface RedirectProps {
  to: "/";
}

export const Redirect = ({ to }: RedirectProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to);
  }, [navigate, to]);

  return null;
};
