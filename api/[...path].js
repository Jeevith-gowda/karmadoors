export default async function handler(req, res) {
  const { path = [], ...queryParams } = req.query;
  const pathStr = path.join("/");
  const qs = new URLSearchParams(queryParams).toString();
  const target = `https://app.doorloop.com/api/${pathStr}${qs ? `?${qs}` : ""}`;

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers: {
        Authorization: `Bearer ${process.env.DOORLOOP_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const body = await upstream.text();
    res
      .status(upstream.status)
      .setHeader(
        "Content-Type",
        upstream.headers.get("content-type") || "application/json"
      )
      .end(body);
  } catch (err) {
    res.status(502).json({ error: "Proxy error", message: err.message });
  }
}
