"use client";

import React, { useMemo } from "react";
import { generateQRMatrix, QRECCLevel } from "../lib/qrcode";

interface QRCodeProps {
  value: string;
  size?: number;
  level?: QRECCLevel;
  fgColor?: string;
  bgColor?: string;
  className?: string;
  title?: string;
}

export default function QRCodeSVG({
  value,
  size = 200,
  level = "M",
  fgColor = "#162E55",
  bgColor = "#F7FAFD",
  className = "",
  title = "QR Code",
}: QRCodeProps) {
  const matrix = useMemo(() => {
    try {
      return generateQRMatrix(value, level);
    } catch (e) {
      console.error("QR Code generation error:", e);
      return [];
    }
  }, [value, level]);

  if (!matrix || matrix.length === 0) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center bg-[#EDF1F7] text-[#5C7AA2] text-xs rounded"
      >
        QR Error
      </div>
    );
  }

  const matrixSize = matrix.length;
  // Quiet zone margin: 4 modules (ISO 18004 minimum; improves scanning)
  const margin = 4;
  const viewBoxSize = matrixSize + margin * 2;

  // Build SVG path data for dark modules for performance
  let path = "";
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (matrix[r][c]) {
        path += `M${c + margin},${r + margin}h1v1h-1z `;
      }
    }
  }

  return (
    <svg
      role="img"
      aria-label={title}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      width={size}
      height={size}
      className={`block select-none ${className}`}
      style={{ shapeRendering: "crispEdges" }}
    >
      <rect width={viewBoxSize} height={viewBoxSize} fill={bgColor} />
      <path d={path} fill={fgColor} />
    </svg>
  );
}
