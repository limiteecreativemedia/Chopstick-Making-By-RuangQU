export default async function handler(req, res) {
  // Mengizinkan panggilan dari domain GitHub Pages
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { bookingId, customerName, customerEmail, customerPhone, amount, description } = req.body;

  try {
    const response = await fetch('https://api.mayar.id/hl/v1/payment/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MAYAR_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: customerName,
        email: customerEmail || `${customerPhone}@ruangqu.com`,
        mobileVia: customerPhone,
        amount: Number(amount),
        description: description || `Booking Chopstick Class - ${bookingId}`,
        redirectUrl: `https://limitecreativemedia.github.io/Chopstick-Making-By-RuangQU/?booking_id=${bookingId}&status=success`
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
