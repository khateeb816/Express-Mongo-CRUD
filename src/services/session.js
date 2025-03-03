import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now, expires: '1d' } // Auto-delete after 1 day
});

const Session = mongoose.model("Session", sessionSchema);

export async function setUser(sessionId, user) {
    await Session.create({ sessionId, userId: user._id });
}

export async function getUser(sessionId) {
    const session = await Session.findOne({ sessionId }).populate("userId");
    return session ? session.userId : null;
}
