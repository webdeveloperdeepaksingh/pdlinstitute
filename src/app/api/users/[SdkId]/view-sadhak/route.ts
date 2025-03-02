import { NextResponse, NextRequest } from "next/server";
import Users from "../../../../../../modals/Users";
import dbConnect from "../../../../../../dbConnect";

interface ISdkParams{
    SdkId?: string;
}

export async function GET(req:NextRequest, {params}:{params:ISdkParams}){
  try 
    {
      await dbConnect();
      let sdkById = await Users.findById(params.SdkId);

      if(!sdkById){
        return NextResponse.json({success:false, msg: "No Sadhak found." }, { status: 404 });
      }else{
        sdkById.sdkPwd = undefined;
        return NextResponse.json({ sdkById, success: true }, {status:200});
      }
    } catch (error) {
      return new NextResponse("Error while fetching sdkData: " + error, {status:500});
    }
  }

