/**
 * HexUtils.js - Hexagonal grid mathematics and utilities
 * Handles all coordinate conversions and neighbor calculations
 */

class HexUtils {
    /**
     * Converts axial hex coordinates to pixel coordinates (pointy-top).
     * @param {number} q - The q coordinate of the hex.
     * @param {number} r - The r coordinate of the hex.
     * @param {number} size - The radius of the hex.
     * @returns {{x: number, y: number}} The pixel coordinates.
     */
    static hexToPixel(q, r, size) {
        const x = size * (3/2 * q);
        const y = size * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
        return {x, y};
    }

    /**
     * Converts pixel coordinates to axial hex coordinates.
     * @param {number} x - The x pixel coordinate.
     * @param {number} y - The y pixel coordinate.
     * @param {number} size - The radius of the hex.
     * @returns {{q: number, r: number}} The rounded hex coordinates.
     */
    static pixelToHex(x, y, size) {
        const q = (2/3 * x) / size;
        const r = (-1/3 * x + Math.sqrt(3)/3 * y) / size;
        return this.hexRound(q, r);
    }

    /**
     * Rounds fractional hex coordinates to the nearest integer hex coordinates.
     * @param {number} fq - The fractional q coordinate.
     * @param {number} fr - The fractional r coordinate.
     * @returns {{q: number, r: number}} The integer hex coordinates.
     */
    static hexRound(fq, fr) {
        const fs = -fq - fr;
        let q = Math.round(fq);
        let r = Math.round(fr);
        let s = Math.round(fs);
        const q_d = Math.abs(q - fq);
        const r_d = Math.abs(r - fr);
        const s_d = Math.abs(s - fs);
        
        if (q_d > r_d && q_d > s_d) {
            q = -r - s;
        } else if (r_d > s_d) {
            r = -q - s;
        } else {
            s = -q - r;
        }
        return {q, r};
    }

    /**
     * Calculate distance between two hex coordinates
     * @param {number} q1 - First hex q coordinate
     * @param {number} r1 - First hex r coordinate
     * @param {number} q2 - Second hex q coordinate
     * @param {number} r2 - Second hex r coordinate
     * @returns {number} Distance between hexes
     */
    static hexDistance(q1, r1, q2, r2) {
        return (Math.abs(q1 - q2) + Math.abs(q1 + r1 - q2 - r2) + Math.abs(r1 - r2)) / 2;
    }

    /**
     * Get all neighbors of a hex coordinate
     * @param {number} q - The q coordinate
     * @param {number} r - The r coordinate
     * @returns {Array} Array of neighbor coordinates
     */
    static getNeighbors(q, r) {
        const directions = [
            [1, 0], [1, -1], [0, -1],
            [-1, 0], [-1, 1], [0, 1]
        ];
        
        return directions.map(([dq, dr]) => ({
            q: q + dq,
            r: r + dr
        }));
    }

    /**
     * Check if a hex coordinate is within a given radius
     * @param {number} q - The q coordinate
     * @param {number} r - The r coordinate
     * @param {number} radius - The radius to check within
     * @returns {boolean} True if within radius
     */
    static isWithinRadius(q, r, radius) {
        return this.hexDistance(0, 0, q, r) <= radius;
    }

    /**
     * Get all hex coordinates within a given radius
     * @param {number} centerQ - Center q coordinate
     * @param {number} centerR - Center r coordinate
     * @param {number} radius - Radius to get coordinates within
     * @returns {Array} Array of hex coordinates within radius
     */
    static getHexesWithinRadius(centerQ, centerR, radius) {
        const results = [];
        for (let q = -radius; q <= radius; q++) {
            const r1 = Math.max(-radius, -q - radius);
            const r2 = Math.min(radius, -q + radius);
            for (let r = r1; r <= r2; r++) {
                results.push({
                    q: centerQ + q,
                    r: centerR + r
                });
            }
        }
        return results;
    }

    /**
     * Convert axial coordinates to cube coordinates
     * @param {number} q - The q coordinate
     * @param {number} r - The r coordinate
     * @returns {{x: number, y: number, z: number}} Cube coordinates
     */
    static axialToCube(q, r) {
        const x = q;
        const z = r;
        const y = -x - z;
        return {x, y, z};
    }

    /**
     * Convert cube coordinates to axial coordinates
     * @param {number} x - The x cube coordinate
     * @param {number} y - The y cube coordinate
     * @param {number} z - The z cube coordinate
     * @returns {{q: number, r: number}} Axial coordinates
     */
    static cubeToAxial(x, y, z) {
        const q = x;
        const r = z;
        return {q, r};
    }
}

// Export for backward compatibility
window.HexUtils = HexUtils;