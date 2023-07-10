import mongoose from 'mongoose'

const connectDatabase = () => {
  console.log("Wait! connecting to your DB");

  mongoose.connect(process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err))
};

export default connectDatabase;
