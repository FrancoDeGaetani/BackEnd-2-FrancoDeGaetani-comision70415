import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import CartModel from './cart.model.js';

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' },
    role: { type: String, 
            enum: ["admin", "user"], 
            default: "user" }
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
    next();
});

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const UserModel = mongoose.model('User', userSchema);
export default UserModel;