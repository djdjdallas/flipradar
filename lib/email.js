import { Resend } from 'resend'

let _resend = null
function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

export async function sendDealAlertEmail({ to, filterKeywords, listingTitle, listingPrice, estimatedProfit, listingUrl }) {
  const profitDisplay = estimatedProfit != null
    ? `$${Number(estimatedProfit).toFixed(2)}`
    : 'N/A'

  const priceDisplay = listingPrice != null
    ? `$${Number(listingPrice).toFixed(2)}`
    : 'N/A'

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#F8F4E8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <!-- Header -->
    <div style="background-color:#09090B;padding:20px 24px;border:3px solid #09090B;">
      <h1 style="margin:0;color:#D2E823;font-size:22px;font-weight:800;letter-spacing:1px;">
        FLIPCHECKER
      </h1>
    </div>

    <!-- Body -->
    <div style="background-color:#FFFFFF;border:3px solid #09090B;border-top:none;padding:24px;">
      <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#09090B99;">
        Deal Alert
      </p>
      <h2 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#09090B;">
        ${escapeHtml(listingTitle)}
      </h2>

      <!-- Stats -->
      <div style="display:flex;gap:12px;margin-bottom:20px;">
        <div style="flex:1;background:#F8F4E8;border:2px solid #09090B;padding:12px;">
          <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;color:#09090B99;">Price</p>
          <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#09090B;">${priceDisplay}</p>
        </div>
        <div style="flex:1;background:#D2E823;border:2px solid #09090B;padding:12px;">
          <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;color:#09090B99;">Est. Profit</p>
          <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#09090B;">${profitDisplay}</p>
        </div>
      </div>

      <p style="margin:0 0 16px;font-size:14px;color:#09090B99;">
        Matched your filter: <strong style="color:#09090B;">${escapeHtml(filterKeywords)}</strong>
      </p>

      <!-- CTA -->
      <a href="${escapeHtml(listingUrl)}" style="display:inline-block;background-color:#09090B;color:#D2E823;padding:12px 24px;font-size:14px;font-weight:700;text-decoration:none;border:3px solid #09090B;">
        View Listing
      </a>
    </div>

    <!-- Footer -->
    <div style="padding:16px 0;text-align:center;">
      <p style="margin:0;font-size:12px;color:#09090B99;">
        You're receiving this because you have email alerts enabled in
        <a href="https://www.flipchecker.io/dashboard/settings" style="color:#09090B;">FlipChecker settings</a>.
      </p>
    </div>
  </div>
</body>
</html>`

  return getResend().emails.send({
    from: 'FlipChecker Alerts <alerts@flipchecker.io>',
    to,
    subject: `Deal Alert: ${listingTitle.substring(0, 60)}`,
    html
  })
}

function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
