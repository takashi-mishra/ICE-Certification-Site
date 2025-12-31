import QRCode from "qrcode";
import type { Student } from "@/types/student";

export const generateQRCode = async (
  studentOrId: string | Student,
  size = 300
): Promise<string> => {
  // If a full student object is passed, embed it as base64 in the verify URL so
  // verification can happen on any device without relying on localStorage.
  let verifyUrl: string;

  if (typeof studentOrId === "string") {
    // Simple ID link (no embedded payload)
    verifyUrl = `${window.location.origin}/verify/${studentOrId}`;
  } else {
    try {
      // Try to compress the payload using lz-string to reduce QR density. Fall back to base64 if not available.
      const raw = JSON.stringify(studentOrId);
      let payload: string | null = null;

      try {
        // dynamic import so the dependency is optional at runtime and to avoid bundling issues
        const mod = await import("lz-string");
        const LZString = (mod && (mod.default ?? mod)) as any;
        if (LZString && typeof LZString.compressToEncodedURIComponent === "function") {
          payload = encodeURIComponent(LZString.compressToEncodedURIComponent(raw));
        }
      } catch (err) {
        // dynamic import failed; we'll fall back to base64
        console.debug("lz-string not available, falling back to base64");
      }

      if (!payload) {
        try {
          payload = encodeURIComponent(btoa(raw));
        } catch {
          // Handle unicode by encoding to UTF-8 bytes first
          const str = raw;
          const bytes = new TextEncoder().encode(str);
          let binary = "";
          for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
          payload = encodeURIComponent(btoa(binary));
        }
      }

      // Use fragment/hash so servers/proxies don't treat the long payload as part of the request URL
      verifyUrl = `${window.location.origin}/verify/${studentOrId.id}#data=${payload}`;
    } catch (err) {
      // Fallback to basic verify URL on error
      console.error("Failed to build QR payload:", err);
      verifyUrl = `${window.location.origin}/verify/${(studentOrId as Student).id}`;
    }
  }

  try {
      // Increase size and error correction for dense payloads so scanners can reliably decode
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        width: size,
        margin: 4,
        errorCorrectionLevel: "H",
        color: {
          dark: "#1a1a2e",
          light: "#ffffff",
        },
      });
      return qrDataUrl;
    } catch (error) {
      // If dense payload made QR generation fail, try a simpler short URL QR as a fallback
      console.error("Error generating QR code with payload, falling back to short URL:", error);
      try {
        const fallbackUrl = `${window.location.origin}/verify/${typeof studentOrId === "string" ? studentOrId : (studentOrId as Student).id}`;
        const fallbackQr = await QRCode.toDataURL(fallbackUrl, {
          width: Math.max(200, size / 2),
          margin: 4,
          errorCorrectionLevel: "M",
        });
        return fallbackQr;
      } catch (err2) {
        console.error("Fallback QR generation also failed:", err2);
        return "";
      }
    }
};
