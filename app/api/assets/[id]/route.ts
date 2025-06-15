import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = process.env.DB_NAME || 'char';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid asset ID format' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection('assets');

    const asset = await collection.findOne(
      { _id: new ObjectId(id) },
      {
        projection: {
          description_vector: 0,
          image_embedding: 0
        }
      }
    );

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    // Process the asset to ensure proper format
    const processedAsset = {
      ...asset,
      _id: asset._id.toString(),
      // Handle image data if present
      ...(asset.image_data && Buffer.isBuffer(asset.image_data) && {
        image_data_base64: asset.image_data.toString('base64'),
        image_content_type: asset.contentType || 'image/png'
      })
    };

    // Remove the raw image_data if we converted it
    if (processedAsset.image_data_base64) {
      delete processedAsset.image_data;
    }

    return NextResponse.json(processedAsset);

  } catch (error) {
    console.error('Error fetching asset:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asset', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid asset ID format' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection('assets');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error('Error deleting asset:', error);
    return NextResponse.json(
      { error: 'Failed to delete asset', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}