import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
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
          borderRadius: "4px",
        }}
      >
        <span
          style={{
            fontFamily: "Dela Gothic One",
            fontSize: 18,
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
