import mongoose from "mongoose"
import Auth from "./authModel.js"

const websiteSchema = mongoose.Schema(
  {
    website: {
      type: String,
      required: true,
      unique: true
    },
    auths: [{
      type: mongoose.SchemaTypes.ObjectId,
      ref: Auth
    }]
  },
  {
    statics: {
      async addNewAuth(website, email, password) {
        const auth = await Auth.addNew( email, password );
        const foundWebsite = await this.findOne({ website });
        if (foundWebsite) {
          foundWebsite.auths.push(auth._id);
          return foundWebsite.save();
        } else {
          return await this.create({ website, auths: [auth._id] })
        }
      },
      async deleteAll(website_id) {
        const website = await this.findById(website_id);
        website.auths.forEach(async e => {
          await Auth.deleteOne(e._id)
        });
        await this.findByIdAndDelete(website_id);
      }
    }
  }
);

const Website = mongoose.model("Website", websiteSchema)

export default Website
