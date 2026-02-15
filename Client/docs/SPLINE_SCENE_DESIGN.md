# Web3 Security Spline 3D Scene Design

## Overview
This document outlines the design and interaction specifications for the 3D Hero scene in the Web3 Security Scanner application. The scene serves as the visual centerpiece, representing the "digital shield" protecting user assets.

## Scene Composition

### 1. Central Element: The Digital Shield
*   **Object**: A stylized, semi-transparent icosahedron or shield shape.
*   **Material**: Glass/Crystal with high roughness and refraction.
*   **Color**:
    *   Base: Deep Violet/Blue (matching site theme).
    *   Rim/Edges: Neon glowing edges (Cyan).
*   **Interior**: Floating inside the shield is a stylized "Coin" or "Wallet" object (gold/metallic) representing the asset being protected.

### 2. Background Elements: The Network
*   **Objects**: Scattered floating cubes or spheres connected by thin glowing lines (splines).
*   **Motion**: Very slow, drifting rotation to simulate a decentralized network.
*   **Lighting**:
    *   Main Light: Top-left, Cool Blue (Cyberpunk feel).
    *   Rim Light: Bottom-right, Hot Pink (Accent).
    *   Ambient: Low intensity, dark purple.

## Interaction States (Variables)

The scene responds to user actions via Spline Variables or State Events.

| State | Trigger | Visual Behavior |
| :--- | :--- | :--- |
| **Idle** | Default | Shield floats gently (Sine wave Y-axis). Network background drifts slowly. |
| **Hover** | Mouse over scene | Shield rotates to face cursor slightly (Look At). Glow intensity increases. |
| **Scanning** | "Scan Now" Click | Shield spins faster. Color pulses between Cyan and White. |
| **Risk: High** | Result = High | Shield turns **Red**. Glass cracks or glitches. Inner coin shakes. |
| **Risk: Low** | Result = Low | Shield turns **Green**. A second protective layer expands. |

## Implementation Guide

1.  **Export**: Export the scene as a Public URL from Spline (e.g., `https://prod.spline.design/.../scene.splinecode`).
2.  **Integration**: Use `@splinetool/react-spline`.
3.  **Events**:
    *   Use `onLoad` to get the Spline Application instance.
    *   Use `spline.setVariable('riskLevel', 100)` to drive states if using variables.
    *   Or simply trigger named states like "Critical" or "Safe".

## Performance Constraints
*   **Polygon Count**: Keep under 50k triangles.
*   **Textures**: Use compressed textures (max 1024x1024).
*   **Shadows**: Soft shadows only on the main object; baked lighting for background.
