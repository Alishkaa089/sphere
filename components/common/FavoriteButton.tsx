"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/lib/actions";

interface FavoriteButtonProps {
  productId: string;
  type: "property" | "vehicle";
  initialFavorited?: boolean;
  className?: string;
}

export default function FavoriteButton({ productId, type, initialFavorited = false, className = "" }: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      const ids: string[] = JSON.parse(stored);
      setIsFav(ids.includes(productId));
    }
  }, [productId]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    const newFav = !isFav;
    setIsFav(newFav);

    const stored = localStorage.getItem("favorites");
    const ids: string[] = stored ? JSON.parse(stored) : [];
    const updated = newFav ? [...ids, productId] : ids.filter((id) => id !== productId);
    localStorage.setItem("favorites", JSON.stringify(updated));
    window.dispatchEvent(new Event("favoritesChanged"));

    try {
      await toggleFavorite(userEmail, productId, type);
    } catch {
      setIsFav(!newFav);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 ${
        isFav
          ? "bg-red-500 border-red-500 text-white scale-110"
          : "bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-red-500"
      } ${className}`}
    >
      <Heart className={`w-4 h-4 transition-all ${isFav ? "fill-white" : ""}`} />
    </button>
  );
}
