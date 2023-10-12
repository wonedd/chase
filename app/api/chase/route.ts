import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

export async function GET(req: NextRequest) {
  const { db, client } = await connectToDatabase();

  if (client) {
    try {
      const companies = await db.collection("chaseio")
        .find({})
        .limit(10)
        .toArray();
        return NextResponse.json({ companies });
    } catch (error) {
      return new NextResponse('Error fetching data from MongoDB' , { status: 500 });

    }
  } else {
    return new NextResponse('DB client is not connected' , { status: 500 });
  }
}
