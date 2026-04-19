"use client";

import { useEffect, useState } from 'react';
import TestDatabase from '@/lib/test-database';

export default function TestPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function runTest() {
      const result = await TestDatabase();
      setResults(result);
      setLoading(false);
    }

    runTest();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h1>Testing Database Connection...</h1>
        <p>Check console for detailed logs</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Database Test Results</h1>

      {results?.error ? (
        <div style={{ color: 'red', background: '#ffe6e6', padding: '10px', borderRadius: '5px' }}>
          <h2>Error: {results.error}</h2>
          <pre>{JSON.stringify(results.details, null, 2)}</pre>
        </div>
      ) : (
        <div style={{ background: '#e6ffe6', padding: '10px', borderRadius: '5px' }}>
          <h2 style={{ color: 'green' }}>Success!</h2>
          <p><strong>Total Posts:</strong> {results.totalPosts}</p>
          <p><strong>Video Posts:</strong> {results.videoPosts}</p>

          {results.videoPosts > 0 && (
            <div>
              <h3>Video Posts Details:</h3>
              {results.videoPostsDetails.map((post: any, index: number) => (
                <div key={post.id} style={{ margin: '10px 0', padding: '10px', background: '#f0f0f0', borderRadius: '5px' }}>
                  <p><strong>Video {index + 1}:</strong> {post.title}</p>
                  <p><strong>ID:</strong> {post.id}</p>
                  <p><strong>Video URL:</strong> {post.video_url || 'No video URL'}</p>
                  <p><strong>Has Video URL:</strong> {post.video_url ? 'Yes' : 'No'}</p>
                </div>
              ))}
            </div>
          )}

          {results.videoPosts === 0 && (
            <div style={{ color: 'orange', background: '#fff3cd', padding: '10px', borderRadius: '5px', margin: '10px 0' }}>
              <h3>No Video Posts Found!</h3>
              <p>You need to add video posts to the database.</p>
              <p>Run the SQL file: <code>test-videos-data.sql</code> in Supabase SQL Editor</p>
            </div>
          )}
        </div>
      )}

      <div style={{ margin: '20px 0', padding: '10px', background: '#f8f9fa', borderRadius: '5px' }}>
        <h3>Console Logs:</h3>
        <p>Open Developer Tools (F12) → Console tab to see detailed logs</p>
      </div>
    </div>
  );
}