import { Schema, model } from 'mongoose';
import { Student } from './student.model';
import { Attendance } from './attendance.model';

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'staff', 'student'], required: true },
});

userSchema.pre('findOneAndDelete', async function (next) {
    const user: any = await this.model.findOne(this.getFilter());

    if (!user) return next();


    if (user.role === 'student') {
        await Attendance.deleteMany({ student: user._id });
        await Student.deleteOne({ _id: user._id });
    }

    next();
});

export const User = model('User', userSchema);