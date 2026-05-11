import { useEffect, useState } from "react";
import { fallbackPortfolioData } from "../lib/fallback-portfolio";
import { fetchPortfolioData } from "../lib/portfolio-data";
import type { PortfolioData } from "../lib/portfolio-types";

export const usePortfolioData = () => {
  const [data, setData] = useState<PortfolioData>(fallbackPortfolioData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      const portfolioData = await fetchPortfolioData();

      if (!cancelled) {
        setData(portfolioData);
        setLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading };
};
