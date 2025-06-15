// app/api/generation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = process.env.DB_NAME || 'char';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const characterId = searchParams.get('character_id');
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection('generation');

    let filterQuery: any = {};

    if (characterId) {
      if (!ObjectId.isValid(characterId)) {
        return NextResponse.json(
          { error: 'Invalid character_id format' },
          { status: 400 }
        );
      }

      const characterObjId = new ObjectId(characterId);
      
      // Handle both ObjectId and string formats for data consistency
      filterQuery.character_id = {
        $in: [characterObjId, characterId]
      };
    }

    // Projection to exclude heavy fields
    const projection = {
      description_vector: 0,
      embedding: 0,
      searchable_text: 0
    };

    // Use aggregation for better performance and sorting
    const pipeline = [
      { $match: filterQuery },
      { $project: projection },
      { $sort: { created_at: -1 } }, // Sort by newest first
      { $skip: skip },
      { $limit: limit }
    ];

    const generations = await collection.aggregate(pipeline).toArray();

    // Process generations to ensure proper format
    const processedGenerations = generations.map(gen => ({
      ...gen,
      _id: gen._id.toString(),
      character_id: gen.character_id?.toString() || gen.character_id,
      created_at: gen.created_at || new Date(),
      // Ensure boolean fields are properly typed
      is_3d_generating: Boolean(gen.is_3d_generating),
      has_3d_model: Boolean(gen.has_3d_model),
      // Handle meshy metadata
      meshy: gen.meshy ? {
        ...gen.meshy,
        is_polling: Boolean(gen.meshy.is_polling),
        progress: gen.meshy.progress || 0
      } : undefined
    }));

    return NextResponse.json(processedGenerations);

  } catch (error) {
    console.error('Error fetching generations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch generations' },
      { status: 500 }
    );
  }
}