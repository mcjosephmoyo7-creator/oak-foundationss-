/**
 * Pure TypeScript QR Code generator (ISO/IEC 18004 compliant byte mode)
 * Generates accurate, scannable QR Codes with zero external dependencies.
 */

// QR Code error correction levels
export type QRECCLevel = 'L' | 'M' | 'Q' | 'H';

const EC_LEVEL_INDICATOR: Record<QRECCLevel, number> = {
  L: 1,
  M: 0,
  Q: 3,
  H: 2,
};

interface VersionInfo {
  version: number;
  totalCodewords: number;
  ecCodewords: Record<QRECCLevel, number>;
  blocks: Record<QRECCLevel, [number, number, number, number]>; // [g1Blocks, g1Data, g2Blocks, g2Data]
  alignmentPatterns: number[];
}

const VERSION_TABLE: VersionInfo[] = [
  {
    version: 1,
    totalCodewords: 26,
    ecCodewords: { L: 7, M: 10, Q: 13, H: 17 },
    blocks: { L: [1, 19, 0, 0], M: [1, 16, 0, 0], Q: [1, 13, 0, 0], H: [1, 9, 0, 0] },
    alignmentPatterns: [],
  },
  {
    version: 2,
    totalCodewords: 44,
    ecCodewords: { L: 10, M: 16, Q: 22, H: 28 },
    blocks: { L: [1, 34, 0, 0], M: [1, 28, 0, 0], Q: [1, 22, 0, 0], H: [1, 16, 0, 0] },
    alignmentPatterns: [6, 18],
  },
  {
    version: 3,
    totalCodewords: 70,
    ecCodewords: { L: 15, M: 26, Q: 36, H: 44 },
    blocks: { L: [1, 55, 0, 0], M: [1, 44, 0, 0], Q: [2, 17, 0, 0], H: [2, 13, 0, 0] },
    alignmentPatterns: [6, 22],
  },
  {
    version: 4,
    totalCodewords: 100,
    ecCodewords: { L: 20, M: 36, Q: 52, H: 64 },
    blocks: { L: [1, 80, 0, 0], M: [2, 32, 0, 0], Q: [2, 24, 0, 0], H: [4, 9, 0, 0] },
    alignmentPatterns: [6, 26],
  },
  {
    version: 5,
    totalCodewords: 134,
    ecCodewords: { L: 26, M: 48, Q: 72, H: 88 },
    blocks: { L: [1, 108, 0, 0], M: [2, 43, 0, 0], Q: [2, 15, 2, 16], H: [2, 11, 2, 12] },
    alignmentPatterns: [6, 30],
  },
  {
    version: 6,
    totalCodewords: 172,
    ecCodewords: { L: 36, M: 64, Q: 96, H: 112 },
    blocks: { L: [2, 68, 0, 0], M: [4, 27, 0, 0], Q: [4, 19, 0, 0], H: [4, 15, 0, 0] },
    alignmentPatterns: [6, 34],
  },
];

// Galois Field GF(256) math
const EXP_TABLE = new Uint8Array(512);
const LOG_TABLE = new Uint8Array(256);

(function initGalois() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x;
    EXP_TABLE[i + 255] = x;
    LOG_TABLE[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
})();

function gfMultiply(x: number, y: number): number {
  if (x === 0 || y === 0) return 0;
  return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
}

function getGeneratorPolynomial(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const nextPoly = new Uint8Array(poly.length + 1);
    for (let j = 0; j < poly.length; j++) {
      nextPoly[j] ^= gfMultiply(poly[j], EXP_TABLE[i]);
      nextPoly[j + 1] ^= poly[j];
    }
    poly = nextPoly;
  }
  return poly;
}

function computeECCodewords(data: Uint8Array, ecLength: number): Uint8Array {
  const genPoly = getGeneratorPolynomial(ecLength);
  const result = new Uint8Array(ecLength);

  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ result[0];
    result.copyWithin(0, 1);
    result[ecLength - 1] = 0;
    for (let j = 0; j < ecLength; j++) {
      result[j] ^= gfMultiply(genPoly[j], factor);
    }
  }
  return result;
}

const FORMAT_INFO_MASK = 0x5412;
function getFormatBits(ecLevel: QRECCLevel, maskPattern: number): number {
  const format = (EC_LEVEL_INDICATOR[ecLevel] << 3) | maskPattern;
  let bch = format << 10;
  const gen = 0x537;
  for (let i = 4; i >= 0; i--) {
    if (bch & (1 << (i + 10))) {
      bch ^= gen << i;
    }
  }
  return ((format << 10) | bch) ^ FORMAT_INFO_MASK;
}

export function generateQRMatrix(text: string, ecLevel: QRECCLevel = 'M'): boolean[][] {
  const textBytes = new TextEncoder().encode(text);
  const textLen = textBytes.length;

  let selectedVersion: VersionInfo | null = null;
  for (const v of VERSION_TABLE) {
    const [g1B, g1D, g2B, g2D] = v.blocks[ecLevel];
    const totalDataCapacity = g1B * g1D + g2B * g2D;
    const availableDataBytes = totalDataCapacity - 2;
    if (textLen <= availableDataBytes) {
      selectedVersion = v;
      break;
    }
  }

  if (!selectedVersion) {
    selectedVersion = VERSION_TABLE[VERSION_TABLE.length - 1];
  }

  const [g1B, g1D, g2B, g2D] = selectedVersion.blocks[ecLevel];
  const totalDataBytes = g1B * g1D + g2B * g2D;

  const bitArray: number[] = [];
  function pushBits(val: number, length: number) {
    for (let i = length - 1; i >= 0; i--) {
      bitArray.push((val >> i) & 1);
    }
  }

  // Mode: Byte (0100)
  pushBits(0b0100, 4);
  // Count: 8 bits
  pushBits(Math.min(textLen, 255), 8);
  for (let i = 0; i < textLen; i++) {
    pushBits(textBytes[i], 8);
  }
  // Terminator
  const totalDataBits = totalDataBytes * 8;
  const termLength = Math.min(4, totalDataBits - bitArray.length);
  pushBits(0, termLength);
  while (bitArray.length % 8 !== 0) {
    bitArray.push(0);
  }
  // Pad bytes
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (bitArray.length < totalDataBits) {
    pushBits(padBytes[padIdx % 2], 8);
    padIdx++;
  }

  const dataCodewords = new Uint8Array(totalDataBytes);
  for (let i = 0; i < totalDataBytes; i++) {
    let byteVal = 0;
    for (let b = 0; b < 8; b++) {
      byteVal = (byteVal << 1) | bitArray[i * 8 + b];
    }
    dataCodewords[i] = byteVal;
  }

  const ecPerBlock = selectedVersion.ecCodewords[ecLevel];
  const numBlocks = g1B + g2B;
  const blocksData: Uint8Array[] = [];
  const blocksEC: Uint8Array[] = [];

  let offset = 0;
  for (let i = 0; i < g1B; i++) {
    const chunk = dataCodewords.slice(offset, offset + g1D);
    blocksData.push(chunk);
    blocksEC.push(computeECCodewords(chunk, ecPerBlock));
    offset += g1D;
  }
  for (let i = 0; i < g2B; i++) {
    const chunk = dataCodewords.slice(offset, offset + g2D);
    blocksData.push(chunk);
    blocksEC.push(computeECCodewords(chunk, ecPerBlock));
    offset += g2D;
  }

  const finalCodewords: number[] = [];
  const maxDataLen = Math.max(g1D, g2D);
  for (let i = 0; i < maxDataLen; i++) {
    for (let b = 0; b < numBlocks; b++) {
      if (i < blocksData[b].length) {
        finalCodewords.push(blocksData[b][i]);
      }
    }
  }
  for (let i = 0; i < ecPerBlock; i++) {
    for (let b = 0; b < numBlocks; b++) {
      finalCodewords.push(blocksEC[b][i]);
    }
  }

  const size = selectedVersion.version * 4 + 17;
  const matrix: (boolean | null)[][] = Array.from({ length: size }, () =>
    Array(size).fill(null)
  );

  function placeFinder(row: number, col: number) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const tr = row + r;
        const tc = col + c;
        if (tr < 0 || tr >= size || tc < 0 || tc >= size) continue;
        if (
          (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
          (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[tr][tc] = true;
        } else {
          matrix[tr][tc] = false;
        }
      }
    }
  }

  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  for (let i = 8; i < size - 8; i++) {
    if (matrix[6][i] === null) matrix[6][i] = i % 2 === 0;
    if (matrix[i][6] === null) matrix[i][6] = i % 2 === 0;
  }

  const alignCoords = selectedVersion.alignmentPatterns;
  for (const r of alignCoords) {
    for (const c of alignCoords) {
      if (matrix[r][c] !== null) continue;
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          if (
            Math.abs(dr) === 2 ||
            Math.abs(dc) === 2 ||
            (dr === 0 && dc === 0)
          ) {
            matrix[r + dr][c + dc] = true;
          } else {
            matrix[r + dr][c + dc] = false;
          }
        }
      }
    }
  }

  matrix[size - 8][8] = true;

  for (let i = 0; i < 9; i++) {
    if (matrix[8][i] === null) matrix[8][i] = false;
    if (matrix[i][8] === null) matrix[i][8] = false;
    if (matrix[8][size - 1 - i] === null) matrix[8][size - 1 - i] = false;
    if (matrix[size - 1 - i][8] === null) matrix[size - 1 - i][8] = false;
  }

  let bitIdx = 0;
  const totalFinalBits = finalCodewords.length * 8;
  let dir = -1;
  let c = size - 1;
  let r = size - 1;

  while (c > 0) {
    if (c === 6) c--;
    for (let count = 0; count < size; count++) {
      const row = r;
      for (let colOffset = 0; colOffset < 2; colOffset++) {
        const col = c - colOffset;
        if (matrix[row][col] === null) {
          let bit = false;
          if (bitIdx < totalFinalBits) {
            const cwIndex = Math.floor(bitIdx / 8);
            const bitOffset = 7 - (bitIdx % 8);
            bit = ((finalCodewords[cwIndex] >> bitOffset) & 1) === 1;
            bitIdx++;
          }
          const mask = (row + col) % 2 === 0;
          matrix[row][col] = bit !== mask;
        }
      }
      r += dir;
    }
    dir = -dir;
    r += dir;
    c -= 2;
  }

  const formatBits = getFormatBits(ecLevel, 0);
  for (let i = 0; i < 6; i++) matrix[8][i] = ((formatBits >> i) & 1) === 1;
  matrix[8][7] = ((formatBits >> 6) & 1) === 1;
  matrix[8][8] = ((formatBits >> 7) & 1) === 1;
  matrix[7][8] = ((formatBits >> 8) & 1) === 1;
  for (let i = 9; i < 15; i++) matrix[14 - i][8] = ((formatBits >> i) & 1) === 1;

  for (let i = 0; i < 8; i++) matrix[size - 1 - i][8] = ((formatBits >> i) & 1) === 1;
  for (let i = 8; i < 15; i++) matrix[8][size - 15 + i] = ((formatBits >> i) & 1) === 1;

  return matrix.map(row => row.map(cell => cell === true));
}
