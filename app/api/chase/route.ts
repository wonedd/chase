import { Readable } from 'stream';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

export async function GET(req: NextRequest) {
  const { db, client } = await connectToDatabase();

  if (client) {
    try {
      const companiesCursor = db.collection("chaseio").find({}).limit(10000);

      const chunks: string[] = [];

      const stream = new Readable({
        read(size) {
          companiesCursor.next().then((company: any) => {
            if (company) {
              this.push(JSON.stringify(company) + '\n');
            } else {
              this.push(null);
            }
          }).catch((error: any) => {
            this.emit('error', error); 
          });
        },
      });

      stream.on('data', (chunk) => {
        chunks.push(chunk);
      });

      return new Promise<NextResponse>((resolve, reject) => {
        stream.on('end', () => {
          const data = chunks.join(''); 
          client.close(); 

          resolve(new NextResponse(data, { status: 200, headers: { 'Content-Type': 'application/json' } }));
        });

        stream.on('error', (error) => {
          console.error('Error reading data from MongoDB', error);
          client.close(); 
          reject(new NextResponse('Error fetching data from MongoDB', { status: 500 }));
        });
      });
    } catch (error) {
      console.error('Error connecting to MongoDB', error);
      return new NextResponse('Error connecting to MongoDB', { status: 500 });
    }
  } else {
    return new NextResponse('DB client is not connected', { status: 500 });
  }
}
