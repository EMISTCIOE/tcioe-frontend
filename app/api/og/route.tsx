import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get("title") || "Thapathali Campus";
    const subtitle = searchParams.get("subtitle") || "IOE Engineering College";
    const type = searchParams.get("type") || "default";

    // Different templates based on type
    const getTemplate = () => {
      switch (type) {
        case "department":
          return (
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#1e40af",
                backgroundImage:
                  "linear-gradient(45deg, #1e40af 0%, #3b82f6 100%)",
                fontSize: 32,
                fontWeight: 600,
                color: "white",
                padding: "80px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 40,
                  left: 40,
                  display: "flex",
                  alignItems: "center",
                  fontSize: 24,
                  fontWeight: 400,
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: "white",
                    borderRadius: "50%",
                    marginRight: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#1e40af",
                    fontSize: 24,
                    fontWeight: 700,
                  }}
                >
                  IOE
                </div>
                Thapathali Campus
              </div>

              <div
                style={{
                  textAlign: "center",
                  marginBottom: 20,
                  fontSize: 56,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  maxWidth: "80%",
                }}
              >
                {title}
              </div>

              {subtitle && (
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 400,
                    opacity: 0.9,
                    textAlign: "center",
                  }}
                >
                  {subtitle}
                </div>
              )}

              <div
                style={{
                  position: "absolute",
                  bottom: 40,
                  right: 40,
                  fontSize: 20,
                  opacity: 0.8,
                }}
              >
                tcioe.edu.np
              </div>
            </div>
          );

        case "event":
          return (
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#059669",
                backgroundImage:
                  "linear-gradient(45deg, #059669 0%, #10b981 100%)",
                fontSize: 32,
                fontWeight: 600,
                color: "white",
                padding: "80px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 40,
                  left: 40,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  padding: "12px 24px",
                  borderRadius: 25,
                  fontSize: 20,
                  fontWeight: 500,
                }}
              >
                📅 Event
              </div>

              <div
                style={{
                  textAlign: "center",
                  marginBottom: 20,
                  fontSize: 48,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  maxWidth: "80%",
                }}
              >
                {title}
              </div>

              {subtitle && (
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 400,
                    opacity: 0.9,
                    textAlign: "center",
                  }}
                >
                  {subtitle}
                </div>
              )}

              <div
                style={{
                  position: "absolute",
                  bottom: 40,
                  left: 40,
                  display: "flex",
                  alignItems: "center",
                  fontSize: 20,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "white",
                    borderRadius: "50%",
                    marginRight: 15,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#059669",
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  TC
                </div>
                Thapathali Campus
              </div>
            </div>
          );

        default:
          return (
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#1f2937",
                backgroundImage:
                  "linear-gradient(45deg, #1f2937 0%, #374151 50%, #4b5563 100%)",
                fontSize: 32,
                fontWeight: 600,
                color: "white",
                padding: "80px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 8,
                  backgroundColor: "#1e40af",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 40,
                  fontSize: 28,
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    backgroundColor: "#1e40af",
                    borderRadius: "50%",
                    marginRight: 25,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                >
                  IOE
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>
                    Thapathali Campus
                  </div>
                  <div style={{ fontSize: 18, opacity: 0.8, fontWeight: 400 }}>
                    Institute of Engineering
                  </div>
                </div>
              </div>

              <div
                style={{
                  textAlign: "center",
                  marginBottom: 20,
                  fontSize: title.length > 50 ? 40 : 52,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  maxWidth: "85%",
                }}
              >
                {title}
              </div>

              {subtitle && (
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 400,
                    opacity: 0.9,
                    textAlign: "center",
                    maxWidth: "80%",
                  }}
                >
                  {subtitle}
                </div>
              )}

              <div
                style={{
                  position: "absolute",
                  bottom: 40,
                  right: 40,
                  fontSize: 18,
                  opacity: 0.7,
                }}
              >
                tcioe.edu.np
              </div>
            </div>
          );
      }
    };

    return new ImageResponse(getTemplate(), {
      width: 1200,
      height: 630,
    });
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
