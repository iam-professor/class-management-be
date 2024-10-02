import { model, Schema } from "mongoose";


export interface IActivities {
    _id:string;
    activityName:string;
    steps:string[];
    expectedOutCome:string[];
    teacher: Schema.Types.ObjectId;
}

const activitySchema = new Schema<IActivities>(
    {
        activityName:{
            type:String,
            required:true
        },
        steps:{
            type:[String]
        },
        expectedOutCome:{
            type:[String]
        },
        teacher:{
            type:Schema.Types.ObjectId,
            ref:"teachers",
            required:true
        }
    }
)
const Activity = model<IActivities>("activities", activitySchema);

export default Activity;