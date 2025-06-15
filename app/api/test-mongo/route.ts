// app/api/test-mongo/route.ts
import { NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/mongodb';

export async function GET() {
  try {
    console.log('🧪 Testing MongoDB connection...');
    
    const db = await getDatabase();
    console.log('✅ Database connection successful');
    
    // Test assets collection
    const assetsCollection = db.collection('assets');
    const assetCount = await assetsCollection.countDocuments();
    console.log(`📊 Assets collection has ${assetCount} documents`);
    
    // Test a simple query
    const sampleAsset = await assetsCollection.findOne({}, { projection: { name: 1, type: 1 } });
    console.log('📄 Sample asset:', sampleAsset);
    
    return NextResponse.json({
      status: 'success',
      database: 'connected',
      assetsCount: assetCount,
      sampleAsset: sampleAsset,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('💥 MongoDB test failed:', error);
    
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}