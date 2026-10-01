const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST only" });
    return;
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(500).json({ error: "Add STRIPE_SECRET_KEY on Vercel, then redeploy." });
    return;
  }
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const origin = req.headers.origin || "https://open-lane-desk.vercel.app";
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: origin + "/jobs.html?paid=1",
    cancel_url: origin + "/jobs.html?paid=0",
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: 1499,
        product_data: {
          name: "Open Lane employer packet",
          description: (body.title || "One job") + " — résumé and letter PDF. Not a work permit."
        }
      }
    }],
    metadata: { jobId: String(body.jobId || ""), title: String(body.title || "") }
  });
  res.status(200).json({ url: session.url });
};
