"use client";
import { PricingVariantProps } from "./types";
export default function PricingV4({ heading, tiers }: PricingVariantProps) {
  return (
    <div style={{ background: "var(--dark, #111)", color: "#fff", padding: "80px 0" }}>
      <div className="container">
        <h2 style={{ textAlign: "center", fontSize: "2rem", color: "var(--accent, #D4AF37)", marginBottom: 32, fontFamily: "var(--font, serif)" }}>{heading}</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", maxWidth: 560, margin: "0 auto" }}>
          <tbody>
            {tiers.map((t, i) => (
              <tr key={i}>
                <td style={{ padding: "14px 0", borderBottom: "1px solid #333" }}>{t.name}</td>
                <td style={{ padding: "14px 0", borderBottom: "1px solid #333", textAlign: "right", color: "var(--accent, #D4AF37)", fontWeight: 700 }}>{t.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}