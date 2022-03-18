import CartModel from "../models/cart-models.js";
import Products from "../models/product-models.js";


const addToCart = async (req, res) => {
    const { userid, storeid, productid } = req.params
    const { productname, qty, unit, amount } = await Products.findOne({ _id: productid })
    const userCart = await CartModel.findOne({ userid: userid })
    // console.log(userCart);
    if (userCart) {
        if (userCart.storeid == storeid) {
            let item = await CartModel.findOne({ storeid: userCart.storeid, cartitems: { $elemMatch: { productid: productid } } })
            if (item) {
                res.status(409).json({ message: "item already exists" })
            } else {
                userCart.cartitems.push({ productid, productname, qty, unit, noofitems: 1, producttotal: amount })
                const cart = await userCart.save()
                res.status(200).json(cart)
            }
        } else {
            res.status(409).json({ message: 'other store exists : clear cart' })
        }
    } else {
        const newCartItem = new CartModel({
            userid,
            storeid,
            cartitems: [{
                productid, productname, qty, unit, noofitems: 1, producttotal: amount
            }]
        })
        const cartitem = await newCartItem.save()
        res.status(200).json(cartitem)
    }
}

const getAllCartItems = async (req, res) => {
    const { userid } = req.params
    try {
        const userCart = await CartModel.findOne({ userid: userid }, { cartitems: 1, _id: 0 })
        if (userCart) {
            res.status(200).json(userCart.cartitems);
        } else {
            res.status(404).json({ message: 'cart empty' })
        }
    } catch (error) {
        res.status(404).json({ message: 'cart empty' })
    }

}
export {
    addToCart,
    getAllCartItems
}

