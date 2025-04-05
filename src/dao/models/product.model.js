import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: [String] }
});

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model('product', productSchema);

export default ProductModel;