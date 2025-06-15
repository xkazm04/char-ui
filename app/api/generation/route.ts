import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = process.env.DB_NAME || 'char';

export async function GET(request: NextRequest) {
  console.log('🔍 Generation API route called');
  
  try {
    const { searchParams } = new URL(request.url);
    const characterId = searchParams.get('character_id');
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    console.log(`📊 Params - characterId: ${characterId}, skip: ${skip}, limit: ${limit}`);

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection('generations');

    let filterQuery: any = {};

    if (characterId) {
      if (!ObjectId.isValid(characterId)) {
        return NextResponse.json(
          { error: 'Invalid character_id format' },
          { status: 400 }
        );
      }

      const characterObjId = new ObjectId(characterId);
      filterQuery.character_id = {
        $in: [characterObjId, characterId]
      };
    }

    // Try MongoDB first
    const generations = await collection
      .find(filterQuery, {
        projection: { description_vector: 0, embedding: 0, searchable_text: 0 }
      })
      .skip(skip)
      .limit(limit)
      .toArray();

    console.log(`✅ MongoDB returned ${generations.length} generations`);

    // ✅ **FALLBACK STRATEGY**: If MongoDB returns empty but should have data, try backend
    if (generations.length === 0) {
      console.log('📡 MongoDB returned empty, attempting backend fallback...');
      
      try {
        // Check if backend is available and try fallback
        const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';
        const fallbackParams = new URLSearchParams();
        
        if (characterId) {
          fallbackParams.append('character_id', characterId);
        }
        fallbackParams.append('skip', skip.toString());
        fallbackParams.append('limit', limit.toString());
        
        const fallbackResponse = await fetch(
          `${backendUrl}/gen?${fallbackParams.toString()}`,
          { 
            headers: { 'Accept': 'application/json' },
            // Add timeout to prevent hanging
            signal: AbortSignal.timeout(5000)
          }
        );

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log(`🔄 Backend fallback returned ${Array.isArray(fallbackData) ? fallbackData.length : 0} generations`);
          
          if (Array.isArray(fallbackData) && fallbackData.length > 0) {
            // Process fallback data to match our format
            const processedFallback = fallbackData.map(gen => ({
              ...gen,
              _id: gen._id?.toString() || gen._id,
              character_id: gen.character_id?.toString() || gen.character_id,
              __source: 'backend_fallback' // Mark as fallback data
            }));
            
            return NextResponse.json(processedFallback);
          }
        } else {
          console.log(`⚠️ Backend fallback failed with status: ${fallbackResponse.status}`);
        }
      } catch (fallbackError) {
        console.log(`⚠️ Backend fallback error: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`);
      }
      
      // Return empty array if both MongoDB and fallback return no data
      console.log('📭 Both MongoDB and fallback returned empty, returning empty array');
      return NextResponse.json([]);
    }

    // Process MongoDB results
    const processedGenerations = generations.map(gen => ({
      ...gen,
      _id: gen._id.toString(),
      character_id: gen.character_id?.toString() || gen.character_id,
      created_at: gen.created_at || new Date(),
      is_3d_generating: Boolean(gen.is_3d_generating),
      has_3d_model: Boolean(gen.has_3d_model),
      meshy: gen.meshy ? {
        ...gen.meshy,
        is_polling: Boolean(gen.meshy.is_polling),
        progress: gen.meshy.progress || 0
      } : undefined,
      __source: 'mongodb' // Mark as MongoDB data
    }));

    return NextResponse.json(processedGenerations);

  } catch (error) {
    console.error('💥 Error in generation route:', error);
    
    // ✅ **SILENT FALLBACK**: On any error, try backend before giving up
    try {
      console.log('🆘 MongoDB failed, attempting emergency backend fallback...');
      
      const { searchParams } = new URL(request.url);
      const characterId = searchParams.get('character_id');
      const skip = parseInt(searchParams.get('skip') || '0');
      const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
      
      const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';
      const fallbackParams = new URLSearchParams();
      
      if (characterId) {
        fallbackParams.append('character_id', characterId);
      }
      fallbackParams.append('skip', skip.toString());
      fallbackParams.append('limit', limit.toString());
      
      const emergencyResponse = await fetch(
        `${backendUrl}/gen?${fallbackParams.toString()}`,
        { 
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(5000)
        }
      );

      if (emergencyResponse.ok) {
        const emergencyData = await emergencyResponse.json();
        console.log(`🚑 Emergency backend fallback successful`);
        
        const processedEmergency = Array.isArray(emergencyData) ? 
          emergencyData.map(gen => ({
            ...gen,
            _id: gen._id?.toString() || gen._id,
            character_id: gen.character_id?.toString() || gen.character_id,
            __source: 'emergency_fallback'
          })) : [];
        
        return NextResponse.json(processedEmergency);
      }
    } catch (emergencyError) {
      console.log(`🚨 Emergency fallback also failed: ${emergencyError instanceof Error ? emergencyError.message : 'Unknown error'}`);
    }
    
    // ✅ **GRACEFUL DEGRADATION**: Return empty array instead of error
    console.log('📭 All attempts failed, returning empty array');
    return NextResponse.json([]);
  }
}