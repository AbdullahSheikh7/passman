import mongoose from "mongoose"

const authSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    statics: {
      async addNew(email, password) {
        return await this.create({ email, password });
      },
      async updateOne(id, email, password) {
        return await this.findByIdAndUpdate(id, {$set:{ email, password }});
      },
      async deleteOne(id, email, password) {
        return await this.findByIdAndDelete(id);
      },
    }
  }
);

const Auth = mongoose.model("Auth", authSchema)

export default Auth
