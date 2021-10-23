import mongoose from "../../database";
import Slugify from "../../utils/Slugify";

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        unique: true
    },
    slug: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        require: true
    },
    /* images: [
        {
            type: String,
            require: true
        }
    ], */
    createAt: {
        type: Date,
        default: Date.now
    }
});

ProjectSchema.pre('save', function (next) {
    const title = this.title;
    this.slug = Slugify(title);
    next();
})

export default mongoose.model('Project', ProjectSchema);