// Email design that matches the portfolio: black background, cyan script
// heading, cyan -> green -> yellow gradient text, outlined transparent boxes,
// pill labels and a solid cyan button.

const CYAN = "#5ce1e6";
const BORDER = "#17444b";
const TEXT = "#ffffff";
const MUTED = "#a3acb8";
const FONT = "'Space Grotesk','Segoe UI',Arial,sans-serif";
const SCRIPT = "'Allura','Segoe Script','Brush Script MT',cursive";

// Makes visitor text safe to put inside HTML (stops people injecting code)
const escapeHtml = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const SUBJECT_EMOJI = {
  "Job Opportunity": "💼",
  "Project / Freelance": "🚀",
  Collaboration: "🤝",
  "Just saying hi": "👋",
};

// Email apps don't support gradient text, so we colour each letter
// separately: cyan -> soft green -> yellow (same as the website headings).
const STOPS = [
  [92, 225, 230],
  [184, 217, 154],
  [242, 200, 91],
];
const lerp = (a, b, t) => Math.round(a + (b - a) * t);

const gradientText = (text) => {
  const chars = [...text];
  const last = Math.max(chars.length - 1, 1);
  return chars
    .map((ch, i) => {
      if (ch === " ") return " ";
      const pos = (i / last) * (STOPS.length - 1);
      const k = Math.min(Math.floor(pos), STOPS.length - 2);
      const f = pos - k;
      const c = STOPS[k].map((v, j) => lerp(v, STOPS[k + 1][j], f));
      return `<span style="color:rgb(${c.join(",")});">${escapeHtml(ch)}</span>`;
    })
    .join("");
};

const row = (label, valueHtml, first = false) => `
  <tr>
    <td style="padding:14px 0;width:110px;vertical-align:top;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${CYAN};${first ? "" : `border-top:1px solid ${BORDER};`}">${label}</td>
    <td style="padding:14px 0;font-size:16px;color:${TEXT};${first ? "" : `border-top:1px solid ${BORDER};`}">${valueHtml}</td>
  </tr>`;

const buildEmailHtml = ({ name, email, subject, message }) => {
  const n = escapeHtml(name);
  const e = escapeHtml(email);
  const s = escapeHtml(subject);
  const m = escapeHtml(message).replace(/\n/g, "<br>");
  const emoji = SUBJECT_EMOJI[subject] || "✉️";
  const time = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const replyLink = `mailto:${e}?subject=${encodeURIComponent("Re: " + subject)}`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <link href="https://fonts.googleapis.com/css2?family=Allura&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#000000;">
<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#000000" style="background:#000000;">
  <tr><td align="center" style="padding:36px 14px;">

    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;font-family:${FONT};">

      <!-- Top: logo + status -->
      <tr>
        <td style="padding:0 6px 26px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="font-family:${SCRIPT};font-size:42px;color:#ffffff;line-height:1;">R</td>
            <td align="right" style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${MUTED};">
              <span style="color:#22c55e;">&#9679;</span>&nbsp; Portfolio contact
            </td>
          </tr></table>
        </td>
      </tr>

      <!-- Heading -->
      <tr>
        <td align="center" style="padding:0 6px 6px;">
          <div style="font-family:${SCRIPT};font-size:54px;line-height:1.1;color:${CYAN};">New message</div>
          <div style="color:#facc15;font-size:12px;letter-spacing:10px;padding:4px 0 14px;">&#10022; &nbsp;&middot;&nbsp; &#10022;</div>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding:0 6px 8px;font-size:34px;font-weight:700;line-height:1.2;color:${TEXT};">
          ${emoji} You've got a new<br>${gradientText("message from " + name)}.
        </td>
      </tr>
      <tr>
        <td align="center" style="padding:0 20px 28px;font-size:15px;line-height:1.6;color:${MUTED};">
          Someone filled out the form on your portfolio. Here are the details.
        </td>
      </tr>

      <!-- Details box (transparent, outlined) -->
      <tr>
        <td style="padding:0 0 18px;">
          <table width="100%" cellpadding="0" cellspacing="0"
            style="border:1px solid ${BORDER};border-radius:16px;background:transparent;">
            <tr><td style="padding:10px 26px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${row("Name", `<strong>${n}</strong>`, true)}
                ${row("Email", `<a href="mailto:${e}" style="color:${CYAN};text-decoration:none;">${e}</a>`)}
                ${row("Subject", `<span style="display:inline-block;border:1px solid ${CYAN};color:${CYAN};padding:4px 14px;border-radius:999px;font-size:13px;">${s}</span>`)}
                ${row("Sent", `${time} <span style="color:${MUTED};font-size:13px;">(IST)</span>`)}
              </table>
            </td></tr>
          </table>
        </td>
      </tr>

      <!-- Message box -->
      <tr>
        <td style="padding:0 0 26px;">
          <table width="100%" cellpadding="0" cellspacing="0"
            style="border:1px solid ${BORDER};border-radius:16px;background:transparent;">
            <tr><td style="padding:22px 26px;">
              <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${CYAN};padding-bottom:12px;">Message</div>
              <div style="font-size:17px;line-height:1.75;color:#e5e7eb;">${m}</div>
            </td></tr>
          </table>
        </td>
      </tr>

      <!-- Reply button -->
      <tr>
        <td align="center" style="padding:0 0 34px;">
          <a href="${replyLink}"
            style="display:inline-block;background:${CYAN};color:#031018;font-weight:700;font-size:16px;text-decoration:none;padding:16px 44px;border-radius:10px;">
            Reply to ${n} &#8599;
          </a>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td align="center" style="border-top:1px solid ${BORDER};padding:22px 10px 0;font-size:12px;line-height:1.8;color:${MUTED};">
          <span style="letter-spacing:2px;text-transform:uppercase;font-style:italic;">Good ideas always lead to great conversations</span><br>
          Designed &amp; built by <span style="color:${CYAN};"></span> &#9829; &nbsp;&middot;&nbsp; &copy; 2026
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
};

module.exports = { buildEmailHtml, escapeHtml, SUBJECT_EMOJI };