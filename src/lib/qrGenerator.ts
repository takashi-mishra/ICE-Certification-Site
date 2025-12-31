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
      const payload = (() => {
        const raw = JSON.stringify(studentOrId);
        try {
          // dynamic import so the dependency is optional at runtime during development
          // and to avoid bundling issues in some setups
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const LZString = require("lz-string");
          return encodeURIComponent(LZString.compressToEncodedURIComponent(raw));
        } catch {
          try {
            return encodeURIComponent(btoa(raw));
          } catch {
            // Handle unicode by encoding to UTF-8 bytes first
            const str = raw;
            const bytes = new TextEncoder().encode(str);
            let binary = "";
            for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
            return encodeURIComponent(btoa(binary));
          }
        }
      })();

      // Use fragment/hash so servers/proxies don't treat the long payload as part of the request URL
      verifyUrl = `${window.location.origin}/verify/${studentOrId.id}#data=${payload}`;
    } catch (err) {
      // Fallback to basic verify URL on error
      verifyUrl = `${window.location.origin}/verify/${studentOrId.id}`;
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
    console.error("Error generating QR code:", error);
    return "";
  }
};
