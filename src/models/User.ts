import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs'
import { IUser } from "../interfaces/IUser";
import { version } from "os";

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please fill a valid email address'],
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false, //exclude password from queries by default
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Hash password before saving
userSchema.pre<IUser>('save', async function (next) {
    if(!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();        
    } catch (error) {
        next(error as Error);
    }
});

//compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
}

export default model<IUser>('User', userSchema);