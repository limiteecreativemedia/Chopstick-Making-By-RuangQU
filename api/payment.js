export default async function handler(req, res) {
  // Hanya menerima method POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { bookingId, customerName, customerEmail, customerPhone, amount, description } = req.body;

  try {
    // Panggil API Resmi Mayar dari server Vercel (API Key tersembunyi dengan aman)
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
        redirectUrl: `${req.headers.origin || 'https://limitecreativemedia.github.io/Chopstick-Making-By-RuangQU'}/?booking_id=${bookingId}&status=success`
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
