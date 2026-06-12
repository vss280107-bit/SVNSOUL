const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    await seedData();
  } catch (err) {
    console.error('DB connection error:', err.message);
    process.exit(1);
  }
};

async function seedData() {
  const Product = require('./models/Product');
  const User = require('./models/User');
  const count = await Product.countDocuments();
  if (count > 0) return;

  console.log('Seeding database...');

  // Create admin user
  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists) {
    await User.create({
      name: 'SVN Admin', email: 'admin@svnsoul.in', password: 'admin123', role: 'admin'
    });
    console.log('Admin created: admin@svnsoul.in / admin123');
  }

  const products = [
    {
      name: 'Void Oversized Tee', category: 'tops', price: 1299, originalPrice: 1799,
      description: 'Ultra-soft 280GSM cotton blend. Dropped shoulders. Pre-washed for that worn-in feel from day one. Unisex fit runs true to size.',
      images: [{ url: '/images/tee-front.jpg', angle: 'front' }, { url: '/images/tee-back.jpg', angle: 'back' }],
      variants: [
        { size: 'S', color: 'Jet Black', colorHex: '#0d0d0d', stock: 12 },
        { size: 'M', color: 'Jet Black', colorHex: '#0d0d0d', stock: 18 },
        { size: 'L', color: 'Jet Black', colorHex: '#0d0d0d', stock: 10 },
        { size: 'XL', color: 'Jet Black', colorHex: '#0d0d0d', stock: 6 },
        { size: 'S', color: 'Ash Grey', colorHex: '#3a3a3a', stock: 8 },
        { size: 'M', color: 'Ash Grey', colorHex: '#3a3a3a', stock: 14 },
        { size: 'L', color: 'Ash Grey', colorHex: '#3a3a3a', stock: 7 },
        { size: 'XL', color: 'Ash Grey', colorHex: '#3a3a3a', stock: 4 },
      ],
      tags: ['bestseller'], isFeatured: true,
    },
    {
      name: 'Eclipse Cargo Pants', category: 'bottoms', price: 2799, originalPrice: 3499,
      description: 'Technical ripstop with 8 functional pockets. YKK zippers throughout. Articulated knees for full range of motion. Straight fit.',
      images: [{ url: '/images/cargo-front.jpg', angle: 'front' }],
      variants: [
        { size: '28', color: 'Jet Black', colorHex: '#0d0d0d', stock: 6 },
        { size: '30', color: 'Jet Black', colorHex: '#0d0d0d', stock: 10 },
        { size: '32', color: 'Jet Black', colorHex: '#0d0d0d', stock: 8 },
        { size: '34', color: 'Jet Black', colorHex: '#0d0d0d', stock: 4 },
        { size: '30', color: 'Smoke', colorHex: '#2d2d2d', stock: 6 },
        { size: '32', color: 'Smoke', colorHex: '#2d2d2d', stock: 5 },
      ],
      tags: ['new'], isFeatured: true,
    },
    {
      name: 'Phantom Hoodie', category: 'tops', price: 2199, originalPrice: 2799,
      description: '400GSM heavyweight French terry fleece. Kangaroo pocket with hidden zip. Ribbed hem and cuffs. Unisex boxy cut.',
      images: [{ url: '/images/hoodie-front.jpg', angle: 'front' }],
      variants: [
        { size: 'S', color: 'Void Black', colorHex: '#111111', stock: 8 },
        { size: 'M', color: 'Void Black', colorHex: '#111111', stock: 15 },
        { size: 'L', color: 'Void Black', colorHex: '#111111', stock: 12 },
        { size: 'XL', color: 'Void Black', colorHex: '#111111', stock: 6 },
        { size: 'XXL', color: 'Void Black', colorHex: '#111111', stock: 3 },
        { size: 'M', color: 'Concrete', colorHex: '#555555', stock: 7 },
        { size: 'L', color: 'Concrete', colorHex: '#555555', stock: 5 },
      ],
      tags: ['bestseller', 'new'], isFeatured: true,
    },
    {
      name: 'Ash Bomber Jacket', category: 'outerwear', price: 4499, originalPrice: 5999,
      description: 'Satin shell with quilted lining. Snap button closure with zip underlayer. Two front pockets, one chest pocket. Slim relaxed fit.',
      images: [{ url: '/images/bomber-front.jpg', angle: 'front' }],
      variants: [
        { size: 'S', color: 'Midnight', colorHex: '#1a1a1a', stock: 4 },
        { size: 'M', color: 'Midnight', colorHex: '#1a1a1a', stock: 6 },
        { size: 'L', color: 'Midnight', colorHex: '#1a1a1a', stock: 5 },
        { size: 'XL', color: 'Midnight', colorHex: '#1a1a1a', stock: 3 },
      ],
      tags: ['limited'], isFeatured: false,
    },
    {
      name: 'Lunar Joggers', category: 'bottoms', price: 1799, originalPrice: 2299,
      description: 'French terry cotton blend. Elastic waistband with internal drawstring. Tapered fit. Deep side pockets. Ribbed ankle cuffs.',
      images: [{ url: '/images/jogger-front.jpg', angle: 'front' }],
      variants: [
        { size: 'XS', color: 'Jet Black', colorHex: '#0d0d0d', stock: 5 },
        { size: 'S', color: 'Jet Black', colorHex: '#0d0d0d', stock: 10 },
        { size: 'M', color: 'Jet Black', colorHex: '#0d0d0d', stock: 14 },
        { size: 'L', color: 'Jet Black', colorHex: '#0d0d0d', stock: 9 },
        { size: 'XL', color: 'Jet Black', colorHex: '#0d0d0d', stock: 5 },
        { size: 'M', color: 'Ash Grey', colorHex: '#3a3a3a', stock: 8 },
        { size: 'L', color: 'Ash Grey', colorHex: '#3a3a3a', stock: 6 },
      ],
      tags: [], isFeatured: true,
    },
    {
      name: 'Noir Crewneck', category: 'tops', price: 1599, originalPrice: 1999,
      description: '350GSM mid-weight fleece. Boxy relaxed silhouette. Embroidered tonal SVN logo at chest. Pre-washed and garment-dyed.',
      images: [{ url: '/images/crew-front.jpg', angle: 'front' }],
      variants: [
        { size: 'XS', color: 'Void Black', colorHex: '#0d0d0d', stock: 4 },
        { size: 'S', color: 'Void Black', colorHex: '#0d0d0d', stock: 8 },
        { size: 'M', color: 'Void Black', colorHex: '#0d0d0d', stock: 12 },
        { size: 'L', color: 'Void Black', colorHex: '#0d0d0d', stock: 9 },
        { size: 'XL', color: 'Void Black', colorHex: '#0d0d0d', stock: 5 },
      ],
      tags: [], isFeatured: false,
    },
    {
      name: 'Shadow Cap', category: 'accessories', price: 799, originalPrice: 999,
      description: '6-panel structured cap. Embroidered SVN logo in tonal thread. Adjustable snapback closure. One size fits most.',
      images: [{ url: '/images/cap-front.jpg', angle: 'front' }],
      variants: [
        { size: 'ONE SIZE', color: 'Jet Black', colorHex: '#0d0d0d', stock: 20 },
        { size: 'ONE SIZE', color: 'Ash Grey', colorHex: '#3a3a3a', stock: 15 },
      ],
      tags: ['new'], isFeatured: false,
    },
    {
      name: 'Dusk Track Jacket', category: 'outerwear', price: 3299, originalPrice: 3999,
      description: 'Tricot polyester with contrast side taping. Full zip with ribbed stand collar. Two zip side pockets. Slim athletic fit.',
      images: [{ url: '/images/track-front.jpg', angle: 'front' }],
      variants: [
        { size: 'S', color: 'Jet Black', colorHex: '#0d0d0d', stock: 5 },
        { size: 'M', color: 'Jet Black', colorHex: '#0d0d0d', stock: 8 },
        { size: 'L', color: 'Jet Black', colorHex: '#0d0d0d', stock: 6 },
        { size: 'XL', color: 'Jet Black', colorHex: '#0d0d0d', stock: 4 },
      ],
      tags: ['limited'], isFeatured: true,
    },
  ];

  await Product.insertMany(products);
  console.log('Products seeded successfully');
}

module.exports = connectDB;
