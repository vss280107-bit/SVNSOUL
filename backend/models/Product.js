const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  colorHex: { type: String, default: '#1a1a1a' },
  stock: { type: Number, default: 0, min: 0 },
  sku: String,
});

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  images: [String],
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['tops', 'bottoms', 'outerwear', 'accessories'] },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },
  images: [{ url: String, angle: String }],
  variants: [variantSchema],
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  tags: [String],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

productSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  if (this.reviews.length > 0) {
    this.rating = this.reviews.reduce((s, r) => s + r.rating, 0) / this.reviews.length;
    this.reviewCount = this.reviews.length;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
