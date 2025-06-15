import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = process.env.DB_NAME || 'char';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid generation ID format' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection('generation');

    const generation = await collection.findOne(
      { _id: new ObjectId(id) },
      {
        projection: {
          description_vector: 0,
          embedding: 0
        }
      }
    );

    if (!generation) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      );
    }

    const processedGeneration = {
      ...generation,
      _id: generation._id.toString(),
      character_id: generation.character_id?.toString() || generation.character_id
    };

    return NextResponse.json(processedGeneration);

  } catch (error) {
    console.error('Error fetching generation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch generation', details: error instanceof Error ? error.message : 'Unknown error' },
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
        { error: 'Invalid generation ID format' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection('generation');

    // First, get the generation to extract leo_id for external cleanup
    const generation = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!generation) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      );
    }

    // Delete from MongoDB
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      );
    }

    // Handle external cleanup (Leonardo API) if needed
    if (generation.leo_id) {
      try {
        // Call your backend API for Leonardo cleanup
        const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL;
        await fetch(`${backendUrl}/internal/cleanup-leonardo/${generation.leo_id}`, {
          method: 'DELETE',
        }).catch(error => {
          console.warn('Leonardo cleanup failed:', error);
          // Don't fail the main delete operation
        });
      } catch (error) {
        console.warn('External cleanup failed:', error);
      }
    }

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error('Error deleting generation:', error);
    return NextResponse.json(
      { error: 'Failed to delete generation', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}