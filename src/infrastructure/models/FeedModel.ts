import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFeed extends Document {
  title: string;
  description?: string;
  author?: string;
  journal: string;
  link: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema for the Feed collection
const FeedSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: 'No description',
    },
    author: {
      type: String,
      default: 'Unknown',
    },
    journal: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^https?:\/\/.+\..+/i.test(v),
        message: (props: { value: string }) => `${props.value} is not a valid URL!`,
      },
    },
  },
  { timestamps: true }
);

// Create an index on the updatedAt field for better performance
FeedSchema.index({ updatedAt: 1 });

// Define the Feed model
export const FeedModel: Model<IFeed> = mongoose.model<IFeed>('Feed', FeedSchema);
