import Cart from "../models/cart.js";
import Product from "../models/product.js";
import Coupon from "../models/coupon.js";

const calculateCartTotals = (items, couponDiscount = 0) => {
  const subtotal = items.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  const gst = subtotal * 0.18; // 18% GST
  const discount = (subtotal * couponDiscount) / 100;
  const total = subtotal + gst - discount;

  return { subtotal, gst, discount, total };
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.populate("items.product");
    const totals = calculateCartTotals(cart.items);
    Object.assign(cart, totals);

    await cart.save();

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity cannot be less than 0",
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await Product.findById(productId);
      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock",
        });
      }
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.populate("items.product");
    const totals = calculateCartTotals(cart.items);
    Object.assign(cart, totals);

    await cart.save();
    const items = cart?.items?.map((item) => ({
      product: {
        ...item.product._doc,
        image: item.product.images[0]?.url,
      },
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      cart: {
        ...cart._doc,
        items,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const coupon = await Coupon.findOne({
      code,
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() },
    });

    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired coupon",
      });
    }

    if (cart.subtotal < coupon.minCartValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum cart value of ${coupon.minCartValue} required`,
      });
    }

    cart.coupon = coupon._id;
    await cart.populate("items.product");
    const totals = calculateCartTotals(cart.items, coupon.discountPercentage);
    Object.assign(cart, totals);

    await cart.save();

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product")
      .populate("coupon");

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const items = cart.items.map((item) => ({
      product: {
        ...item.product._doc,
        image: item.product.images[0]?.url,
      },
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      cart: {
        ...cart._doc,
        items,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
