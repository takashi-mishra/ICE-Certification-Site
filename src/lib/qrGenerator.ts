import QRCode from "qrcode";
import type { Student } from "@/types/student";

export const generateQRCode = async (studentOrId: string | Student): Promise<string> => {
  // If a full student object is passed, embed it as base64 in the verify URL so
  // verification can happen on any device without relying on localStorage.
  let verifyUrl: string;

  if (typeof studentOrId === "string") {
    verifyUrl = `${window.location.origin}/verify/${studentOrId}`;
  } else {
    try {
      const payload = (() => {
        try {
          return encodeURIComponent(btoa(JSON.stringify(studentOrId)));
        } catch {
          // Handle unicode by encoding to UTF-8 bytes first
          const str = JSON.stringify(studentOrId);
          const bytes = new TextEncoder().encode(str);
          let binary = "";
          for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
          return encodeURIComponent(btoa(binary));
        }
      })();
      verifyUrl = `${window.location.origin}/verify/${studentOrId.id}?data=${payload}`;
    } catch (err) {
      // Fallback to basic verify URL on error
      verifyUrl = `${window.location.origin}/verify/${studentOrId.id}`;
    }
  }

  try {
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 150,
      margin: 2,
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
