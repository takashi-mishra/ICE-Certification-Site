import QRCode from "qrcode";

export const generateQRCode = async (studentId: string): Promise<string> => {
  const verifyUrl = `${window.location.origin}/verify/${studentId}`;
  
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
