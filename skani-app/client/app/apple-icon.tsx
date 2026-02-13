import { ImageResponse } from "next/og";
import { Package } from "lucide-react";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 120,
        background: "#050505",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#d98324",
        borderRadius: "40px",
      }}
    >
      <Package size={100} />
    </div>,
    { ...size },
  );
}
