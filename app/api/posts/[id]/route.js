// app/api/posts/[id]/route.js

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const resolvedParams = await params;
    const client = await clientPromise;
    const db = client.db('blog');
    
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    await db.collection('posts').updateOne(
      { _id: new ObjectId(resolvedParams.id) },
      { 
        $set: { 
          title: body.title,
          slug: slug,
          excerpt: body.excerpt,
          content: body.content,
          published: body.published,
          updatedAt: new Date()
        } 
      }
    );
    
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Error updating post:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    console.log('Deleting post with ID:', resolvedParams.id);
    
    const client = await clientPromise;
    const db = client.db('blog');
    
    const result = await db.collection('posts').deleteOne({ 
      _id: new ObjectId(resolvedParams.id) 
    });
    
    console.log('Delete result:', result);
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Error deleting post:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}