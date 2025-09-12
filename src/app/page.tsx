'use client';

export default function CookieTestPage() {
  const handleTestCookie = async () => {
    console.log('Attempting to set test cookie...');
    try {
      const response = await fetch('/api/test-cookie', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        console.log('API responded with success. Now check the browser for the cookie.');
        alert('API call successful! Now check for the cookie in the Application tab.');
      } else {
        throw new Error('API did not return success');
      }
    } catch (error) {
      console.error('Test cookie call failed:', error);
      alert('API call failed. Check the console for errors.');
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Cookie Test Page</h1>
      <p>This page has one purpose: to see if we can set a cookie.</p>
      <button onClick={handleTestCookie} style={{ fontSize: '18px', padding: '10px' }}>
        Set Test Cookie
      </button>
      <p style={{ marginTop: '20px' }}>
        <strong>Instructions:</strong> 1. Open Developer Tools (F12). 2. Click the button. 3. Go to the "Application" (Chrome) or "Storage" (Firefox) tab and click "Cookies" to see if a "test-cookie" was set.
      </p>
    </div>
  );
}git push
