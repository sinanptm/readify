import connectDB from "@/lib/db/connectDB";
import User from "@/lib/db/models/User";
import { getTokenDetailsServer } from "@/lib/utils/getTokenData";
import { ErrorMessage, StatusCode } from "@/types";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const tokenResult = await getTokenDetailsServer(req); 

        if (!tokenResult.success || !tokenResult.data) {
            return NextResponse.json(
                { error: tokenResult.error?.message ?? ErrorMessage.UNAUTHORIZED },
                { status: tokenResult.error?.code ?? StatusCode.Unauthorized }
            );
        };

        const user = await User.findById(tokenResult.data.id).select("-password").lean();

        if (!user) {
            return NextResponse.json(
                { error: ErrorMessage.NOT_FOUND },
                { status: StatusCode.NotFound }
            );
        };
        
        return NextResponse.json({ user });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ErrorMessage.ERROR_DEFAULT;
        
        return NextResponse.json(
            { error: errorMessage },
            { status: StatusCode.InternalServerError }
        );
    }
}