import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const fontData = await readFile(
    join(process.cwd(), "public/fonts/DelaGothicOne-Regular.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090B",
          borderRadius: "22px",
        }}
      >
        <span
          style={{
            fontFamily: "Dela Gothic One",
            fontSize: 100,
            color: "#D2E823",
            lineHeight: 1,
          }}
        >
          FC
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Dela Gothic One",
          data: fontData,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
