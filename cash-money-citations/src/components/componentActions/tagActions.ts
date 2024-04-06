import Tag from "@/models/Tag";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";
import CSLBibModel from "@/models/CSLBibTex";

export async function getTags() {
    await dbConnect();
  
    const result = await Tag.find({});
    const tags = result.map((doc) => {
      const tag = JSON.parse(JSON.stringify(doc));
      return tag;
    });
  
    return tags;
}


export async function getSingleTag(id: string) {
    try {
        let result = await Tag.findById(id);
        const parsedResult = JSON.parse(JSON.stringify(result));
        return parsedResult;
    } catch (error) {
        
    }
}

export async function getUserTags(userId: string) {
    await dbConnect();
  
    try {
      // Retrieve list of users tags
      const userOwnedTags = await User.findById(userId).select('ownedTags');
  
      const result = await Tag.find({
        // Find tags where _id matches userOwnedTags
        _id: { $in: userOwnedTags.ownedTags }
      });
      const tags = result.map((doc) => {
        const tag = JSON.parse(JSON.stringify(doc));
        return tag;
      });
    
      return tags;
    } catch(e) {
      console.error(e);
    }
  }