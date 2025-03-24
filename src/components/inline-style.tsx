"use client";

import React from "react";

interface InlineStyleProps {
  children: React.ReactNode;
}

export default function InlineStyle({ children }: InlineStyleProps) {
  return (
    <>
      {children}
      <style jsx global>{`
        /* Type colors */
        .normal-bg {
          background-color: #a8a878 !important;
        }
        .fire-bg {
          background-color: #f08030 !important;
        }
        .water-bg {
          background-color: #6890f0 !important;
        }
        .electric-bg {
          background-color: #f8d030 !important;
        }
        .grass-bg {
          background-color: #78c850 !important;
        }
        .ice-bg {
          background-color: #98d8d8 !important;
        }
        .fighting-bg {
          background-color: #c03028 !important;
        }
        .poison-bg {
          background-color: #a040a0 !important;
        }
        .ground-bg {
          background-color: #e0c068 !important;
        }
        .flying-bg {
          background-color: #a890f0 !important;
        }
        .psychic-bg {
          background-color: #f85888 !important;
        }
        .bug-bg {
          background-color: #a8b820 !important;
        }
        .rock-bg {
          background-color: #b8a038 !important;
        }
        .ghost-bg {
          background-color: #705898 !important;
        }
        .dragon-bg {
          background-color: #7038f8 !important;
        }
        .dark-bg {
          background-color: #705848 !important;
        }
        .steel-bg {
          background-color: #b8b8d0 !important;
        }
        .fairy-bg {
          background-color: #ee99ac !important;
        }

        /* Pokemon card gradients */
        .normal-gradient {
          background: linear-gradient(135deg, #a8a878, #c6c6a7) !important;
        }
        .fire-gradient {
          background: linear-gradient(135deg, #f08030, #fc6c6d) !important;
        }
        .water-gradient {
          background: linear-gradient(135deg, #6890f0, #26c6da) !important;
        }
        .electric-gradient {
          background: linear-gradient(135deg, #f8d030, #ffd86f) !important;
        }
        .grass-gradient {
          background: linear-gradient(135deg, #78c850, #5ecc62) !important;
        }
        .ice-gradient {
          background: linear-gradient(135deg, #98d8d8, #8eedf8) !important;
        }
        .fighting-gradient {
          background: linear-gradient(135deg, #c03028, #ef6050) !important;
        }
        .poison-gradient {
          background: linear-gradient(135deg, #a040a0, #cc66bb) !important;
        }
        .ground-gradient {
          background: linear-gradient(135deg, #e0c068, #edd086) !important;
        }
        .flying-gradient {
          background: linear-gradient(135deg, #a890f0, #bda5f7) !important;
        }
        .psychic-gradient {
          background: linear-gradient(135deg, #f85888, #fe9ac9) !important;
        }
        .bug-gradient {
          background: linear-gradient(135deg, #a8b820, #cddc39) !important;
        }
        .rock-gradient {
          background: linear-gradient(135deg, #b8a038, #d1b855) !important;
        }
        .ghost-gradient {
          background: linear-gradient(135deg, #705898, #a292bc) !important;
        }
        .dragon-gradient {
          background: linear-gradient(135deg, #7038f8, #9f85ff) !important;
        }
        .dark-gradient {
          background: linear-gradient(135deg, #705848, #916852) !important;
        }
        .steel-gradient {
          background: linear-gradient(135deg, #b8b8d0, #d1d1e0) !important;
        }
        .fairy-gradient {
          background: linear-gradient(135deg, #ee99ac, #ffc0cb) !important;
        }

        /* Hero section gradient */
        .hero-gradient {
          background: linear-gradient(
            135deg,
            rgba(20, 20, 31, 0.95),
            rgba(0, 0, 0, 0.85)
          );
          background-size: cover;
        }

        /* Animations */
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%,
          100% {
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));
          }
          50% {
            filter: drop-shadow(0 0 25px rgba(255, 255, 255, 0.5));
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-slow-spin {
          animation: rotate 10s linear infinite;
        }

        .pokemon-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .pokemon-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        }

        /* Pokéball loader animation */
        .pokeball-loader {
          width: 60px;
          height: 60px;
          background: linear-gradient(to bottom, #f22 50%, #fff 50%);
          border-radius: 50%;
          border: 5px solid #333;
          animation: spin 1s linear infinite;
          position: relative;
        }

        .pokeball-loader::before {
          content: "";
          position: absolute;
          height: 5px;
          width: 100%;
          background: #333;
          top: calc(50% - 2.5px);
          left: 0;
        }

        .pokeball-loader::after {
          content: "";
          position: absolute;
          height: 15px;
          width: 15px;
          border-radius: 50%;
          background: #fff;
          top: calc(50% - 7.5px);
          left: calc(50% - 7.5px);
          border: 3px solid #333;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .stretched-link::after {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 1;
          content: "";
        }
      `}</style>
    </>
  );
}
