import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required']
  },
  images: [{
    url: String,
    public_id: String
  }],
  category: {
    type: String,
    required: [true, 'Product category is required']
  },
  stock: {
    type: Number,
    required: [true, 'Product stock is required'],
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Product', productSchema);